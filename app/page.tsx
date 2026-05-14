'use client';

import { Container, Typography, Box, Button, Alert, Stack } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [showNotification, setShowNotification] = useState(false);

  const testingLog = async () => {
    setShowNotification(true);

    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stack: 'frontend',
          level: 'info',
          pkg: 'component',
          message: 'testing the log middleware.',
        }),
      });

      const responseBody = await response.json();
      console.log('API response from /api/log:', {
        status: response.status,
        ok: response.ok,
        body: responseBody,
      });
    } catch (error) {
      console.error('Failed to call /api/log:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Notification App
        </Typography>
        
        <Stack spacing={3}>
          <Typography variant="body1" color="textSecondary">
            Welcome to the notification system application. This app demonstrates
            a notification management system with Material UI components.
          </Typography>

          {showNotification && (
            <Alert 
              onClose={() => setShowNotification(false)}
              severity="success"
            >
              This is a sample notification! You can close it by clicking the X button.
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={testingLog}
            size="large"
          >
            Show Notification
          </Button>

          <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Project Structure
            </Typography>
            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
{`✓ notification_app_be - Backend service
✓ notification_app_fe - Frontend UI
✓ logging/middleware - Centralized logging
✓ Material UI integration
✓ TypeScript support
✓ .gitignore configured`}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
