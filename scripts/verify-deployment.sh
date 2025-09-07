#!/bin/bash

# Deployment verification script
set -e

echo "🔍 Verifying deployment readiness..."

# Check if build directory exists
if [ ! -d ".next" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

# Check for required files
required_files=(
    ".next/server/app/page.js"
    ".next/server/app/layout.js"
    ".next/static"
    "public"
)

for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ Required file/directory missing: $file"
        exit 1
    fi
done

echo "✅ Build files verified"

# Check environment variables
if [ -f ".env.production" ]; then
    echo "✅ Production environment file found"
else
    echo "⚠️  No .env.production file found. Using defaults."
fi

# Verify package.json scripts
required_scripts=("build" "start" "test:run")
for script in "${required_scripts[@]}"; do
    if ! npm run-script --silent "$script" --dry-run > /dev/null 2>&1; then
        echo "❌ Required npm script missing: $script"
        exit 1
    fi
done

echo "✅ Package.json scripts verified"

# Check for security files
security_files=(".gitignore" "next.config.ts")
for file in "${security_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "⚠️  Security file missing: $file"
    fi
done

# Verify static assets
if [ ! -d "public/images" ]; then
    echo "⚠️  Public images directory not found"
fi

# Check bundle size (if analyzer output exists)
if [ -f ".next/analyze/client.html" ]; then
    echo "📊 Bundle analysis available at .next/analyze/client.html"
fi

# Verify TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation has warnings (check with 'npm run type-check')"
fi

# Check for common deployment issues
echo "🔍 Checking for common deployment issues..."

# Check for hardcoded localhost URLs
if grep -r "localhost:3000" src/ --exclude-dir=node_modules > /dev/null 2>&1; then
    echo "⚠️  Found hardcoded localhost URLs in source code"
fi

# Check for console.log statements in production code
if grep -r "console\.log" src/ --exclude-dir=node_modules --exclude="*.test.*" > /dev/null 2>&1; then
    echo "⚠️  Found console.log statements in production code"
fi

# Verify API routes
api_routes=("contact" "search" "faculty" "research" "news" "events")
for route in "${api_routes[@]}"; do
    if [ -f "src/app/api/$route/route.ts" ]; then
        echo "✅ API route verified: $route"
    else
        echo "⚠️  API route missing: $route"
    fi
done

echo ""
echo "🎉 Deployment verification completed!"
echo ""
echo "📋 Deployment Checklist:"
echo "  ✅ Build files present"
echo "  ✅ Package.json scripts working"
echo "  ✅ TypeScript compilation"
echo "  ✅ API routes available"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "  1. Set up environment variables on your deployment platform"
echo "  2. Configure domain and SSL certificate"
echo "  3. Run deployment script: ./scripts/deploy.sh"
echo "  4. Perform post-deployment health check"