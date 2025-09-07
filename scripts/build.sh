#!/bin/bash

# Build script for production deployment
set -e

echo "🚀 Starting production build..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please use Node.js 18 or higher."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Run linting (with auto-fix)
echo "🧹 Running linter..."
npm run lint:fix || true

# Run tests
echo "🧪 Running tests..."
npm run test:run

# Build the application
echo "🏗️  Building application..."
npm run build

# Analyze bundle size (optional)
if [ "$ANALYZE_BUNDLE" = "true" ]; then
    echo "📊 Analyzing bundle size..."
    npm run build:analyze
fi

echo "✅ Build completed successfully!"
echo "📁 Build output is in the .next directory"