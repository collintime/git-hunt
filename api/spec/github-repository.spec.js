'use strict'

const Tap = require('tap')
const GitHubRepository = require('../src/github-repository')

Tap.test('creation', test => {

  const repo = GitHubRepository.create()
  test.ok(repo, 'it should have created a client')
  test.type(repo.searchRepositories, 'function', 'it should have a searcRepositories function')
  test.end()
})

Tap.test('searchRepositories', async test => {

  const item = { id: 1, name: 'collintime', description: 'industries', language: 'js', stargazers_count: 5, owner: { login: 'collintime' }, ignore: 'this' }
  const response = {
    body: {
      total_count: 1,
      items: [item]
    }
  }
  const repo = GitHubRepository.create({ client: { searchRepositories: () => response } })
  const result = await repo.searchRepositories({ q: 'doggos' })
  test.type(result, 'object', 'it should return an object')
  const expected = { total: 1, repositories: [{ id: 1, name: 'collintime', description: 'industries', language: 'js', stars: 5, owner: { login: 'collintime' } }] }
  test.same(result, expected, 'the array should return the item without additional keys')
  test.end()
})