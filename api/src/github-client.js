'use strict'

const Got = require('got')
const Hoek = require('hoek')

module.exports = {
  create: (config = {}) => {

    const _url = 'https://api.github.com/search'
    const gotOptions = Hoek.applyToDefaults({
      timeout: 2000,
      json: true
    }, config)

    return {
      async searchRepositories(search, options = {}) {

        let url = `${_url}/repositories?q=${search.q}`
        // score (relevance) is default unless sort provided
        if (search.sort) {
          url = `${url}&sort=${search.sort}`
        }
        url = `${url}&page=${search.page || 1}`
        return Got.get(url, Hoek.applyToDefaults(gotOptions, options))
      }
    }
  }
}