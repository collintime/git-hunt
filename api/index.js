'use strict'

const Hapi = require('hapi')

const server = Hapi.server({
  host: 'localhost',
  port: 8000
})

async function start() {

  await server.register({
    plugin: require('./github-search-plugin'),
    options: {
      message: 'hello'
    }
  })

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