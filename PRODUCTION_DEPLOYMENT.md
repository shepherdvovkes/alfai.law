# 🚀 Production Deployment Guide

This guide covers building and running the Legal AI System in production mode.

## ✅ Current Status

**Production Build Status**: ✅ **SUCCESSFUL**
- Build completed without errors
- All pages optimized and static generation complete
- Production server running on `http://localhost:3000`

## 🏗️ Build Process

### 1. Production Build

```bash
# Clean install dependencies (if needed)
rm -rf node_modules package-lock.json
npm install

# Build for production
npm run build
```

### 2. Build Output

The build process generates:
- **Optimized static files** in `.next/` directory
- **Static pages** for better performance
- **API routes** ready for server-side rendering
- **Bundle analysis** showing page sizes and optimization

### 3. Build Statistics

```
Route (app)                              Size     First Load JS
┌ ○ /                                    811 B          82.7 kB
├ ○ /ai-assistant                        51.4 kB         199 kB
├ ○ /case-search                         4.08 kB         126 kB
├ ○ /cases                               4.47 kB         152 kB
├ ○ /dashboard                           4.55 kB         152 kB
├ ○ /login                               5.68 kB         159 kB
├ ○ /register                            19.9 kB         173 kB
└ ○ /profile                             7.24 kB         145 kB
```

## 🚀 Production Server

### 1. Start Production Server

```bash
# Start the production server
npm start
```

### 2. Server Status

- **URL**: `http://localhost:3000`
- **Status**: ✅ Running
- **Process ID**: Active Node.js process
- **Response**: HTTP 200 OK

### 3. Production Features

- **Static Optimization**: Pages pre-rendered for faster loading
- **API Routes**: Server-side rendering for dynamic content
- **Caching**: Built-in Next.js caching for better performance
- **Compression**: Automatic gzip compression
- **Security Headers**: Next.js security defaults

## 🌐 Environment Configuration

### 1. Environment Variables

Create `.env.local` for production:

```bash
# Database
DATABASE_URL="your-production-database-url"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# External APIs
ZAKON_TOKEN="your-zakon-api-token"

# Email (if using)
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"

# JWT
JWT_SECRET="your-jwt-secret"
```

### 2. Production Optimizations

```bash
# Set production environment
export NODE_ENV=production

# Enable Next.js optimizations
export NEXT_TELEMETRY_DISABLED=1
```

## 📊 Performance Monitoring

### 1. Built-in Metrics

Next.js provides built-in performance monitoring:
- **Core Web Vitals** tracking
- **Bundle analysis** in build output
- **Page load times** optimization

### 2. Monitoring Commands

```bash
# Check server status
curl -I http://localhost:3000

# Monitor process
lsof -i :3000

# Check memory usage
ps aux | grep node
```

## 🔧 Production Scripts

### 1. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### 2. Production Workflow

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm test

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

## 🐳 Docker Deployment

### 1. Dockerfile

```dockerfile
# Use Node.js 18 Alpine
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Commands

```bash
# Build Docker image
docker build -t legal-ai-system .

# Run Docker container
docker run -p 3000:3000 legal-ai-system

# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="your-db-url" \
  legal-ai-system
```

## ☁️ Cloud Deployment

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### 2. AWS/EC2

```bash
# SSH to your server
ssh user@your-server

# Clone repository
git clone your-repo-url
cd legal-ai-system

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "legal-ai" -- start
pm2 startup
pm2 save
```

### 3. Docker Compose

```yaml
version: '3.8'
services:
  legal-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
```

## 🔒 Security Considerations

### 1. Environment Variables

- ✅ Never commit `.env.local` to version control
- ✅ Use strong, unique secrets for production
- ✅ Rotate API keys regularly
- ✅ Use environment-specific configurations

### 2. Security Headers

Next.js includes security headers by default:
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **Referrer-Policy**: Control referrer information
- **Content-Security-Policy**: XSS protection

### 3. HTTPS

Always use HTTPS in production:
```bash
# Configure SSL certificates
# Use Let's Encrypt or your hosting provider's SSL
```

## 📈 Performance Optimization

### 1. Built-in Optimizations

- ✅ **Static Generation**: Pages pre-rendered at build time
- ✅ **Image Optimization**: Automatic image optimization
- ✅ **Code Splitting**: Automatic bundle splitting
- ✅ **Tree Shaking**: Unused code elimination

### 2. Additional Optimizations

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

## 🚨 Troubleshooting

### 1. Common Issues

**Build Failures**:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Port Already in Use**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Memory Issues**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 2. Logs and Debugging

```bash
# View application logs
npm start 2>&1 | tee app.log

# Monitor system resources
htop

# Check network connections
netstat -tulpn | grep :3000
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm test`)
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] SSL certificates installed
- [ ] Domain DNS configured

### Deployment
- [ ] Build successful (`npm run build`)
- [ ] Production server started (`npm start`)
- [ ] Health check passing (`curl -I http://localhost:3000`)
- [ ] All pages loading correctly
- [ ] API endpoints responding

### Post-Deployment
- [ ] Monitor application logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Set up monitoring and alerts
- [ ] Document deployment process

## 🎉 Success!

Your Legal AI System is now running in production mode at:
**http://localhost:3000**

The application is optimized, secure, and ready for production use!

---

For additional support or questions about production deployment, refer to the Next.js documentation or create an issue in the project repository. 