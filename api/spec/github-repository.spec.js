'use strict'

const Tap = require('tap')
const GitHubRepository = require('../github-repository')

Tap.test('creation', test => {

  const repo = GitHubRepository.create()
  test.ok(repo, 'it should have created a client')
  test.type(repo.searchRepositories, 'function', 'it should have a searcRepositories function')
  test.end()
})

Tap.test('searchRepositories', async test => {

  const item = { name: 'collintime', description: 'industries', language: 'js', stargazers_count: 5, owner: { login: 'collintime' }, ignore: 'this' }
  const response = {
    body: {
      items: [item]
    }
  }
  const repo = GitHubRepository.create({ client: { searchRepositories: () => response } })
  const result = await repo.searchRepositories({ q: 'doggos' })
  test.type(result, 'Array', 'it should return an array')
  const expected = { name: 'collintime', description: 'industries', language: 'js', stars: 5, owner: { login: 'collintime' } }
  test.same(result[0], expected, 'the array should return the item without additional keys')
  test.equal(result.length, 1, 'the array should not return more than one item')
  test.end()
})