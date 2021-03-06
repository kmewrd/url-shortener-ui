describe('Homepage of URL Shortener site', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', { fixture: 'urls.json' }).as('allUrls')

    cy.intercept('POST', 'http://localhost:3001/api/v1/urls', { fixture: 'newUrl.json' }).as('successfulPost')

    cy.intercept('DELETE', 'http://localhost:3001/api/v1/urls/2', { statusCode: 204 }).as('successfulDelete')

    cy.visit('http://localhost:3000/')
  })

  it('should display the title of the page', () => {
    cy.get('header h1')
      .contains('URL Shortener')
  })

  it('should display all shortened urls from the server', () => {
    cy.get('div[class="url"]:first')
      .should('have.descendants', 'h3')
      .and('contain', 'Awesome photo')
      .and('have.descendants', 'a')
      .and('contain', 'http://localhost:3001/useshorturl/1')
      .and('have.descendants', 'p')
      .and('contain', 'https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80')
  })

  it('should contain a form for users to submit a url', () => {
    cy.get('form')
      .should('have.descendants', 'input[name="title"]')
      .and('have.descendants', 'input[name="urlToShorten"]')
      .and('have.descendants', 'button')
  })

  it('should have placeholder text in the inputs to indicate what they should contain', () => {
    cy.get('input[name="title"]')
      .invoke('attr', 'placeholder')
      .should('contain', 'Title...')

    cy.get('input[name="urlToShorten"]')
      .invoke('attr', 'placeholder')
      .should('contain', 'URL to Shorten...')
  })

  it('should update the input values as a user enters text', () => {
    cy.get('input[name="title"]')
      .type('Cute lil chi')
      .should('have.value', 'Cute lil chi')

    cy.get('input[name="urlToShorten"]')
      .type('https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
      .should('have.value', 'https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
  })

  it('should display the new URL on the page after successful form submission', () => {
    cy.get('input[name="title"]')
      .type('Cute lil chi')
      .get('input[name="urlToShorten"]')
      .type('https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
      .get('form button')
      .click()

    cy.get('div[class="url"]:last')
      .should('contain', 'Cute lil chi')
      .and('contain', 'https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
  })

  it('should remove a url from the page if the delete button is clicked', () => {
    cy.get('input[name="title"]')
      .type('Cute lil chi')
      .get('input[name="urlToShorten"]')
      .type('https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
      .get('form button')
      .click()
      .get('main')
      .should('contain', 'Cute lil chi')
      .get('div[class="url"]:last button')
      .click()
      .get('main')
      .should('not.contain', 'Cute lil chi')
  })
})

describe('Error handling for homepage', () => {
  it('should display an error message if network fails on first GET request', () => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', { forceNetworkError: true }).as('getFailure')

    cy.visit('http://localhost:3000/')
      .get('main')
      .should('contain', 'Unable to fetch urls. Please try again later.')
  })

  it('should display an error message if user tries to submit incomplete fields', () => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', { fixture: 'urls.json' }).as('allUrls')

    cy.visit('http://localhost:3000/')
      .get('input[name="title"]')
      .type('Cute lil chi')
      .get('form button')
      .click()
      .get('form')
      .should('contain', 'Please fill out all fields!')
  })

  it('should hide the error message after user completes form fields and clicks submit', () => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', { fixture: 'urls.json' }).as('allUrls')

    cy.intercept('POST', 'http://localhost:3001/api/v1/urls', { fixture: 'newUrl.json' }).as('successfulPost')

    cy.visit('http://localhost:3000/')
      .get('input[name="title"]')
      .type('Cute lil chi')
      .get('form button')
      .click()
      .get('form')
      .should('contain', 'Please fill out all fields!')
      .get('input[name="urlToShorten"]')
      .type('https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
      .get('form button')
      .click()
      .get('form')
      .should('not.contain', 'Please fill out all fields!')
  })

  it('should show an error message if unable to delete a url', () => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', { fixture: 'urls.json' }).as('allUrls')

    cy.intercept('POST', 'http://localhost:3001/api/v1/urls', { fixture: 'newUrl.json' }).as('successfulPost')

    cy.intercept('DELETE', 'http://localhost:3001/api/v1/urls/2', { forceNetworkError: true }).as('deleteFailure')

    cy.visit('http://localhost:3000/')
      .get('input[name="title"]')
      .type('Cute lil chi')
      .get('input[name="urlToShorten"]')
      .type('https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')
      .get('form button')
      .click()
      .get('div[class="url"]:last button')
      .click()
      .get('main')
      .should('contain', 'Unable to delete url. Please try again later.')
  })
})