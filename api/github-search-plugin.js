'use strict'

const Joi = require('joi')
const GithubRepository = require('./github-repository')

module.exports = {
  name: 'github-search',
  version: '0.0.1',
  register: async function (server) {

    const repo = GithubRepository.create()

    const searchRepositories = async (query) => {
      
      return await repo.searchRepositories(query)
    }

    server.method('searchRepositories', searchRepositories, {
      cache: {
        cache: 'githubCache',
        expiresIn: 10 * 1000,
        generateTimeout: 2000
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
            sort: Joi.string().valid(['stars', 'forks', 'updated'])
          }
        }
      },
      handler: async function(request) {
        
        return await server.methods.searchRepositories(request.query)
      }
    })
  }
}