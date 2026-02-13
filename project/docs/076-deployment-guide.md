# Deployment Guide

## Overview

ClearSkies is deployed using AWS infrastructure with Cloudflare proxy for SSL/TLS and CDN.

**Production URL**: https://clearskies.juzi.dev
**API Endpoint**: https://api.juzi.dev

## Frontend Deployment (S3 + Cloudflare)

### Infrastructure

- **S3 Bucket**: `clearskies-frontend-dev` (US East 1)
- **Hosting**: Static website hosting enabled
- **Cloudflare Proxy**: `clearskies.juzi.dev` → S3 endpoint
- **Features**: SSL/TLS certificates, CDN caching, DDoS protection
- **Content**: Angular production build (`ui/dist/ui/browser/*`)

### Build Environments

The frontend has three environment configurations:

#### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

#### EC2 Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://3.226.72.134:3000/api'
};
```

#### Cloudflare Production (environment.cloudflare.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.juzi.dev/api'
};
```

### Deployment Process

**Automated Deployment** (recommended):
```bash
cd ui && npm run deploy
```

This script:
1. Builds for Cloudflare production (`npm run build:cloudflare`)
2. Uploads to S3 bucket (`aws s3 sync`)
3. Invalidates CloudFront cache (if configured)

**Manual Deployment**:
1. Build for Cloudflare: `cd ui && npm run build:cloudflare`
2. Upload to S3: Upload all files from `ui/dist/ui/browser/` to bucket root
3. Access at: https://clearskies.juzi.dev

### Build Commands

```bash
npm run build              # Development build (localhost API)
npm run build:prod         # EC2 production build (direct IP)
npm run build:cloudflare   # Cloudflare production build (SSL API)
npm run deploy             # Build and upload to S3
```

## Backend Deployment (EC2)

### Infrastructure

- **Instance**: Amazon Linux 2023 on t2.micro
- **Public IP**: 3.226.72.134
- **Cloudflare Proxy**: `api.juzi.dev` → EC2:3000
- **Services**: Node.js 20.x, MongoDB, PM2 process manager
- **API Port**: 3000 (exposed via security group)
- **Features**: SSL/TLS via Cloudflare, DDoS protection

### Deployment Process

1. **Commit and push backend changes to Git**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. **SSH into EC2**
   ```bash
   ssh -i "clearskies-dev-ec2.pem" ec2-user@3.226.72.134
   ```

3. **Pull updates**
   ```bash
   cd ClearSkies
   git pull
   ```

4. **Build backend**
   ```bash
   cd be
   npm run build
   ```

5. **Run migrations** (if schema changes)
   ```bash
   npm run migrate
   ```

6. **Start/Restart with PM2**
   ```bash
   # First time
   pm2 start npm --name "clearskies-backend" -- run dev

   # Restart existing
   pm2 restart clearskies-backend

   # Check status
   pm2 status

   # View logs
   pm2 logs clearskies-backend
   ```

### CORS Configuration

**Location**: [be/index.ts](../../be/index.ts)

```typescript
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com',
    'http://clearskies.juzi.dev',
    'https://clearskies.juzi.dev'
  ],
  credentials: true
}));
```

### Environment Variables

Backend `.env` file on EC2:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/clearskies
JWT_SECRET=<production-secret>
JWT_EXPIRE=7d
NODE_ENV=production
```

## Security Groups

### Required Inbound Rules

- **Port 22 (SSH)** - For admin access
- **Port 3000 (Custom TCP)** - For backend API and Socket.io connections
- **Port 80 (HTTP)** - Optional, for future Nginx reverse proxy

### Security Best Practices

- Keep SSH key file (`clearskies-dev-ec2.pem`) secure and private
- Restrict SSH access to specific IP addresses in production
- Use environment variables for sensitive data
- Keep dependencies updated with `npm audit`

## Cloudflare Configuration

### DNS Records

- **clearskies.juzi.dev** (CNAME) → S3 website endpoint
  - Proxied: Yes (enables SSL/TLS and CDN)
  - SSL Mode: Full
- **api.juzi.dev** (A) → 3.226.72.134
  - Proxied: Yes (enables SSL/TLS and DDoS protection)
  - SSL Mode: Full

### Features Enabled

- **SSL/TLS**: Free certificates via Cloudflare
- **DDoS Protection**: Automatic threat mitigation
- **CDN Caching**: Global content delivery
- **Analytics**: Traffic and performance metrics
- **Firewall**: Custom security rules

### Cache Configuration

**Recommended Settings**:
- Static assets (JS, CSS, images): Cache everything
- API endpoints: Bypass cache
- HTML files: Cache with short TTL (5 minutes)

## Monitoring and Logs

### Backend Logs (PM2)

```bash
# View logs
pm2 logs clearskies-backend

