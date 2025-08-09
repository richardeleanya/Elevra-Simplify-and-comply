'use client';

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="flex items-center justify-center min-h-screen bg-gray-50"
      component="main"
      aria-label="Login Page"
    >
      <Box
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        component="form"
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="login-title"
      >
        <Typography id="login-title" variant="h5" className="mb-6 font-bold text-center">
          Sign In
        </Typography>
        {error && <Alert severity="error" data-testid="login-error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Email address', autoComplete: 'username' }}
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Password', autoComplete: 'current-password', minLength: 8 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-6 py-3"
          disabled={loading}
          aria-label="Sign in"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>
    </Box>
  );
}