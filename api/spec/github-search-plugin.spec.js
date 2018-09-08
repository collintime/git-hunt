'use strict'

const Tap = require('tap')
const Hapi = require('hapi')
const Boom = require('boom')
const Nock = require('nock')
const SearchResult = require('./search-result.json')

const internals = {
  createServer: async () => {

    const server = Hapi.server({
      host: 'localhost',
      port: 8000,
      routes: {
        validate: {
          failAction: async (request, h, err) => {

            return Boom.badRequest(err)
          }
        }
      }
    })

    await server.register({
      plugin: require('../github-search-plugin')
    })

    await server.start()
    return server
  }
}

Tap.test('plugin installation', async test => {

  const server = await internals.createServer()
  test.ok(server, 'the server should have started')
  await server.stop()
  test.end()
})

Tap.test('repository route valid request', async test => {

  Nock('https://api.github.com/search')
    .get('/repositories?q=doggos')
    .reply(200, SearchResult)

  const server = await internals.createServer()
  let response = await server.inject({ url: '/repositories/search?q=doggos' })
  test.same(response.result, [{
    description: 'Training materials for O\'Reilly',
    language: 'JavaScript',
    name: 'doggos',
    owner: {
      login: 'spruke'
    },
    stars: 12
  }], 'it should return an array')
  await server.stop()
  test.end()
})

Tap.test('repository route invalid requests', async test => {

  const invalids = [{
    url: '/repositories/search',
    message: 'child "q" fails because ["q" is required]'
  }, {
    url: '/repositories/search?sort=stars',
    message: 'child "q" fails because ["q" is required]'
  }, {
    url: '/repositories/search?q=whatever&sort=blah',
    message: 'child "sort" fails because ["sort" must be one of [stars, forks, updated]]'
  }]
  const server = await internals.createServer()

  for (let { url, message } of invalids) {
    let response = await server.inject({ url })
    test.same(response.statusCode, 400, `${url}: should return a 400 code`)
    test.same(response.result.message, message, `${url} should return a helpful error`)
  }

  await server.stop()
  test.end()
})