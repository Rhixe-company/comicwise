# Setup Guide

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd comicwise
```

1. Install dependencies:

```bash
bun install
# or
yarn install
```

1. Configure environment:

```bash
cp .env.example .env
# Edit .env with your configuration
```

1. Start the development server:

```bash
bun run dev
# or
yarn dev
```

## Common Commands

| Command         | Description              |
| --------------- | ------------------------ |
| `bun run dev`   | Start development server |
| `bun run build` | Build for production     |
| `bun run lint`  | Run linter               |
| `bun run test`  | Run tests                |

## Project Structure

- `src/` - Source code
- `docs/` - Documentation
- `tests/` - Test files

## Troubleshooting

If you encounter issues:

1. Clear node_modules and reinstall
2. Check Node.js version matches requirements
3. Verify .env configuration is correct
