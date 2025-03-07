# Testing Documentation

This document outlines the approach to testing the KII Testnet Wrapper application.

## Testing Strategy

We've implemented a multi-layered testing approach:

1. **Unit Tests**: For individual components and hooks
2. **Integration Tests**: For interactions between components
3. **End-to-End Tests**: For full user flows

## Setting Up Testing

We're using Vitest as our testing framework, which is compatible with React 19 and provides a modern, fast testing environment.

To enable testing, the following dependencies are already installed:

```bash
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
@vitejs/plugin-react
jsdom
vitest
```

The scripts in package.json are configured for running tests:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Running Tests

Run tests with:

```bash
npm test
```

Or to run in watch mode:

```bash
npm run test:watch
```

Or to run with coverage:

```bash
npm run test:coverage
```

## Test File Organization

-   Unit tests are stored in `src/__tests__/` and follow the same directory structure as the source files
-   Each test file is named as `*.test.tsx` or `*.test.ts`
-   Mocks are stored in `src/__mocks__/`

## Mocking Strategy

We use Vitest's mocking capabilities to mock:

1. External services (Blockchain interactions)
2. Custom hooks
3. Web components
4. React Context

### Handling TextEncoder Issues

When testing code that uses `viem` or other libraries that depend on TextEncoder, we create custom mocks to avoid issues:

```typescript
// Example mock for viem
vi.mock("viem", () => ({
    parseEther: (value: string) => BigInt(Number(value) * 1e18),
    formatUnits: (value: bigint, decimals: number) =>
        (Number(value) / Math.pow(10, decimals)).toString(),
}));
```

## Performance Testing

For performance testing, we use:

1. React DevTools Profiler for component rendering
2. Network monitoring for API calls
3. Memory usage tracking
4. React memoization utilities (`useMemo`, `useCallback`)

## Continuous Integration

Tests should be included in the CI/CD pipeline to ensure code quality.
