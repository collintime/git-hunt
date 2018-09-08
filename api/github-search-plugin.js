'use strict'

const Joi = require('joi')
const GithubClient = require('./github-repository')

module.exports = {
  name: 'github-search',
  version: '0.0.1',
  register: async function (server) {

    server.decorate('server', 'githubRepository', GithubClient.create(), )
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
        
        return await request.server.githubRepository.searchRepositories(request.query)
      }
    })
  }
}