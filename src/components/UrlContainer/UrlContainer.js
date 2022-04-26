import React from 'react';
import './UrlContainer.css';

const UrlContainer = props => {
  const urlEls = props.urls.map(url => {
    return (
      <div className="url" key={url.id}>
        <h3>{url.title}</h3>
        <a href={url.short_url} target="blank">{url.short_url}</a>
        <p>{url.long_url}</p>
        <button onClick={() => props.removeUrl(url.id)}>Delete</button>
      </div>
    )
  });

  return (
    <section>
      { !!urlEls.length && urlEls }
      { props.error && <p>{props.error}</p> }
      { !urlEls.length && !props.error && <p>No urls yet! Find some to shorten!</p> }
    </section>
  )
}

export default UrlContainer;
