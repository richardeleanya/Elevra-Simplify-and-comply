'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress, MenuItem } from '@mui/material';

export default function RtiSubmitPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [payrollId, setPayrollId] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [payload, setPayload] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payrolls')
      .then(r => r.json())
      .then(setPayrolls)
      .catch(() => setPayrolls([]));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch('/api/rti/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollId, submissionDate, payload: JSON.parse(payload) }),
      });
      if (!res.ok) throw new Error('Failed to submit RTI');
      setResult(await res.json());
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <Typography variant="h5" className="mb-4 font-bold">Submit RTI</Typography>
      <form onSubmit={onSubmit} noValidate>
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
        <TextField
          label="Submission Date"
          type="date"
          value={submissionDate}
          onChange={e => setSubmissionDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          className="mb-4"
        />
        <TextField
          label="Payload (JSON)"
          value={payload}
          onChange={e => setPayload(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          required
          className="mb-4"
        />
        <Button type="submit" variant="contained" color="primary" disabled={submitting} fullWidth>
          {submitting ? <CircularProgress size={20} /> : 'Submit RTI'}
        </Button>
      </form>
      {err && <Alert severity="error" className="mt-4">{err}</Alert>}
      {result && (
        <Alert severity="success" className="mt-4">
          Submitted! Status: {result.status}
          <br />
          <a href="/dashboard/rti/list">View history</a>
        </Alert>
      )}
    </Box>
  );
}