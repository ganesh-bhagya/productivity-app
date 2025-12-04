# Testing Guide

This document describes how to run tests for the productivity application.

## Backend Tests

The backend uses **Jest** for testing.

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Test Structure

- Test files are located alongside source files with `.spec.ts` extension
- Tests use `@nestjs/testing` for dependency injection mocking
- Repository methods are mocked using Jest

### Test Files

- `src/tasks/tasks.service.spec.ts` - Tasks service unit tests
- `src/tasks/tasks.controller.spec.ts` - Tasks controller unit tests
- `src/habits/habits.service.spec.ts` - Habits service unit tests
- `src/auth/auth.service.spec.ts` - Auth service unit tests

## Frontend Tests

The frontend uses **Vitest** for testing with React Testing Library.

### Setup

First, install dependencies:

```bash
cd frontend
npm install
```

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- Test files use `.test.ts` or `.test.tsx` extension
- Component tests use React Testing Library
- Store tests mock API services
- Test utilities are in `src/test/setup.ts`

### Test Files

- `src/store/tasksStore.test.ts` - Tasks store unit tests
- `src/components/TaskCard.test.tsx` - TaskCard component tests

## Writing New Tests

### Backend Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Frontend Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Coverage Goals

- **Backend**: Aim for >80% coverage on services and controllers
- **Frontend**: Aim for >70% coverage on components and stores

## Continuous Integration

Tests should be run automatically in CI/CD pipelines before deployment.

