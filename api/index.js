'use strict'

const Path = require('path')
const Hapi = require('hapi')
const Config = require('./config.json')

const server = Hapi.server({
  host: Config.host,
  port: Config.port,
  cache: [{
    name: 'githubCache',
    engine: require('catbox-memory'),
    partition: 'repositories'
  }],
  routes: {
    files: {
      relativeTo: Path.join(__dirname, Config.filesRelativeTo)
    }
  }
})

async function start() {

  await server.register([{
    plugin: require('./src/github-search-plugin'),
    options: Config
  },
  require('inert')
  ])

  /* eslint-disable no-console */
  try {
    await server.start()
  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
  /* eslint-enable no-console */
}

start()