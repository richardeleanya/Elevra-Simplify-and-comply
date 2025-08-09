describe('Auth and Payroll E2E', () => {
  it('logs in and calculates payroll', () => {
    cy.visit('/login');
    cy.get('input[aria-label="Email address"]').type('test@user.com');
    cy.get('input[aria-label="Password"]').type('password1234');
    cy.contains('Sign In').click();

    cy.url().should('include', '/dashboard');

    cy.contains('Payroll Calculate').click();
    cy.url().should('include', '/dashboard/payroll/calculate');

    cy.get('input[label="Period Start"]').type('2025-08-10');
    cy.get('input[label="Period End"]').type('2025-08-17');
    cy.get('input[label="Regular Hours"]').clear().type('40');
    cy.get('input[label="Night Hours"]').clear().type('10');
    cy.get('input[label="Weekend Hours"]').clear().type('8');
    cy.get('input[label="Bank Holiday Hours"]').clear().type('4');
    cy.get('button[aria-label="Calculate Payslip"]').click();

    cy.contains('Gross Pay').should('be.visible');
    cy.contains('Breakdown').should('be.visible');
  });
});