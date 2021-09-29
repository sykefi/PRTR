describe('Facilities', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: () => {
        localStorage.setItem('i18nextLng', 'fi')
      }
    })
  })

  it('Shows and hides load animation after opening the facilities page', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/v1/facilities**'
      },
      {
        fixture: 'allFacilities.json',
        delay: 200
      }
    )
    cy.get('[data-cy=navigation-panel]').within(() => {
      cy.contains('Laitoshaku').click()
      cy.url().should('eq', 'http://localhost:3000/facilities')
    })
    cy.get('[data-cy=facilities-load-animation]').should('exist')
    cy.get('[data-cy=facilities-load-animation]').should('not.exist')
  })

  it('Shows search options', () => {
    cy.get('[data-cy=facility-search-panel]').should('exist')
  })

  it('Disables search input initially', () => {
    cy.get('[data-cy=search-facilities-btn]').should('be.disabled')
  })

  it('Shows page selector', () => {
    cy.get('[data-cy=result-page-selector]').should('exist')
    cy.get('[data-cy=result-page-selector]').within(() => {
      cy.contains('1-20')
    })
  })

  it('Does not initially show the previous page button', () => {
    cy.get('[data-cy=previous-page-btn').should('not.exist')
  })

  it('Shows facility list', () => {
    cy.get('[data-cy=facility-list]').should('exist')
  })

  it('Shows facility list items (> 10)', () => {
    cy.get('[data-cy=facility-list]')
      .children()
      .its('length')
      .should('be.gt', 10)
  })

  it('Shows facility name(s) in the list', () => {
    cy.get('[data-cy=facility-list]').within(() => {
      cy.contains('Karhula Components Oy')
      cy.contains('Aspocomp Oy, Salon tehdas')
    })
  })

  it('Opens next page of the reslts', () => {
    cy.get('[data-cy=next-page-btn').click()
    cy.get('[data-cy=result-page-selector]').within(() => {
      cy.contains('21-40')
    })
    cy.get('[data-cy=facility-list]')
      .children()
      .its('length')
      .should('be.gt', 10)
  })

  it('Types a search term to the search input', () => {
    cy.get('[data-cy=facility-search-term]')
      .type('Porvoo')
      .should('have.value', 'Porvoo')
  })

  it('Searches facilities', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/v1/facilities**'
      },
      {
        fixture: 'searchFacilities.json',
        delay: 200
      }
    )
    cy.get('[data-cy=search-facilities-btn]').click()
    cy.get('[data-cy=facilities-load-animation]').should('exist')
    cy.get('[data-cy=facilities-load-animation]').should('not.exist')
  })

  it('Shows 10 results after search', () => {
    cy.get('[data-cy=search-result-info]').should('exist')
    cy.get('[data-cy=facility-list]')
      .children()
      .its('length')
      .should('be.eq', 10)
  })

  it('Goes back to initial facility list from "Palaa"', () => {
    cy.get('[data-cy=exit-results-btn]').click()
    cy.get('[data-cy=facilities-load-animation]').should('not.exist')
    cy.get('[data-cy=facility-list]')
      .children()
      .its('length')
      .should('be.gt', 10)
  })
})
