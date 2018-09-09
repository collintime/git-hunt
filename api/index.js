'use strict'

const Path = require('path')
const Hapi = require('hapi')

const server = Hapi.server({
  host: 'localhost',
  port: 8000,
  cache: [{
    name: 'githubCache',
    engine: require('catbox-memory'),
    partition: 'repositories'
  }],
  routes: {
    files: {
      relativeTo: Path.join(__dirname, '../ui')
    }
  }
})

async function start() {

  await server.register([{
    plugin: require('./src/github-search-plugin'),
    options: {
      message: 'hello'
    }
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