import { Box, Container, Typography } from '@mui/material';

export default function NotificationsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This is the notifications page. Notification management features will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
}
