'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

export default function PensionEnrollPage() {
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [payload, setPayload] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  // TODO: get userId from session or JWT
  const userId = 'user-1';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch('/api/pensions/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, enrollmentDate, payload: JSON.parse(payload) }),
      });
      if (!res.ok) throw new Error('Failed to enroll');
      setResult(await res.json());
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <Typography variant="h5" className="mb-4 font-bold">Pension Enrolment</Typography>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          label="Enrollment Date"
          type="date"
          value={enrollmentDate}
          onChange={e => setEnrollmentDate(e.target.value)}
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
          {submitting ? <CircularProgress size={20} /> : 'Enroll Pension'}
        </Button>
      </form>
      {err && <Alert severity="error" className="mt-4">{err}</Alert>}
      {result && (
        <Alert severity="success" className="mt-4">
          Submitted! Status: {result.status}
          <br />
          <a href="/dashboard/pensions/list">View history</a>
        </Alert>
      )}
    </Box>
  );
}