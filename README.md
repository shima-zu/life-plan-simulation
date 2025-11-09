# Life Plan Simulation

A web application for simulating future asset formation and cash flow based on family structure, income, expenses, and financial parameters.

## Features

- **Family Management**: Manage family members (self, partner, and children)
- **Child Education Planning**: Set education plans for each child (kindergarten through university)
- **Activity Management**: Track extracurricular activities with costs and duration
- **Settings Configuration**: Configure family settings, income, expenses, and financial parameters

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **Testing**: Vitest 4.0.8 + React Testing Library
- **Package Manager**: [Bun](https://bun.sh)
- **Architecture**: Feature-Sliced Design (FSD)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

This project follows [Feature-Sliced Design](https://feature-sliced.design/) architecture:

```
src/
├── app/          # App Layer - Next.js routing
├── pages/         # Pages Layer - Page components
├── widgets/       # Widgets Layer - Composite UI blocks
├── features/      # Features Layer - User features
├── entities/      # Entities Layer - Business entities
└── shared/        # Shared Layer - Common utilities and components
```

For more details about the architecture, see [src/README.md](./src/README.md).

## Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for commit message validation

Pre-commit hooks automatically run linting and formatting checks.

## License

Private project - All rights reserved
