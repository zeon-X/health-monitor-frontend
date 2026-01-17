# Testing Documentation

## Overview

This document describes the testing strategy and implementation for the Health Monitor Frontend application.

## Core Functionality Identified for Testing

After analyzing the application, the following components were identified as **core functionality**:

1. **API Client (`lib/api.ts`)** - Critical data layer

   - Handles all backend communication
   - Patient data retrieval
   - Vitals history fetching
   - Anomaly management
   - Dashboard data aggregation

2. **Custom Hooks** - Business logic layer

   - `useDashboard` - Dashboard state management
   - `usePatientDetail` - Patient detail state management
   - Real-time WebSocket integration
   - Auto-refresh mechanisms

3. **Component Logic** - UI interaction layer
   - Dashboard components
   - Patient detail components
   - Alert management components

## Comprehensive Testing Focus: API Client & useDashboard Hook

We chose to comprehensively test the **API Client** and **useDashboard Hook** because:

1. **API Client** forms the foundation of all data operations
2. **useDashboard Hook** manages critical real-time state for the main dashboard
3. Together they represent the data flow from backend to UI
4. Failures in these components would cascade to entire application

## Test Categories Implemented

### 1. Unit Tests

**Location**: `__tests__/lib/api.test.ts`

**Coverage**:

- ✅ Patient API endpoints (getPatients, getPatient)
- ✅ Vitals API endpoints (getLatestVitals, getVitalsHistory)
- ✅ Anomaly API endpoints (getActiveAnomalies, getPatientAnomalies, acknowledgeAnomaly)
- ✅ Dashboard API endpoint (getDashboardSummary)
- ✅ Error handling (network errors, timeouts, 401/404 responses)

**Key Test Cases**:

```typescript
✓ Fetching all patients successfully
✓ Fetching single patient by ID
✓ Handling patient not found (404)
✓ Fetching vitals history with custom time ranges
✓ Acknowledging anomalies
✓ Handling API errors gracefully
✓ Network timeout handling
✓ Unauthorized access handling
```

### 2. Integration Tests

**Location**: `__tests__/hooks/useDashboard.test.tsx`

**Coverage**:

- ✅ Dashboard state initialization
- ✅ Data fetching on mount
- ✅ WebSocket integration for real-time updates
- ✅ Anomaly filtering (active vs all)
- ✅ Patient-specific anomaly retrieval
- ✅ Anomaly acknowledgment workflow
- ✅ Auto-refresh mechanism (30-second intervals)
- ✅ Notification handling

**Key Test Cases**:

```typescript
✓ Initial loading state
✓ Fetching dashboard summary and patient anomalies
✓ Error handling during fetch
✓ Filtering active vs acknowledged anomalies
✓ Acknowledging anomalies and refreshing data
✓ WebSocket vital_update event handling
✓ WebSocket anomaly_alert event handling
✓ Browser notification on critical alerts
✓ Auto-refresh every 30 seconds
✓ Cleanup on component unmount
```

### 3. End-to-End Tests (Planned)

**Future Implementation**:

- User login and dashboard access
- Real-time vital updates visualization
- Anomaly acknowledgment workflow
- Patient detail page navigation
- Critical alert notification flow

## Test Execution

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test api.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Anomaly"
```

### Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage --watchAll=false

# View coverage in browser
open coverage/lcov-report/index.html
```

## Coverage Thresholds

Minimum coverage requirements enforced by Jest:

```javascript
{
  branches: 70%,
  functions: 70%,
  lines: 70%,
  statements: 70%
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

**Pipeline Stages**:

1. **Test Stage**

   - Runs on Node.js 18.x and 20.x
   - Executes linting checks
   - Runs type checking
   - Executes test suite with coverage
   - Uploads coverage to Codecov
   - Validates coverage thresholds

2. **Build Stage**

   - Runs after tests pass
   - Builds production application
   - Checks build size
   - Validates no build errors

3. **Security Stage**
   - Runs security audit
   - Checks for vulnerable dependencies
   - Reports outdated packages

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

## Mock Strategy

### API Mocking

- **Manual Mock Location**: `__mocks__/axios.js` at project root
- **Format Required**: CommonJS (`.js` with `module.exports`), NOT ES modules
- **Mock Functions**: `mockGet` and `mockPost` exported for test assertions
- **Usage in Tests**: `jest.mock('axios')` automatically uses the manual mock
- **Important**: Jest's manual mock system requires CommonJS format for proper resolution

**Example Test Usage**:

```javascript
// Test file
jest.mock('axios')
const axios = require('axios')
const mockGet = axios.mockGet
const mockPost = axios.mockPost

// In tests
mockGet.mockResolvedValueOnce({ data: [...] })
```

- Simulating various API responses (success, errors, timeouts)
- Testing error boundaries and fallbacks

### WebSocket Mocking

- Mocking socket.io-client in `jest.setup.js`
- Simulating real-time events
- Testing event listeners and cleanup

### Router Mocking

- Mocking Next.js navigation hooks
- Testing navigation flows
- Simulating route parameters

## Best Practices Followed

1. **Arrange-Act-Assert Pattern**

   - Clear test structure
   - Separated setup, execution, and verification

2. **Test Isolation**

   - Each test is independent
   - Proper cleanup in beforeEach/afterEach
   - No shared state between tests

3. **Descriptive Test Names**

   - Clear "should" statements
   - Describes expected behavior
   - Easy to understand failures

4. **Coverage vs Quality**

   - Focus on critical paths
   - Test edge cases and error scenarios
   - Not just aiming for 100% coverage

5. **Async Handling**
   - Proper use of async/await
   - waitFor utilities from testing-library
   - No race conditions

## Running Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Type Checking

```bash
# Run TypeScript compiler check
npm run type-check
```

## Continuous Improvement

### Next Steps for Testing:

1. **Component Testing**

   - Add tests for Dashboard components
   - Test PatientCard, PatientTable components
   - Test AlertModal component

2. **E2E Testing**

   - Setup Playwright or Cypress
   - Test critical user journeys
   - Test real-time update flows

3. **Visual Regression Testing**

   - Add screenshot testing
   - Ensure UI consistency

4. **Performance Testing**

   - Test large dataset rendering
   - WebSocket performance under load
   - Component re-render optimization

5. **Accessibility Testing**
   - Add a11y testing with jest-axe
   - Keyboard navigation tests
   - Screen reader compatibility

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure tests pass locally
3. Maintain coverage thresholds
4. Update this documentation
5. Run full test suite before PR

## Test Coverage Report

Run `npm test -- --coverage` to generate the latest coverage report.

Target coverage:

```
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   78.5  |   72.3   |   75.8  |   78.5  |
 lib/                    |   85.2  |   80.1   |   82.3  |   85.2  |
  api.ts                 |   92.5  |   85.7   |   90.0  |   92.5  |
  types.ts               |  100.0  |  100.0   |  100.0  |  100.0  |
 hooks/                  |   82.1  |   75.0   |   80.5  |   82.1  |
  useDashboard.ts        |   88.3  |   81.2   |   85.0  |   88.3  |
  usePatientDetail.ts    |   76.0  |   68.8   |   76.0  |   76.0  |
-------------------------|---------|----------|---------|---------|
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [GitHub Actions](https://docs.github.com/en/actions)
