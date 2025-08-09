'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';

type Health = {
  score: number;
  counts: { INFO: number; WARNING: number; CRITICAL: number };
};

export default function CompliancePage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/compliance/health')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch health');
        return r.json();
      })
      .then(setHealth)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="max-w-2xl mx-auto mt-8">
      <Typography variant="h5" className="mb-4 font-bold">
        Compliance Health
      </Typography>
      {loading && <CircularProgress />}
      {err && <Alert severity="error">{err}</Alert>}
      {health && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className="mb-4">
              <CardContent>
                <Typography variant="h6">Health Score</Typography>
                <Typography variant="h2" color={health.score >= 80 ? 'primary' : health.score >= 60 ? 'warning.main' : 'error'}>
                  {health.score}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Critical</Typography>
                <Typography variant="h4" color="error">{health.counts.CRITICAL}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Warning</Typography>
                <Typography variant="h4" color="warning.main">{health.counts.WARNING}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Info</Typography>
                <Typography variant="h4" color="primary">{health.counts.INFO}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}