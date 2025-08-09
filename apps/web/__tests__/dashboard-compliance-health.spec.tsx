import { render, screen, waitFor } from '@testing-library/react';
import CompliancePage from '../app/dashboard/compliance/page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ score: 90, counts: { INFO: 1, WARNING: 2, CRITICAL: 0 } }),
  })
) as jest.Mock;

describe('CompliancePage', () => {
  it('fetches and displays health score', async () => {
    render(<CompliancePage />);
    expect(screen.getByText(/Compliance Health/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('90')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});