# Clear logs
pm2 flush

# Monitor in real-time
pm2 monit
```

### Frontend Logs (Browser)

- Check browser console for client-side errors
- Use CloudFlare analytics for traffic insights
- Monitor S3 bucket access logs (if enabled)

## Database Management

### MongoDB on EC2

**Location**: `mongodb://localhost:27017/clearskies`

**Common Commands**:
```bash
# Connect to MongoDB
mongosh

# Backup database
mongodump --db clearskies --out /backup/$(date +%Y%m%d)

# Restore database
mongorestore --db clearskies /backup/20240101/clearskies

# Check database status
mongosh --eval "db.stats()"
```

### Migrations

**Run migrations**:
```bash
cd be
npm run migrate
```

**Check migration status**:
```bash
npm run migrate:status
```

**Rollback last migration**:
```bash
npm run migrate:down
```

## Troubleshooting

### Frontend Issues

**Issue**: Changes not appearing on production
- **Solution**: Clear Cloudflare cache or run `npm run deploy` (includes cache invalidation)

**Issue**: API calls failing with CORS errors
- **Solution**: Verify `apiUrl` in environment file and CORS origins in backend

**Issue**: 404 on page refresh
- **Solution**: Configure S3 error document to redirect to `index.html`

### Backend Issues

**Issue**: Server not responding
- **Solution**: Check PM2 status with `pm2 status`, restart if needed

**Issue**: Database connection errors
- **Solution**: Verify MongoDB is running with `sudo systemctl status mongod`

**Issue**: High memory usage
- **Solution**: Monitor with `pm2 monit`, consider upgrading instance type

### Cloudflare Issues

**Issue**: SSL/TLS errors
- **Solution**: Verify SSL mode is set to "Full" in Cloudflare settings

**Issue**: Slow response times
- **Solution**: Check cache hit rate in analytics, optimize cache rules

## Cost Optimization

### AWS Costs

- **EC2 t2.micro**: ~$8.50/month (free tier eligible for first year)
- **S3 Storage**: ~$0.023/GB/month
- **Data Transfer**: First 1GB free, then ~$0.09/GB

### Cloudflare Costs

- **Free Plan**: Includes SSL/TLS, CDN, basic DDoS protection
- **Upgrade considerations**: More advanced features available on paid tiers

### Optimization Tips

- Enable S3 lifecycle policies to delete old build artifacts
- Use Cloudflare cache to reduce S3 data transfer
- Monitor EC2 utilization, downsize if CPU/memory underutilized
- Compress static assets before upload (gzip/brotli)

## Scaling Considerations

### Horizontal Scaling (Future)

- Use AWS Load Balancer to distribute traffic across multiple EC2 instances
- Implement Redis for session storage and caching
- Consider AWS RDS or MongoDB Atlas for managed database

### Vertical Scaling

- Upgrade EC2 instance type (t2.small, t2.medium) for more CPU/memory
- Enable swap space for better memory management
- Optimize database indexes for query performance

## Related Documentation

- [024-cloudflare-custom-domain-setup.md](024-cloudflare-custom-domain-setup.md) - Detailed Cloudflare configuration
- [025-architecture-diagram.md](025-architecture-diagram.md) - Visual infrastructure overview
- [026-aws-deployment-guide.md](026-aws-deployment-guide.md) - Complete EC2 and S3 setup guide
