describe('Navigation', () => {
  before(() => {
    cy.visit('/')
  })

  it('Renders App', () => {
    cy.get('[data-cy=app-container]').should('exist')
  })
})
