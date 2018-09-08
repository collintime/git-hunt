'use strict'

const Joi = require('joi')

module.exports = {
  name: 'github-search',
  version: '0.0.1',
  register: async function (server) {

    server.route({
      method:'GET',
      path:'/repositories/search',
      options: {
        validate: {
          query: {
            q: Joi.string().required(),
            sort: Joi.string().allow(['stars', 'forks', 'updated'])
          }
        }
      },
      handler: async function(request) {
        
        return request.query.sort || []
      }
    })
  }
}