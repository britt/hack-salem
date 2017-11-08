import React, { Component } from 'react'
import './App.css'

function VoteButton ({ onClick, children }) {
  return <div class='button'>
    <button onClick={onClick}>{children}</button>
  </div>
}

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
        this.setState({ loaded: true, results: data.results })
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
        this.setState({ voted: true })
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
      <div className='container'>
        <h1>HACK SALEM</h1>
        {
          this.state.voted
          ? null
          : [
            <h2>WHICH BEER DO YOU LIKE BETTER?</h2>,
            <form>
              <VoteButton onClick={this.handleClick.bind(this, 'IPA')}>
                I like the IPA.
              </VoteButton>
              <VoteButton onClick={this.handleClick.bind(this, 'SOUR')}>
                The sour is my favorite.
              </VoteButton>
            </form>
          ]
        }
        <h2>RESULTS SO FAR...</h2>
        <table className='results'>
          <tr>
            <th>BEER</th>
            <th>VOTES</th>
          </tr>
          {Object.keys(this.state.results).map((k) => {
            return <tr key={`result-${k}`}>
              <td>{k}</td>
              <td>{this.state.results[k]}</td>
            </tr>
          })}
        </table>
      </div>
    )
  }
}

export default App
