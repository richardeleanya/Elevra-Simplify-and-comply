'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Alert, TextField, MenuItem } from '@mui/material';

export default function RtiListPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [payrollId, setPayrollId] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payrolls')
      .then(r => r.json())
      .then(setPayrolls)
      .catch(() => setPayrolls([]));
  }, []);

  useEffect(() => {
    if (!payrollId) return;
    setLoading(true);
    fetch(`/api/rti/${payrollId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch RTI submissions');
        return r.json();
      })
      .then(setData)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [payrollId]);

  return (
    <Box className="max-w-3xl mx-auto mt-8">
      <Typography variant="h5" className="mb-4 font-bold">RTI Submissions</Typography>
      <TextField
        select
        label="Payroll"
        value={payrollId}
        onChange={e => setPayrollId(e.target.value)}
        required
        fullWidth
        className="mb-4"
      >
        {payrolls.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.id}</MenuItem>
        ))}
      </TextField>
      {loading && <CircularProgress />}
      {err && <Alert severity="error">{err}</Alert>}
      {!loading && !err && (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Submission Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.submissionDate}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{JSON.stringify(row.response)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}