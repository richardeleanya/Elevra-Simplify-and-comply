'use client';

import React from 'react';
import { Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="flex-1">Simplify & Comply Dashboard</Typography>
          <nav>
            <Button component={Link} href="/dashboard" color="inherit" aria-label="Dashboard">
              Dashboard
            </Button>
            <Button component={Link} href="/dashboard/payroll/calculate" color="inherit" aria-label="Payroll Calculate">
              Payroll Calculate
            </Button>
            <Button component={Link} href="/dashboard/payroll/list" color="inherit" aria-label="Payroll List">
              Payroll List
            </Button>
            <Button component={Link} href="/dashboard/pensions" color="inherit" aria-label="Pensions">
              Pensions
            </Button>
            <Button component={Link} href="/dashboard/rti" color="inherit" aria-label="RTI">
              RTI
            </Button>
            <Button component={Link} href="/dashboard/compliance" color="inherit" aria-label="Compliance">
              Compliance
            </Button>
            <Button component={Link} href="/login" color="inherit" aria-label="Logout">
              Logout
            </Button>
          </nav>
        </Toolbar>
      </AppBar>
      <Box className="p-8">
        <Typography variant="h4" aria-label="Compliance Health Score" className="mb-6">
          Compliance Health Score: <span className="font-bold text-blue-600">--</span>
        </Typography>
        <Typography>
          Welcome to your dashboard. Use the navigation above to access payroll and compliance modules.
        </Typography>
      </Box>
    </Box>
  );
}