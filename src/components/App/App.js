import React, { Component } from 'react';
import './App.css';
import { fetchUrls, deleteUrl } from '../../apiCalls';
import UrlContainer from '../UrlContainer/UrlContainer';
import UrlForm from '../UrlForm/UrlForm';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: [],
      error: null
    }
  }

  componentDidMount = () => this.getUrls();

  getUrls = () => {
    fetchUrls()
      .then(data => this.setState({ urls: data.urls, error: null }))
      .catch(err => this.setState({ error: 'Unable to fetch urls. Please try again later.' }))
  }

  addUrl = newUrl => {
    this.setState({ urls: [...this.state.urls, newUrl] })
  }

  removeUrl = id => {
    deleteUrl(id)
      .then(data => {
        let newUrls = this.state.urls.filter(url => url.id !== id);
        this.setState({ urls: newUrls });
      })
      .catch(err => this.setState({ error: 'Unable to delete url. Please try again later.' }))
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>URL Shortener</h1>
          <UrlForm addUrl={this.addUrl} />
        </header>
        
        <UrlContainer urls={this.state.urls} error={this.state.error} removeUrl={this.removeUrl} />
      </main>
    );
  }
}

export default App;
