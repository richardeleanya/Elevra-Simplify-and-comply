import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../app/login/page';

describe('LoginPage form validation', () => {
  it('shows error on invalid email', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/sign in/i));
    expect(screen.getByTestId('login-error')).toHaveTextContent(/invalid email/i);
  });

  it('shows error on short password', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'foo@bar.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByLabelText(/sign in/i));
    expect(screen.getByTestId('login-error')).toHaveTextContent(/at least 8/i);
  });
});