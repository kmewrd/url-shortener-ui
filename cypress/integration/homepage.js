describe('Homepage of URL Shortener site', () => {
  beforeEach(() => {
    cy.intercept('http://localhost:3001/api/v1/urls', { fixture: 'urls.json' }).as('allUrls')

    cy.visit('http://localhost:3000/')
  })

  it('should display the title of the page', () => {
    cy.get('header h1')
      .contains('URL Shortener')
  })

})