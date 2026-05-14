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
  CircularProgress,
  Alert,
  Pagination,
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
const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function parseTime(timestamp: string): number {
  return new Date(timestamp.replace(' ', 'T') + 'Z').getTime();
}

export default function PriorityPage() {
  const [topN, setTopN] = useState(10);
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
        params.set('limit', '100');
        params.set('page', String(page));
        if (typeFilter !== 'All') {
          params.set('notification_type', typeFilter);
        }

        const response = await fetch(`/api/notifications?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
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
  }, [page, typeFilter]);

  const viewedMap = useMemo(() => new Set(viewedIds), [viewedIds]);

  const priorityNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => {
        const weightDiff = TYPE_WEIGHT[b.Type] - TYPE_WEIGHT[a.Type];
        if (weightDiff !== 0) return weightDiff;
        return parseTime(b.Timestamp) - parseTime(a.Timestamp);
      })
      .slice(0, topN);
  }, [notifications, topN]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Priority Notifications
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Top N</InputLabel>
          <Select label="Top N" value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        {priorityNotifications.map((n, idx) => {
          const isViewed = viewedMap.has(n.ID);
          return (
            <Card key={n.ID} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`#${idx + 1}`} size="small" color="warning" />
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

                <Typography variant="body1">{n.Message}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={10}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
