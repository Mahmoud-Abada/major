# Frontend Documentation

This documentation covers the Next.js frontend application for the Classroom Management System.

## Table of Contents

- [Project Overview](./01-project-overview.md)
- [Architecture](./02-architecture.md)
- [Getting Started](./03-getting-started.md)
- [Routing & Pages](./04-routing-pages.md)
- [Components](./05-components.md)
- [State Management](./06-state-management.md)
- [API Integration](./07-api-integration.md)
- [Authentication](./08-authentication.md)
- [Internationalization](./09-internationalization.md)
- [Styling & Theming](./10-styling-theming.md)
- [Hooks](./11-hooks.md)
- [Utils & Helpers](./12-utils-helpers.md)
- [Types & Interfaces](./13-types-interfaces.md)
- [Development Guidelines](./14-development-guidelines.md)
- [Deployment](./15-deployment.md)

## Quick Navigation

### Core Features
- **Authentication System**: JWT-based auth with role-based access control
- **Classroom Management**: Classes, students, teachers, parents management
- **Real-time Features**: Messaging, notifications, live updates
- **Multi-language Support**: English, French, Arabic with RTL support
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom components
- **Authentication**: JWT with secure token management
- **Internationalization**: next-intl for multi-language support

### Project Structure
```
client/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API services
├── store/                 # Redux store and slices
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
└── styles/                # Global styles
```

For detailed information about each section, please refer to the individual documentation files.