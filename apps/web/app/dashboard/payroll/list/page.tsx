'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';

export default function PayrollListPage() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/payrolls')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch payslips');
        return r.json();
      })
      .then(setPayslips)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="max-w-3xl mx-auto mt-8">
      <Typography variant="h5" className="mb-4 font-bold">
        Payslips
      </Typography>
      {loading && <CircularProgress />}
      {err && <Alert severity="error">{err}</Alert>}
      {!loading && !err && (
        <Paper>
          <Table size="small" aria-label="Payslip Table">
            <TableHead>
              <TableRow>
                <TableCell>Pay Date</TableCell>
                <TableCell>Gross Pay</TableCell>
                <TableCell>Net Pay</TableCell>
                <TableCell>Breakdown</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payslips.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.payDate ? new Date(p.payDate).toLocaleDateString() : ''}</TableCell>
                  <TableCell>£{p.grossPay}</TableCell>
                  <TableCell>£{p.netPay}</TableCell>
                  <TableCell>
                    {p.breakdown
                      ? Object.entries(p.breakdown)
                          .filter(([k, v]) => !!v)
                          .map(([k, v]) => `${k}: £${v}`)
                          .join(', ')
                      : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}