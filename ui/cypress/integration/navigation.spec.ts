describe('Navigation', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: () => {
        localStorage.setItem('i18nextLng', 'fi')
      }
    })
  })

  it('Renders App', () => {
    cy.get('[data-cy=app-container]').should('exist')
  })

  it('Routes to URL paths of the pages from the navigation menu', () => {
    cy.get('[data-cy=navigation-panel]').within(() => {
      cy.contains('Laitoshaku').click()
      cy.url().should('eq', 'http://localhost:3000/facilities')
      cy.contains('Päästöt').click()
      cy.url().should('eq', 'http://localhost:3000/releases')
      cy.contains('Etusivu').click()
      cy.url().should('eq', 'http://localhost:3000/')
    })
  })
})
