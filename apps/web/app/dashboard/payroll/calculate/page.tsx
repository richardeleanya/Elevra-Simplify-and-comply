'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

// Zod schema for form validation
const CalculateSchema = z.object({
  periodStart: z.string().min(1, 'Required'),
  periodEnd: z.string().min(1, 'Required'),
  salaryPolicyId: z.string().min(1, 'Required'),
  regularHours: z.number().min(0),
  nightHours: z.number().min(0),
  weekendHours: z.number().min(0),
  bankHolidayHours: z.number().min(0),
});

type FormData = z.infer<typeof CalculateSchema>;

export default function PayrollCalculatePage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(CalculateSchema),
    defaultValues: {
      periodStart: '',
      periodEnd: '',
      salaryPolicyId: '',
      regularHours: 0,
      nightHours: 0,
      weekendHours: 0,
      bankHolidayHours: 0,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    // Fetch policies for dropdown
    setLoadingPolicies(true);
    fetch('/api/salary-policies')
      .then(r => r.json())
      .then(data => setPolicies(data))
      .catch(() => setPolicies([]))
      .finally(() => setLoadingPolicies(false));
  }, []);

  const onSubmit = async (data: FormData) => {
    setResult(null);
    setServerError(null);
    try {
      const res = await fetch('/api/payrolls/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Calculation failed');
      const resData = await res.json();
      setResult(resData);
    } catch (e: any) {
      setServerError(e.message);
    }
  };

  return (
    <Box className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <Typography variant="h5" className="mb-4 font-bold">
        Calculate Payslip
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="periodStart"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Period Start"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.periodStart}
              helperText={errors.periodStart?.message}
              fullWidth
              className="mb-4"
            />
          )}
        />
        <Controller
          name="periodEnd"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Period End"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.periodEnd}
              helperText={errors.periodEnd?.message}
              fullWidth
              className="mb-4"
            />
          )}
        />
        <Controller
          name="salaryPolicyId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Salary Policy"
              error={!!errors.salaryPolicyId}
              helperText={errors.salaryPolicyId?.message}
              fullWidth
              className="mb-4"
              disabled={loadingPolicies}
            >
              <MenuItem value="">
                {loadingPolicies ? <CircularProgress size={16} /> : 'Select a policy'}
              </MenuItem>
              {policies.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="regularHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Regular Hours"
              type="number"
              inputProps={{ min: 0 }}
              error={!!errors.regularHours}
              helperText={errors.regularHours?.message}
              fullWidth
              className="mb-4"
            />
          )}
        />
        <Controller
          name="nightHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Night Hours"
              type="number"
              inputProps={{ min: 0 }}
              error={!!errors.nightHours}
              helperText={errors.nightHours?.message}
              fullWidth
              className="mb-4"
            />
          )}
        />
        <Controller
          name="weekendHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Weekend Hours"
              type="number"
              inputProps={{ min: 0 }}
              error={!!errors.weekendHours}
              helperText={errors.weekendHours?.message}
              fullWidth
              className="mb-4"
            />
          )}
        />
        <Controller
          name="bankHolidayHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Bank Holiday Hours"
              type="number"
              inputProps={{ min: 0 }}
              error={!!errors.bankHolidayHours}
              helperText={errors.bankHolidayHours?.message}
              fullWidth
              className="mb-4"
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
          aria-label="Calculate Payslip"
        >
          {isSubmitting ? <CircularProgress size={20} /> : 'Calculate'}
        </Button>
      </form>

      {serverError && <Alert severity="error" className="mt-4">{serverError}</Alert>}

      {result && (
        <Box className="mt-6 bg-gray-50 rounded p-4">
          <Typography variant="h6">Gross Pay: £{result.grossPay}</Typography>
          <Typography variant="subtitle1">Breakdown:</Typography>
          <ul>
            {Object.entries(result.breakdown).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> £{v}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}