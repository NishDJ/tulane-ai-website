# Deployment Guide

This document provides comprehensive instructions for deploying the Tulane AI & Data Science Division website.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

## Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.production
   ```

2. Configure the required environment variables:
   - `NEXT_PUBLIC_SITE_URL`: Your production domain
   - `NEXT_PUBLIC_SITE_NAME`: Site name for metadata
   - `CONTACT_EMAIL`: Email for contact form submissions
   - `CSRF_SECRET`: Secret key for CSRF protection

## Build Process

### Automated Build

Use the provided build script:
```bash
./scripts/build.sh
```

### Manual Build

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Run type checking:
   ```bash
   npm run type-check
   ```

3. Run tests:
   ```bash
   npm run test:run
   ```

4. Build the application:
   ```bash
   npm run build
   ```

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides the best integration with Next.js:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Configure environment variables in the Vercel dashboard.

### 2. Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

### 3. Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t tulane-ai-website .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=https://your-domain.com tulane-ai-website
   ```

3. For production with Docker Compose:
   ```yaml
   version: '3.8'
   services:
     web:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_SITE_URL=https://your-domain.com
         - NODE_ENV=production
       restart: unless-stopped
   ```

### 4. Static Export

For static hosting (GitHub Pages, S3, etc.):

1. Update `next.config.ts` to enable static export:
   ```typescript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. Build and export:
   ```bash
   npm run build
   ```

3. Deploy the `out` directory to your static host.

## Performance Optimization

### Bundle Analysis

Analyze your bundle size:
```bash
ANALYZE=true npm run build
```

This generates a bundle analyzer report to identify optimization opportunities.

### Image Optimization

The application uses Next.js Image component with:
- WebP and AVIF format support
- Responsive image sizing
- Lazy loading
- Blur placeholders

### Caching Strategy

- Static assets: 1 year cache
- API routes: Configurable cache headers
- Pages: ISR (Incremental Static Regeneration) where applicable

## Monitoring and Analytics

### Performance Monitoring

1. Configure Sentry (optional):
   ```bash
   SENTRY_DSN=your-sentry-dsn
   NEXT_PUBLIC_SENTRY_DSN=your-public-sentry-dsn
   ```

2. Enable Core Web Vitals tracking in production.

### Analytics

Configure Google Analytics:
```bash
NEXT_PUBLIC_GA_ID=your-ga-id
```

## Security Considerations

### Environment Variables

- Never commit `.env.production` to version control
- Use secure secrets for CSRF protection
- Rotate API keys regularly

### Headers

The application includes security headers:
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options
- CSP (Content Security Policy)

### HTTPS

Always deploy with HTTPS enabled. Most platforms (Vercel, Netlify) provide this automatically.

## Health Checks

The deployment script includes health checks. You can also manually verify:

```bash
curl -f https://your-domain.com/api/health
```

## Rollback Strategy

### Vercel
```bash
vercel rollback [deployment-url]
```

### Docker
```bash
docker tag tulane-ai-website:previous tulane-ai-website:latest
docker-compose up -d
```

### Manual
Keep the previous build directory and swap as needed.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Runtime Errors**
   - Check browser console for client-side errors
   - Review server logs for API issues
   - Verify all environment variables are set

3. **Performance Issues**
   - Run bundle analysis
   - Check image optimization settings
   - Review caching configuration

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm start
```

## Maintenance

### Regular Updates

1. Update dependencies monthly:
   ```bash
   npm update
   npm audit fix
   ```

2. Monitor security advisories
3. Test thoroughly before deploying updates

### Backup Strategy

- Database: Not applicable (static content)
- Content: Version controlled in Git
- Configuration: Environment variables documented

## Support

For deployment issues:
1. Check this documentation
2. Review application logs
3. Contact the development team

## Automated Deployment

### GitHub Actions (Example)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:run
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

This guide covers all major deployment scenarios and should be updated as the application evolves.