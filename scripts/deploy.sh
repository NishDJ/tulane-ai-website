#!/bin/bash

# Deployment script for production
set -e

echo "🚀 Starting deployment process..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Validate required environment variables
required_vars=("NEXT_PUBLIC_SITE_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

# Run build script
echo "🏗️  Running build..."
./scripts/build.sh

# Health check function
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo "🔍 Performing health check on $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null; then
            echo "✅ Health check passed!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Deploy based on platform
if [ "$DEPLOYMENT_PLATFORM" = "vercel" ]; then
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
    
elif [ "$DEPLOYMENT_PLATFORM" = "netlify" ]; then
    echo "🌐 Deploying to Netlify..."
    npx netlify deploy --prod --dir=.next
    
elif [ "$DEPLOYMENT_PLATFORM" = "docker" ]; then
    echo "🐳 Building Docker image..."
    docker build -t tulane-ai-website .
    
    if [ "$DOCKER_REGISTRY" ]; then
        echo "📤 Pushing to Docker registry..."
        docker tag tulane-ai-website "$DOCKER_REGISTRY/tulane-ai-website:latest"
        docker push "$DOCKER_REGISTRY/tulane-ai-website:latest"
    fi
    
else
    echo "📁 Static export for manual deployment..."
    npm run build
    echo "✅ Static files ready in .next directory"
fi

# Perform health check if URL is provided
if [ "$NEXT_PUBLIC_SITE_URL" ] && [ "$DEPLOYMENT_PLATFORM" != "docker" ]; then
    health_check "$NEXT_PUBLIC_SITE_URL"
fi

echo "🎉 Deployment completed successfully!"