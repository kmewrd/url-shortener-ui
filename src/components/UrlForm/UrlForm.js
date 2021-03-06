import React, { Component } from 'react';
import { postUrl } from '../../apiCalls';

class UrlForm extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      title: '',
      urlToShorten: '',
      error: null
    };
  }

  handleNameChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.sendUrl();
  }

  sendUrl = () => {
    if (!this.state.title || !this.state.urlToShorten) {
      this.setState({ error: 'Please fill out all fields!' })
    } else {
      const urlToPost = {
        long_url: this.state.urlToShorten,
        title: this.state.title
      }

      postUrl(urlToPost)
        .then(data => {
          this.props.addUrl(data);
          this.setState({ error: null });
        })
      this.clearInputs();
    }
  }

  clearInputs = () => {
    this.setState({title: '', urlToShorten: ''});
  }

  render() {
    return (
      <form>
        { this.state.error && <p>{this.state.error}</p> }
        <input
          type='text'
          placeholder='Title...'
          name='title'
          value={this.state.title}
          onChange={e => this.handleNameChange(e)}
        />

        <input
          type='text'
          placeholder='URL to Shorten...'
          name='urlToShorten'
          value={this.state.urlToShorten}
          onChange={e => this.handleNameChange(e)}
        />

        <button onClick={e => this.handleSubmit(e)}>
          Shorten Please!
        </button>
      </form>
    )
  }
}

export default UrlForm;
