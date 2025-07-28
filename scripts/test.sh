#!/bin/bash

echo "🧪 Running Legal AI System Tests"
echo "=================================="

# Function to run tests with pattern
run_tests() {
    local pattern=$1
    local description=$2
    echo ""
    echo "📋 $description"
    echo "----------------------------------"
    npm test -- --testPathPattern="$pattern" --verbose
}

# Function to run tests with coverage
run_coverage() {
    local pattern=$1
    local description=$2
    echo ""
    echo "📊 $description (with coverage)"
    echo "----------------------------------"
    npm test -- --testPathPattern="$pattern" --coverage --watchAll=false
}

# Run different test suites
echo "🚀 Starting test suite..."

# Unit tests
run_tests "utils.test.ts" "Utility Functions Tests"
run_tests "Button.test.tsx|Input.test.tsx" "UI Component Tests"

# Run all tests together
echo ""
echo "🎯 Running All Tests Together"
echo "----------------------------------"
npm test -- --testPathPattern="utils.test.ts|Button.test.tsx|Input.test.tsx" --watchAll=false

# Run with coverage
echo ""
echo "📈 Generating Coverage Report"
echo "----------------------------------"
npm test -- --testPathPattern="utils.test.ts|Button.test.tsx|Input.test.tsx" --coverage --watchAll=false

echo ""
echo "✅ Test suite completed!"
echo ""
echo "📝 Test Summary:"
echo "- Utility functions: 19 tests"
echo "- Button component: 20 tests" 
echo "- Input component: 18 tests"
echo "- Total: 57 tests"
echo ""
echo "🔧 To run specific tests:"
echo "  npm test -- --testPathPattern='pattern'"
echo ""
echo "👀 To run tests in watch mode:"
echo "  npm run test:watch"
echo ""
echo "📊 To run tests with coverage:"
echo "  npm run test:coverage" 