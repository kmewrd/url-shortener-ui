import React, { Component } from 'react';
import './App.css';
import { fetchUrls } from '../../apiCalls';
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

  render() {
    return (
      <main className="App">
        <header>
          <h1>URL Shortener</h1>
          <UrlForm />
        </header>

        <UrlContainer urls={this.state.urls}/>
      </main>
    );
  }
}

export default App;
