import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PayrollCalculatePage from '../app/dashboard/payroll/calculate/page';

describe('PayrollCalculatePage form validation', () => {
  it('shows error on missing required fields', async () => {
    render(<PayrollCalculatePage />);
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('shows error on negative hours', async () => {
    render(<PayrollCalculatePage />);
    fireEvent.change(screen.getByLabelText(/regular hours/i), { target: { value: -2 } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    await waitFor(() => {
      expect(screen.getByText(/greater than or equal/i)).toBeInTheDocument();
    });
  });
});