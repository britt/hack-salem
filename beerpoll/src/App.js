import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    let voterId = localStorage.getItem('voterId')
    if (!voterId) {
      voterId = Math.floor(10000000000 * Math.random())
      localStorage.setItem('voterId', voterId)
    }

    this.state = {
      loaded: false,
      voted: false,
      voterId,
      results: []
    }
  }

  loadResults () {
    fetch('https://hack-salem.brittcrawford.com/poll')
    .then((res) => {
      if (res.ok && res.headers.get('content-type').includes('application/json')) {
        return res.json()
      }
      throw new Error('Problem loading results.')
    }).then((data) => {
      this.setState({loaded: true, results: data.results})
    })
    .catch((err) => {
      console.log('error loading poll results', err)
    })
  }

  componentDidMount () {
    if (!this.state.loaded) {
      this.loadResults()
    }
  }

  handleClick (value, event) {
    event.preventDefault()

    fetch('https://hack-salem.brittcrawford.com/poll', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': Number(this.state.voterId),
        'vote': value
      })
    }).then(res => {
      if (res.ok) {
        this.setState({voted: true})
        this.loadResults()
      }
    }).catch(err => { console.log('Error recording vote', err) })
  }

  render () {
    if (!this.state.loaded) {
      return (
        <div className='App'>
          <h1>HACK SALEM BEER POLL</h1>
          <p>Loading...</p>
        </div>
      )
    }

    return (
      <div>
        <h1>HACK SALEM</h1>
        <h2>Which beer do you like better?</h2>
        {
          this.state.voted
          ? null
          : <form>
            <div>
              <button onClick={this.handleClick.bind(this, 'IPA')}>Vote</button> I like the IPA.
            </div>
            <div>
              <button onClick={this.handleClick.bind(this, 'SOUR')}>Vote</button> The sour is my favorite.
            </div>
          </form>
        }
        <h2>Results so far</h2>
        <ul>
          {Object.keys(this.state.results).map((k) => <li key={`result-${k}`}>{k} {this.state.results[k]} votes</li>)}
        </ul>
      </div>
    )
  }
}

export default App
