'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Alert } from '@mui/material';

export default function PensionListPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // TODO: get userId from session or JWT
  const userId = 'user-1';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pensions/${userId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch pensions');
        return r.json();
      })
      .then(setData)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="max-w-3xl mx-auto mt-8">
      <Typography variant="h5" className="mb-4 font-bold">Pension Enrolments</Typography>
      {loading && <CircularProgress />}
      {err && <Alert severity="error">{err}</Alert>}
      {!loading && !err && (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.enrollmentDate}</TableCell>
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