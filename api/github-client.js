'use strict'

const Got = require('got')
const Hoek = require('hoek')

module.exports = {
  create: (config) => {

    const _url = 'https://api.github.com/search'
    const gotOptions = Hoek.applyToDefaults({
      timeout: 2000,
      json: true
    }, config)

    return {
      async searchRepositories(search, options = {}) {

        let url = `${_url}/repositories?q=${search.query}`
        // score (relevance) is default unless sort provided
        if (search.sort) {
          url = `${url}&sort=${search.sort}`
        }
        return Got.get(url, Hoek.applyToDefaults(options, gotOptions))
      }    
    }
  }
}