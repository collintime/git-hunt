'use strict'

const GitHubClient = require('./github-client')

module.exports = {
  create: (options = {}) => {

    const client = options.client || GitHubClient.create()

    return {
      async searchRepositories({ q, sort }) {

        const response = await client.searchRepositories({ q, sort })
        return response.body.items.map(i => ({
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