import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import './App.css'
import ky from 'ky';

class SearchForm extends Component {

  constructor(props) {

    super(props)
    this.state = {
      page: 1,
      // defaults to relevance
      sort: null,
      query: ''
    }
  }

  handleSubmit(e) {

    e.preventDefault()
    this.state.page = 1
    this.props.search(this.state)
  }

  updateSort(e) {

    this.state.sort = this.state.sort === 'stars' ? null : 'stars'
  }

  requestPage(e, num) {

    e.preventDefault()
    this.state.page += num
    this.props.search(this.state)
  }

  handleChange(e) {

    this.setState({ ...this.state, query: e.target.value });
  }

  render() {

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <label>
          <input type="text" value={this.state.query} onChange={e => this.handleChange(e)} />
        </label>
        <input type="submit" value="Search" />

        <label>
            <input type="checkbox" onChange={e => this.updateSort(e)} />
            by Stars
        </label>

        { this.props.displayNext ? <button onClick={e => this.requestPage(e, 1)}>Next Page</button> : null }
        { this.state.page > 1 ? <button onClick={e => this.requestPage(e, -1)}>Previous Page</button> : null }
      </form>
    )
  }
}

class SearchResults extends Component {

  constructor(props) {

    super(props)
  }

  getHeader() {

    if (this.props.items) {
      return this.props.items.length ? `Displaying ${this.props.items.length} of ${this.props.total} Results` : 'No results found. Try again?'
    }
  }

  render() {
    
    return (
      <div>
        <h1>{this.getHeader()}</h1>
        <ul>
          {this.props.items && this.props.items.map(r =>
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


class App extends Component {

  constructor() {
    super()
    this.state = {
      result: {
        repositories: null,
        total: 0
      },
      error: null
    }
  }

  searchRepositories(search) {

    let url = `/repositories/search?q=${encodeURI(search.query)}&page=${search.page}`
    if (search.sort) {
      url = `${url}&sort=${search.sort}`
    }
    ky.get(url)
      .then(response => response.json())
      .then(result => {
        
        this.setState({result})
      })
      .catch(err => {
        
        this.setState({result: { error: 'Unexpected Error' }})
      })
  }

  render() {

    return (
      <div className="App">
        <h1> Github Repository Search </h1>
        <p className='error'>{this.state.result.error}</p>
        <SearchForm
          search={s => this.searchRepositories(s)}
          displayNext={this.state.result.total > 30}
        />
        <SearchResults
          items={this.state.result.repositories}
          total={this.state.result.total}
        />
      </div>
    )
  }
}

export default hot(module)(App)