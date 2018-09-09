'use strict'

const Tap = require('tap')
const GithubClient = require('../src/github-client')
const Nock = require('nock')

Tap.test('constructor', test => {

  const client = GithubClient.create()
  test.ok(client, 'it should have created a client')
  test.type(client.searchRepositories, 'function', 'it should have a searcRepositories function')
  test.end()
})

Tap.test('searchRepositories', async test => {

  Nock('https://api.github.com/search')
    .get('/repositories?q=doggos&page=1')
    .reply(200, [])
  const client = GithubClient.create()
  const response = await client.searchRepositories({ q: 'doggos' })
  test.equal(response.statusCode, 200, 'it should return with a 200')
  test.equal(response.url, 'https://api.github.com/search/repositories?q=doggos&page=1')
  test.end()
})

Tap.test('searchRepositories with options', async test => {

  Nock('https://api.github.com/search')
    .get('/repositories?q=doggos&sort=stars&page=1')
    .reply('200', [])
  const client = GithubClient.create()
  const response = await client.searchRepositories({ q: 'doggos', sort: 'stars' })
  test.equal(response.statusCode, 200, 'it should return with a 200')
  test.equal(response.url, 'https://api.github.com/search/repositories?q=doggos&sort=stars&page=1')
  test.end()
})
