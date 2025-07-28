# Testing Guide for Legal AI System

This document provides a comprehensive guide to the testing setup for the Legal AI System.

## 🧪 Testing Framework

The project uses **Jest** with **React Testing Library** for comprehensive testing:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation

## 📁 Test Structure

```
__tests__/
├── lib/
│   ├── utils.test.ts              # Utility functions tests
│   └── intelligent-search.test.ts # AI search functionality tests
├── components/
│   └── ui/
│       ├── Button.test.tsx        # Button component tests
│       └── Input.test.tsx         # Input component tests
├── api/
│   └── auth/
│       └── login.test.ts          # Login API route tests
└── app/
    └── dashboard/
        └── page.test.tsx          # Dashboard page tests
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Specific Test Patterns

```bash
# Run only utility function tests
npm test -- --testPathPattern="utils.test.ts"

# Run only component tests
npm test -- --testPathPattern="Button.test.tsx|Input.test.tsx"

# Run only API tests
npm test -- --testPathPattern="login.test.ts"

# Run tests with verbose output
npm test -- --verbose
```

### Using the Test Script

```bash
# Run the comprehensive test script
./scripts/test.sh
```

## 📊 Test Coverage

The testing setup includes coverage reporting with the following thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Report

After running tests with coverage, you can view the detailed report:

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory.

## 🧩 Test Categories

### 1. Unit Tests (`lib/`)

**Utility Functions** (`utils.test.ts`)
- ✅ Class name merging (`cn` function)
- ✅ Date formatting (`formatDate`, `formatDateTime`)
- ✅ ID generation (`generateId`)
- ✅ Text truncation (`truncateText`)
- ✅ Debounce functionality (`debounce`)

**Intelligent Search** (`intelligent-search.test.ts`)
- ✅ OpenAI query extraction
- ✅ API search functionality
- ✅ Error handling and fallbacks
- ✅ Result formatting

### 2. Component Tests (`components/ui/`)

**Button Component** (`Button.test.tsx`)
- ✅ Rendering with different variants (primary, secondary, ghost, outline, danger)
- ✅ Size variations (sm, md, lg, icon)
- ✅ Loading states with spinner
- ✅ Disabled states
- ✅ Event handling (click, keyboard)
- ✅ Accessibility features
- ✅ Props forwarding

**Input Component** (`Input.test.tsx`)
- ✅ Basic rendering with labels
- ✅ Helper text and error states
- ✅ Icon support (left/right)
- ✅ Input validation
- ✅ Accessibility (label association, ARIA)
- ✅ Different input types
- ✅ Props forwarding

### 3. API Tests (`api/auth/`)

**Login Route** (`login.test.ts`)
- ✅ Input validation
- ✅ Authentication logic
- ✅ JWT token generation
- ✅ Cookie setting
- ✅ Error handling
- ✅ Environment variable handling

### 4. Page Tests (`app/`)

**Dashboard Page** (`page.test.tsx`)
- ✅ Component rendering
- ✅ User information display
- ✅ Navigation elements

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### Jest Setup (`jest.setup.js`)

The setup file includes:
- Jest DOM matchers
- Next.js router mocking
- Image component mocking
- Browser API mocking (matchMedia, IntersectionObserver, ResizeObserver)

## 🎯 Testing Best Practices

### Component Testing

1. **Test user behavior, not implementation**
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Test accessibility** features
4. **Mock external dependencies**
5. **Test error states and edge cases**

### API Testing

1. **Mock external services**
2. **Test validation logic**
3. **Verify response formats**
4. **Test error handling**
5. **Check security measures**

### Utility Testing

1. **Test edge cases**
2. **Verify input/output formats**
3. **Test error conditions**
4. **Ensure consistent behavior**

## 🐛 Debugging Tests

### Common Issues

1. **Module resolution errors**: Check Jest configuration
2. **Mock failures**: Verify mock implementations
3. **Async test failures**: Use proper async/await patterns
4. **Component rendering issues**: Check for missing providers

### Debug Commands

```bash
# Run tests with debug output
npm test -- --verbose --detectOpenHandles

# Run specific test with debug
npm test -- --testNamePattern="specific test name" --verbose

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📈 Continuous Integration

The test suite is configured for CI environments:

```bash
# CI test command
npm run test:ci
```

This command:
- Runs tests without watch mode
- Generates coverage reports
- Fails on coverage thresholds
- Provides detailed output

## 🔄 Adding New Tests

### For New Components

1. Create test file: `__tests__/components/ComponentName.test.tsx`
2. Import component and testing utilities
3. Write tests for rendering, interactions, and edge cases
4. Add to test patterns in scripts

### For New API Routes

1. Create test file: `__tests__/api/route-name.test.ts`
2. Mock external dependencies
3. Test request/response handling
4. Verify error scenarios

### For New Utilities

1. Create test file: `__tests__/lib/utility-name.test.ts`
2. Test all function variations
3. Include edge cases
4. Verify error handling

## 📝 Test Naming Conventions

- **Describe blocks**: Use component/function names
- **Test cases**: Use descriptive action-based names
- **File names**: Match source file names with `.test.ts` extension

Example:
```typescript
describe('Button', () => {
  it('should render with primary variant', () => {
    // test implementation
  })
  
  it('should handle click events', () => {
    // test implementation
  })
})
```

## 🎉 Current Test Status

- ✅ **57 tests passing**
- ✅ **70%+ coverage threshold met**
- ✅ **All core functionality tested**
- ✅ **Component interactions verified**
- ✅ **API endpoints validated**

## 🚀 Next Steps

1. **Add integration tests** for full user workflows
2. **Implement E2E tests** with Playwright or Cypress
3. **Add performance tests** for critical paths
4. **Expand API test coverage** for all endpoints
5. **Add visual regression tests** for UI components

---

For questions or issues with testing, please refer to the Jest and React Testing Library documentation, or create an issue in the project repository. 