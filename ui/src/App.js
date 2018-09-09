import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import './App.css'
import ky from 'ky';

class App extends Component {

  constructor() {
    super()
    this.state = {
      query: '',
      repositories: [],
      page: 1,
      searchComplete: false,
      total: 0,
      sort: null
    }
  }

  handleClick (e) {

    e.preventDefault()
    ky.get('/repositories/search?q=doggos')
      .then(response => response.json())
      .then(json => {

        this.setState({ repositories: json })
      })
  }

  handleChange(e) {

    this.setState({ ...this.state, query: e.target.value});
  }

  searchRepositories () {

    let url = `/repositories/search?q=${encodeURI(this.state.query)}&page=${this.state.page}`
    if (this.state.sort) {
      url = `${url}&sort=${this.state.sort}`
    }
    ky.get(url)
      .then(response => response.json())
      .then(result => {

        this.setState({ ...this.state, repositories: result.repositories, count: result.repositories.length, searchComplete: true, total: result.total })
      })
  }

  handleSubmit(e) {

    e.preventDefault()
    this.state.page = 1
    this.searchRepositories()
  }

  nextPage() {

    ++this.state.page
    this.searchRepositories()
  }

  previousPage () {

    --this.state.page
    this.searchRepositories()
  }

  requestPage (num) {

    this.state.page += num
    this.searchRepositories()
  }

  getHeader () {
    
    if (this.state.searchComplete) {
      return this.state.repositories.length ? `Displaying ${this.state.repositories.length} of ${this.state.total} Results` : 'No results found. Try again?'
    }
  }

  sortByStars (e) {

    this.state.sort = this.state.sort === 'stars' ? null : 'stars'
  }

  render() {

    return (
      <div className="App">
        <h1> Github Repository Search </h1>
        
        <form onSubmit={e => this.handleSubmit(e)}>
          <label>
            <input type="text" value={this.state.query} onChange={e => this.handleChange(e)} />
          </label>
          <input type="submit" value="Submit" />
          
          <label>
            Sort by Stars
            <input type="checkbox" onChange={e => this.sortByStars(e)} />
          </label>
        </form>

        <h1>{this.getHeader()}</h1>
        {
          ((this.state.repositories.length < this.state.total && this.state.page > 1) ? <button onClick={e => this.requestPage(-1)}>Previous Page</button> : null )
        }

        {
          (this.state.repositories.length && this.state.total > 30) ? <button onClick={e => this.requestPage(1)}>Next Page</button> : null
        }
        
        <ul>
          {this.state.repositories.map(r =>
            <li key={r.id}>
              <h3><a href={`https://github.com/${r.owner.login}/${r.name}`} target='_blank'>{r.name}</a></h3>
              <p>{r.description}</p>
              <p>Stars: <a href={`https://github.com/${r.owner.login}/${r.name}/stargazers`} target='_blank'>{r.stars}</a></p>
              <p>Language: {r.language}</p>
              <p>Owner: <a href={`https://github.com/${r.owner.login}`} target='_blank'>{r.owner.login}</a></p>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default hot(module)(App)