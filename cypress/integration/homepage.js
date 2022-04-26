describe('Homepage of URL Shortener site', () => {
  beforeEach(() => {
    cy.intercept('http://localhost:3001/api/v1/urls', { fixture: 'urls.json' }).as('allUrls')

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

})