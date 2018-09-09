'use strict'

const GitHubClient = require('./github-client')

module.exports = {
  create: (options = {}) => {

    const client = options.client || GitHubClient.create()

    return {
      async searchRepositories({ q, sort, page = 1 }) {

        const response = await client.searchRepositories({ q, sort, page })
        return {
          total: response.body.total_count,
          repositories: response.body.items.map(i => ({
            id: i.id,
            name: i.name,
            description: i.description,
            stars: i.stargazers_count,
            language: i.language,
            owner: {
              login: i.owner.login
            }
          }))
        }
      }
    }
  }
}