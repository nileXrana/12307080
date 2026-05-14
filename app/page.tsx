'use client';

import {
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

type NotificationType = 'Event' | 'Result' | 'Placement';

interface NotificationItem {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

const VIEWED_KEY = 'viewedNotificationIds';

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<'All' | NotificationType>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(VIEWED_KEY);
    if (saved) {
      try {
        setViewedIds(JSON.parse(saved));
      } catch {
        setViewedIds([]);
      }
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('page', String(page));
        if (typeFilter !== 'All') {
          params.set('notification_type', typeFilter);
        }

        const response = await fetch(`/api/notifications?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: check LOG_ACCESS_TOKEN in .env.local');
          }
          throw new Error(data?.message || data?.error || 'Failed to fetch notifications');
        }

        setNotifications(data.notifications || []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchNotifications();
  }, [limit, page, typeFilter]);

  const viewedMap = useMemo(() => new Set(viewedIds), [viewedIds]);

  const markViewed = (id: string) => {
    if (viewedMap.has(id)) return;
    const updated = [...viewedIds, id];
    setViewedIds(updated);
    localStorage.setItem(VIEWED_KEY, JSON.stringify(updated));
  };

  const markAllViewed = () => {
    const ids = notifications.map((n) => n.ID);
    const unique = Array.from(new Set([...viewedIds, ...ids]));
    setViewedIds(unique);
    localStorage.setItem(VIEWED_KEY, JSON.stringify(unique));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Limit</InputLabel>
          <Select label="Limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as 'All' | NotificationType);
              setPage(1);
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button size="small" onClick={markAllViewed} disabled={notifications.length === 0}>
            Mark all viewed
          </Button>
        </Box>
        {notifications.map((n) => {
          const isViewed = viewedMap.has(n.ID);
          return (
            <Card key={n.ID} variant="outlined" onClick={() => markViewed(n.ID)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Chip label={n.Type} size="small" color="primary" />
                    <Chip
                      label={isViewed ? 'Viewed' : 'New'}
                      size="small"
                      color={isViewed ? 'default' : 'success'}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {n.Timestamp}
                  </Typography>
                </Stack>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  {n.Message}
                </Typography>

                <Button variant="text" size="small" disabled={isViewed}>
                  {isViewed ? 'Already Viewed' : 'Mark Viewed'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={10} page={page} onChange={(_, value) => setPage(value)} color="primary" />
      </Box>
    </Box>
  );
}
