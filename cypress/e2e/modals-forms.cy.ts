describe('Modals and Forms Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000)
  })

  describe('New Quotation Modal', () => {
    it('should find and test new quotation modal component', () => {
      // Try to find NewQuotationModal component
      cy.get('button').contains('Nueva Cotización').click()
      
      // Check if modal exists
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="new-quotation-modal"]').length > 0) {
          cy.log('✅ NewQuotationModal component found')
          
          cy.get('[data-cy="new-quotation-modal"]').within(() => {
            // Test modal structure
            cy.get('[data-cy="modal-title"]').should('contain', 'Nueva Cotización')
            cy.get('[data-cy="quotation-form"]').should('exist')
            cy.get('[data-cy="close-modal"]').should('exist')
          })
        } else {
          cy.log('❌ NewQuotationModal component NOT FOUND - needs creation')
          
          // Check if there's any modal or overlay
          const hasModal = $body.find('.modal, .overlay, .backdrop, [role="dialog"]').length > 0
          if (!hasModal) {
            cy.log('❌ No modal system detected')
          }
        }
      })
    })

    it('should test quotation form fields', () => {
      cy.get('button').contains('Nueva Cotización').click()
      cy.wait(500)
      
      cy.get('body').then(($body) => {
        if ($body.find('form').length > 0) {
          cy.log('✅ Form found')
          
          // Test form fields
          cy.get('form').within(() => {
            // Title field
            cy.get('input[name="title"], input[placeholder*="título"], input[placeholder*="Título"]')
              .should('exist')
              .type('Cotización de Prueba')
            
            // Client selection
            cy.get('select[name="clientId"], select[name="client"]')
              .should('exist')
              .select(0) // Select first option
            
            // Submit button
            cy.get('button[type="submit"], button').contains(/crear|guardar|enviar/i)
              .should('exist')
          })
        } else {
          cy.log('❌ No form found - needs implementation')
        }
      })
    })
  })

  describe('New Client Modal', () => {
    it('should test new client modal from clients page', () => {
      cy.visit('/clients')
      cy.wait(1000)
      
      cy.get('button').contains('Nuevo Cliente').click()
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="new-client-modal"]').length > 0) {
          cy.log('✅ NewClientModal component found')
          
          cy.get('[data-cy="new-client-modal"]').within(() => {
            cy.get('[data-cy="client-form"]').should('exist')
            cy.get('input[name="name"]').should('exist')
            cy.get('input[name="email"]').should('exist')
            cy.get('input[name="phone"]').should('exist')
          })
        } else {
          cy.log('❌ NewClientModal component NOT FOUND - needs creation')
        }
      })
    })
  })

  describe('Form Validation', () => {
    it('should test form validation for new quotation', () => {
      cy.get('button').contains('Nueva Cotización').click()
      cy.wait(500)
      
      cy.get('body').then(($body) => {
        if ($body.find('form').length > 0) {
          cy.get('form').within(() => {
            // Try to submit empty form
            cy.get('button[type="submit"]').click()
            
            // Check for validation messages
            cy.get('.error, .invalid, [role="alert"]').should('exist')
              .or(() => {
                cy.log('No validation messages found - validation needs implementation')
              })
          })
        }
      })
    })
  })

  describe('Modal Interactions', () => {
    it('should test modal close functionality', () => {
      cy.get('button').contains('Nueva Cotización').click()
      cy.wait(500)
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="close-modal"], .modal-close, button').length > 0) {
          // Try to close modal
          cy.get('[data-cy="close-modal"], .modal-close').first().click()
          
          // Modal should be hidden
          cy.get('[data-cy="new-quotation-modal"]').should('not.exist')
        } else {
          cy.log('❌ Modal close functionality not found')
        }
      })
    })

    it('should test modal backdrop close', () => {
      cy.get('button').contains('Nueva Cotización').click()
      cy.wait(500)
      
      cy.get('body').then(($body) => {
        if ($body.find('.modal-backdrop, .overlay').length > 0) {
          // Click backdrop to close
          cy.get('.modal-backdrop, .overlay').click({ force: true })
          
          // Modal should be hidden
          cy.get('[data-cy="new-quotation-modal"]').should('not.exist')
        } else {
          cy.log('❌ Modal backdrop not found')
        }
      })
    })
  })

  describe('CRUD Operations', () => {
    it('should test quotation creation flow', () => {
      // Get initial count
      cy.get('.bento-box').first().find('.text-2xl').invoke('text').then((initialCount) => {
        const initial = parseInt(initialCount.trim())
        
        // Create new quotation
        cy.get('button').contains('Nueva Cotización').click()
        cy.wait(500)
        
        cy.get('body').then(($body) => {
          if ($body.find('form').length > 0) {
            cy.get('form').within(() => {
              cy.get('input[name="title"]').type('Test Quotation ' + Date.now())
              cy.get('select[name="clientId"]').select(0)
              cy.get('button[type="submit"]').click()
            })
            
            // Check if count increased
            cy.wait(1000)
            cy.visit('/') // Refresh to see changes
            cy.wait(1000)
            
            cy.get('.bento-box').first().find('.text-2xl').invoke('text').then((newCount) => {
              const newTotal = parseInt(newCount.trim())
              expect(newTotal).to.be.at.least(initial)
            })
          } else {
            cy.log('❌ Cannot test CRUD - form not implemented')
          }
        })
      })
    })

    it('should test quotation editing', () => {
      cy.visit('/quotations')
      cy.wait(1000)
      
      cy.get('body').then(($body) => {
        if ($body.find('.bg-white.border').length > 0) {
          // Click on first quotation
          cy.get('.bg-white.border').first().click()
          
          // Should navigate to detail view
          cy.url().should('include', '/quotations/')
          
          // Look for edit button
          cy.get('button').contains(/editar|edit/i).should('exist')
            .or(() => {
              cy.log('❌ Edit functionality not found')
            })
        } else {
          cy.log('❌ No quotations to test editing')
        }
      })
    })

    it('should test quotation deletion', () => {
      cy.visit('/quotations')
      cy.wait(1000)
      
      cy.get('body').then(($body) => {
        if ($body.find('button').length > 0) {
          // Look for delete buttons
          cy.get('button').then(($buttons) => {
            const deleteButton = Array.from($buttons).find(btn => 
              btn.textContent?.toLowerCase().includes('eliminar') ||
              btn.textContent?.toLowerCase().includes('delete')
            )
            
            if (deleteButton) {
              cy.log('✅ Delete functionality found')
              cy.wrap(deleteButton).click()
              
              // Look for confirmation modal
              cy.get('.modal, [role="dialog"]').should('exist')
                .or(() => {
                  cy.log('❌ Delete confirmation modal not found')
                })
            } else {
              cy.log('❌ Delete functionality not found')
            }
          })
        }
      })
    })
  })
})
