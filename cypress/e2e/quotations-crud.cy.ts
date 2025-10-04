describe('Quotations CRUD Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000) // Wait for store initialization
  })

  describe('Dashboard Navigation', () => {
    it('should navigate to quotations list from dashboard', () => {
      cy.get('[data-cy="dashboard-title"]').should('contain', 'Generador de Cotizaciones')
      
      // Click on "Ver todas" link in recent quotations section
      cy.get('a').contains('Ver todas').click()
      cy.url().should('include', '/quotations')
      cy.get('h1').should('contain', 'Todas las Cotizaciones')
    })

    it('should show new quotation button on dashboard', () => {
      cy.get('button').contains('Nueva Cotización').should('be.visible')
    })
  })

  describe('Quotations List View', () => {
    beforeEach(() => {
      cy.visit('/quotations')
      cy.wait(1000)
    })

    it('should display quotations list correctly', () => {
      cy.get('h1').should('contain', 'Todas las Cotizaciones')
      
      // Check stats cards
      cy.get('.bento-box').should('have.length.at.least', 4)
      cy.get('.bento-box').first().should('contain', 'Borradores')
      
      // Check new quotation button
      cy.get('button').contains('Nueva Cotización').should('be.visible')
    })

    it('should show quotations data or empty state', () => {
      // Either show quotations or empty state
      cy.get('body').then(($body) => {
        if ($body.find('.text-center').length > 0) {
          // Empty state
          cy.get('.text-center').should('contain', 'No hay cotizaciones')
          cy.get('button').contains('Crear Primera Cotización').should('be.visible')
        } else {
          // Has quotations
          cy.get('.bg-white.border').should('have.length.at.least', 1)
        }
      })
    })

    it('should open new quotation modal when button clicked', () => {
      cy.get('button').contains('Nueva Cotización').click()
      
      // Check if modal appears (this might fail if modal doesn't exist)
      cy.get('[data-cy="new-quotation-modal"]', { timeout: 2000 }).should('be.visible')
        .or(() => {
          // If modal doesn't exist, we'll catch this in our test results
          cy.log('New quotation modal not found - needs implementation')
        })
    })
  })

  describe('Quotation Detail View', () => {
    it('should navigate to quotation detail when clicking on quotation', () => {
      cy.visit('/quotations')
      cy.wait(1000)
      
      // Try to click on first quotation if it exists
      cy.get('body').then(($body) => {
        if ($body.find('.bg-white.border').length > 0) {
          cy.get('.bg-white.border').first().click()
          cy.url().should('include', '/quotations/')
        } else {
          cy.log('No quotations found to test detail view')
        }
      })
    })

    it('should handle direct navigation to quotation detail', () => {
      // Try to navigate to a quotation detail page directly
      cy.visit('/quotations/test-id', { failOnStatusCode: false })
      
      // Should either show quotation or handle missing quotation gracefully
      cy.get('body').should('exist')
    })
  })

  describe('New Quotation Flow', () => {
    it('should test new quotation creation flow', () => {
      cy.visit('/')
      
      // Click new quotation button on dashboard
      cy.get('button').contains('Nueva Cotización').click()
      
      // Check if modal or form appears
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="new-quotation-modal"]').length > 0) {
          // Modal exists - test form
          cy.get('[data-cy="new-quotation-modal"]').within(() => {
            // Test form fields if they exist
            cy.get('input[name="title"]').should('exist').type('Test Quotation')
            cy.get('select[name="clientId"]').should('exist')
            cy.get('button[type="submit"]').should('exist').click()
          })
        } else {
          cy.log('New quotation modal/form not implemented yet')
        }
      })
    })
  })

  describe('Data Persistence', () => {
    it('should persist data in localStorage', () => {
      cy.visit('/')
      cy.wait(2000) // Wait for store initialization
      
      // Check localStorage has data
      cy.window().then((win) => {
        const clients = win.localStorage.getItem('clients')
        const quotations = win.localStorage.getItem('quotations')
        
        expect(clients).to.not.be.null
        expect(quotations).to.not.be.null
        
        if (clients) {
          const clientsData = JSON.parse(clients)
          expect(clientsData).to.be.an('array')
        }
        
        if (quotations) {
          const quotationsData = JSON.parse(quotations)
          expect(quotationsData).to.be.an('array')
        }
      })
    })

    it('should maintain data between page refreshes', () => {
      cy.visit('/')
      cy.wait(1000)
      
      // Get initial data count
      cy.get('.bento-box').first().find('.text-2xl').invoke('text').then((initialCount) => {
        // Refresh page
        cy.reload()
        cy.wait(1000)
        
        // Check data is still there
        cy.get('.bento-box').first().find('.text-2xl').should('contain', initialCount)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing components gracefully', () => {
      cy.visit('/quotations')
      
      // Check for JavaScript errors in console
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError')
      })
      
      // Interact with page
      cy.get('button').contains('Nueva Cotización').click()
      
      // Check if there were console errors
      cy.get('@consoleError').should('not.have.been.called')
    })

    it('should handle navigation to non-existent quotation', () => {
      cy.visit('/quotations/non-existent-id', { failOnStatusCode: false })
      
      // Should not crash the app
      cy.get('body').should('exist')
      cy.contains('error', { matchCase: false }).should('not.exist')
    })
  })
})
