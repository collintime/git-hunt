'use strict'

const Joi = require('joi')
const GithubRepository = require('./github-repository')
const Boom = require('boom')

module.exports = {
  name: 'github-search',
  version: '0.0.1',
  register: async function (server, options) {

    const repo = GithubRepository.create()

    const searchRepositories = async (query) => {
      
      return await repo.searchRepositories(query)
    }

    server.method('searchRepositories', searchRepositories, {
      cache: {
        cache: 'githubCache',
        expiresIn: options.searchResultsTtl,
        generateTimeout: options.searchResultsTimeout
      },
      generateKey: (search) => {
        
        return JSON.stringify(search)
      }
    })

    server.route({
      method:'GET',
      path:'/repositories/search',
      options: {
        validate: {
          query: {
            q: Joi.string().required(),
            sort: Joi.string().valid(['stars', 'forks', 'updated']),
            page: Joi.number().integer().default(1)
          }
        }
      },
      handler: async function(request) {

        try {
          return await server.methods.searchRepositories(request.query)
        }
        catch (err) {
          // github returns 403 for rate limited
          if (err.statusCode === 403) {
            throw Boom.tooManyRequests()
          }
          throw err
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/',
      handler: async (request, h) => {

        return h.file('public/index.html', { confine: false })
      }
    })

    server.route({
      method: 'GET',
      path: '/index.js',
      handler: async (request, h) => {

        return h.file('dist/bundle.js', { confine: false })
      }
    })
  }
}