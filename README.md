# Notification App

A Next.js notification system application with TypeScript and Material UI.

## Overview

This project consists of:
- **Frontend** - Next.js app with Material UI components
- **Backend Service** - Notification management API
- **Logging Middleware** - Centralized logging utilities

## Tech Stack

- Next.js 14+
- TypeScript
- Material UI (MUI)
- React 18+

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with Material UI theme
│   ├── page.tsx                 # Home page
│   └── notifications/           # Notifications feature
├── components/                  # Reusable React components
├── logging/middleware/          # Centralized logging utilities
│   ├── logger.ts               # Main logger class
│   ├── request-logger.ts       # Request/response logging
│   └── index.ts                # Exports
├── notification_app_be/         # Backend service folder
├── notification_app_fe/         # Frontend folder
├── notification_system_design.md # Architecture documentation
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── .gitignore                  # Git ignore rules
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Material UI

The project uses Material UI for all UI components. Key components include:
- `Alert` - For notifications
- `Snackbar` - For temporary notifications
- `Card` - For containers
- `Button` - For actions
- `Typography` - For text
- `Box` - For layout
- `Container` - For page containers

## Logging

The logging middleware provides:
- Centralized logging
- Request/response logging
- Error tracking
- Performance monitoring

Usage:
```typescript
import { logger } from '@/logging/middleware';

logger.info('Message', { data: 'value' });
logger.error('Error message', { error: err });
```

## Development Guidelines

- Follow TypeScript strict mode
- Use MUI components for all UI
- Implement proper error handling
- Use the logging middleware for all logging
- Create reusable components
- Use React hooks for state management

## License

MIT
