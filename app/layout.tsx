'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Button, Typography, Container } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Campus Notifications
                </Typography>
                <Button color="inherit" component={Link} href="/">
                  All
                </Button>
                <Button color="inherit" component={Link} href="/priority">
                  Priority
                </Button>
              </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ py: 3 }}>
              {children}
            </Container>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
