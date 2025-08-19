# Getting Started

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **pnpm**: Package manager (recommended) or npm/yarn
- **Git**: Version control system

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd client
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the client directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# JWT Configuration
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtyLif7EAdt9BRZbB3ABoTU83nBQ5
6d5vohEv1c2VFtEVk+Pu59+fecIpi4ZDxa02jpj+qbU8MecSgR7WYy0NCQ==
-----END PUBLIC KEY-----"

# Google Maps (if using location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Development
NODE_ENV=development
```

### 4. Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

### Development
```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
```

### Code Quality
```bash
pnpm lint         # Run ESLint with auto-fix
pnpm type-check   # Run TypeScript type checking
pnpm format       # Format code with Prettier
```

### Git Hooks
```bash
pnpm precommit    # Run pre-commit hooks (lint-staged)
```

## Project Configuration

### TypeScript Configuration
The project uses TypeScript with strict mode enabled. Key configurations:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Next.js Configuration
```typescript
// next.config.ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const config: NextConfig = {};

export default withNextIntl(config);
```

### Tailwind Configuration
Custom design system with:
- **Primary Colors**: Indigo-based palette
- **Secondary Colors**: Emerald-based palette
- **Custom Fonts**: Inter, Noto Kufi Arabic
- **RTL Support**: Right-to-left layout support

## Development Workflow

### 1. Feature Development
1. Create a new branch from `main`
2. Implement the feature following the component structure
3. Add TypeScript types for new interfaces
4. Write tests for critical functionality
5. Update documentation if needed

### 2. Code Standards
- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Follow the established component patterns
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Document complex logic and business rules

### 3. Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 4. Pre-commit Hooks
The project uses Husky and lint-staged for:
- **ESLint**: Code linting and auto-fixing
- **Prettier**: Code formatting
- **Type checking**: TypeScript validation

## IDE Setup

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Common Development Tasks

### Adding a New Page
1. Create page component in `app/` directory
2. Add route protection if needed
3. Implement the page component
4. Add to navigation if required

### Creating a New Component
1. Create component file in appropriate `components/` subdirectory
2. Define TypeScript interfaces
3. Implement the component with proper props
4. Export from index file if needed

### Adding API Integration
1. Define types in `types/` directory
2. Create service in `services/` directory
3. Add RTK Query endpoints in `store/api/`
4. Use hooks in components

### Internationalization
1. Add translations to `messages/` files
2. Use `useTranslations` hook in components
3. Test with different locales

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

#### TypeScript Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild TypeScript
pnpm type-check
```

#### Package Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Environment Issues
- Ensure all required environment variables are set
- Check API server is running on correct port
- Verify JWT public key format

### Build Issues
- Run type checking before build
- Check for unused imports
- Verify all dependencies are installed

## Next Steps

After setup, explore:
1. [Routing & Pages](./04-routing-pages.md) - Understanding the page structure
2. [Components](./05-components.md) - Component organization and usage
3. [State Management](./06-state-management.md) - Redux store and data flow
4. [API Integration](./07-api-integration.md) - Working with APIs