# ClearSkies - Production Architecture Diagram

## Overview

ClearSkies is deployed on AWS with a custom domain (`juzi.dev`) managed by Cloudflare, featuring a modern cloud architecture with CDN distribution, API server, and database.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
│                         (Anywhere in the world)                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                           CLOUDFLARE DNS                                 │
│                           (juzi.dev domain)                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  clearskies.juzi.dev  →  CloudFront Distribution                 │  │
│  │  api.juzi.dev         →  3.226.72.134 (EC2)        [Proxied ☁️] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                     SSL/TLS Termination & DNS Resolution                │
└────────────────────┬──────────────────────────────┬─────────────────────┘
                     │                              │
                     │ HTTPS                        │ HTTPS
                     │ (Frontend)                   │ (API)
                     │                              │
┌────────────────────▼──────────────────┐   ┌──────▼──────────────────────┐
│      AWS CLOUDFRONT (CDN)             │   │   CLOUDFLARE PROXY          │
│   d1234abcdef.cloudfront.net          │   │   (Orange Cloud)            │
│                                       │   │   - DDoS Protection         │
│   - SSL Certificate (ACM)             │   │   - HTTPS Enforcement       │
│   - Global Edge Locations             │   │   - WAF (Web App Firewall)  │
│   - Caching (Static Assets)           │   └──────┬──────────────────────┘
│   - Error Page Handling (Angular)     │          │
│   - Origin: S3 Static Website         │          │ HTTP
└────────────────────┬──────────────────┘          │
                     │                              │
                     │ HTTP                         │
                     │                              │
┌────────────────────▼──────────────────┐   ┌──────▼──────────────────────┐
│         AWS S3 BUCKET                 │   │   AWS EC2 INSTANCE          │
│   clearskies.juzi.dev                 │   │   Amazon Linux 2023         │
│   (us-east-1)                         │   │   t2.micro (or larger)      │
│                                       │   │   IP: 3.226.72.134          │
│   - Static Website Hosting            │   │                             │
│   - Public Read Access                │   │  ┌──────────────────────┐   │
│   - Angular App (Built)               │   │  │   NGINX (Port 80)    │   │
│   - Files:                            │   │  │   Reverse Proxy      │   │
│     • index.html                      │   │  └──────────┬───────────┘   │
│     • *.js (chunks)                   │   │             │               │
│     • *.css                           │   │             │ Proxy         │
│     • assets/                         │   │             │               │
│                                       │   │  ┌──────────▼───────────┐   │
│   Website Endpoint:                   │   │  │  NODE.JS/EXPRESS     │   │
│   clearskies.juzi.dev                 │   │  │  (Port 3000)         │   │
│   .s3-website-us-east-1.amazonaws.com │   │  │  Managed by PM2      │   │
└───────────────────────────────────────┘   │  │                      │   │
                                            │  │  - API Routes        │   │
                                            │  │  - Socket.io Server  │   │
                                            │  │  - CORS Configured   │   │
                                            │  │  - JWT Auth          │   │
                                            │  └──────────┬───────────┘   │
                                            │             │               │
                                            │             │ DB Connection │
                                            │             │               │
                                            │  ┌──────────▼───────────┐   │
                                            │  │  MONGODB (Port 27017)│   │
                                            │  │  Local Instance      │   │
                                            │  │                      │   │
                                            │  │  - Database: clearskies │
                                            │  │  - Collections:      │   │
                                            │  │    • users           │   │
                                            │  │    • players         │   │
                                            │  │    • chatmessages    │   │
                                            │  └──────────────────────┘   │
                                            └─────────────────────────────┘
```

## Detailed Component Breakdown

### 1. Frontend Layer (Angular 20)

**Hosting**: AWS S3 + CloudFront CDN

**Domain**: https://clearskies.juzi.dev

**Build Configuration**:
- Environment: `environment.cloudflare.ts`
- API URL: `https://api.juzi.dev/api`
- Build Command: `npm run build:cloudflare`
- Output: `ui/dist/ui/browser/`

**CloudFront Distribution**:
- Origin: S3 bucket static website endpoint
- SSL Certificate: AWS Certificate Manager (ACM) - us-east-1
- Viewer Protocol: Redirect HTTP to HTTPS
- Error Pages: 403/404 → `/index.html` (for Angular routing)
- Caching: Optimized for static assets

**S3 Bucket**:
- Name: `clearskies.juzi.dev`
- Region: us-east-1
- Static Website Hosting: Enabled
- Index Document: `index.html`
- Error Document: `index.html`
- Public Access: Enabled via bucket policy

### 2. Backend Layer (Node.js/Express)

**Hosting**: AWS EC2 (Amazon Linux 2023)

**Domain**: https://api.juzi.dev

**Instance Details**:
- Public IP: `3.226.72.134`
- Instance Type: t2.micro (or larger)
- OS: Amazon Linux 2023
- Region: us-east-1

**nginx Configuration**:
- Port 80 → Proxies to localhost:3000
- Handles HTTPS via Cloudflare proxy
- Location: `/etc/nginx/conf.d/clearskies.conf`

**Node.js Application**:
- Runtime: Node.js 20.x
- Framework: Express 5.x
- Process Manager: PM2
- Port: 3000 (internal)
- Binding: 0.0.0.0 (IPv4)

**API Features**:
- RESTful API endpoints
- Socket.io for real-time features
- JWT authentication
- CORS configured for custom domain
- Response validation middleware

**Environment Variables** (`.env`):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/clearskies
JWT_SECRET=<production-secret>
JWT_EXPIRE=7d
NODE_ENV=production
```

### 3. Database Layer (MongoDB)

**Hosting**: EC2 Instance (local)

**Version**: MongoDB 6.0

**Port**: 27017

**Database**: `clearskies`

**Collections**:
- `users` - User authentication data
- `players` - Game state (inventory, skills, progress)
- `chatmessages` - Global chat history

**Access**: Local only (not exposed to internet)

### 4. DNS & SSL Layer (Cloudflare)

**Domain**: juzi.dev

**DNS Records**:
```
clearskies.juzi.dev  →  CNAME  →  d1234abcdef.cloudfront.net  [DNS Only]
api.juzi.dev         →  A      →  3.226.72.134                [Proxied ☁️]
```

**SSL/TLS Settings**:
- Mode: Flexible
- Always Use HTTPS: Enabled (for api subdomain)
- Minimum TLS Version: 1.2

**Cloudflare Features Active**:
- DDoS Protection
- CDN (for api.juzi.dev)
- DNS Management
- SSL/TLS Termination (for API)

### 5. Security Configuration

**EC2 Security Group**:
```
Inbound Rules:
- SSH (22)        from Your IP
- HTTP (80)       from 0.0.0.0/0
- Custom TCP (3000) from 0.0.0.0/0 (for direct access if needed)
```

**S3 Bucket Policy**:
```json
{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::clearskies.juzi.dev/*"
}
```

**CORS Configuration** (Backend):
```javascript
origin: [
  'http://localhost:4200',
  'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com',
  'http://clearskies.juzi.dev',
  'https://clearskies.juzi.dev'
]
```

## Data Flow

### Frontend Request Flow

```
User Action (Browser)
    ↓
HTTPS Request to clearskies.juzi.dev
    ↓
Cloudflare DNS Resolution
    ↓
CloudFront Distribution (Edge Location - Nearest to User)
    ↓
Cache Hit? → Return Cached Content
    │
    No ↓
S3 Bucket Origin (us-east-1)
    ↓
Fetch HTML/JS/CSS
    ↓
CloudFront Caches Response
    ↓
Return to User Browser
```

### API Request Flow

```
User Action (Browser) - API Call
    ↓
HTTPS Request to api.juzi.dev/api/*
    ↓
Cloudflare DNS Resolution
    ↓
Cloudflare Proxy (SSL Termination, DDoS Protection)
    ↓
HTTP to EC2 (3.226.72.134:80)
    ↓
nginx Reverse Proxy
    ↓
Node.js/Express (localhost:3000)
    ↓
MongoDB Query (localhost:27017)
    ↓
Response Back Through Chain
    ↓
User Browser
```

### Socket.io Connection Flow

```
User Browser (Socket.io Client)
    ↓
WSS Connection to api.juzi.dev
    ↓
Cloudflare Proxy (WebSocket Support)
    ↓
nginx WebSocket Proxy (Upgrade header)
    ↓
Node.js Socket.io Server (Port 3000)
    ↓
Real-time Bidirectional Communication
    ↓
Events: chat, activities, crafting, combat
```

## Deployment Workflow

### Frontend Deployment

```bash
# Local Machine
cd ui
npm run build:cloudflare

# Upload to S3
cd dist/ui/browser
aws s3 sync . s3://clearskies.juzi.dev --delete

# CloudFront automatically serves new files
# (Cache invalidation may be needed for immediate updates)
```

### Backend Deployment

```bash
# SSH to EC2
ssh -i "ClearSkiesKeyPair.pem" ec2-user@3.226.72.134

# Pull latest code
cd /home/ec2-user/ClearSkies
git pull origin main

# Build backend
cd be
npm run build

# Restart PM2
pm2 restart clearskies-backend

# Check logs
pm2 logs clearskies-backend
```

## Monitoring & Maintenance

### Backend Monitoring (PM2)

```bash
# Check status
pm2 status

# View logs
pm2 logs clearskies-backend

# Monitor processes
pm2 monit

# Restart on reboot
pm2 startup
pm2 save
```

### Database Monitoring

```bash
# Connect to MongoDB
mongosh

# Check database status
use clearskies
db.stats()

# View collections
show collections
```

### Service Status Checks

```bash
# nginx status
sudo systemctl status nginx

# MongoDB status
sudo systemctl status mongod

# Port binding verification
sudo netstat -tuln | grep -E '(80|3000|27017)'
```

## URLs & Endpoints

### Public URLs

- **Frontend**: https://clearskies.juzi.dev
- **API Base**: https://api.juzi.dev/api
- **Health Check**: https://api.juzi.dev/health

### Development URLs (Local)

- **Frontend Dev**: http://localhost:4200
- **Backend Dev**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

### Legacy URLs (Still Functional)

- **S3 Direct**: http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com
- **EC2 Direct**: http://3.226.72.134:3000

## Technology Stack

### Frontend
- **Framework**: Angular 20 (Standalone Components)
- **Language**: TypeScript 5.9
- **State Management**: Angular Signals
- **Real-time**: Socket.io Client 4.8
- **HTTP Client**: Angular HttpClient
- **Styling**: SCSS with design tokens

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express 5.x
- **Language**: TypeScript (compiled to JavaScript)
- **Real-time**: Socket.io Server 4.8
- **Authentication**: JWT with bcrypt
- **Process Manager**: PM2
- **Web Server**: nginx (reverse proxy)

### Database
- **Database**: MongoDB 6.0
- **Driver**: Mongoose ODM

### Infrastructure
- **Cloud Provider**: AWS (EC2, S3, CloudFront, ACM)
- **DNS/CDN**: Cloudflare
- **SSL Certificates**:
  - Frontend: AWS Certificate Manager
  - Backend: Cloudflare SSL
- **OS**: Amazon Linux 2023

## Cost Breakdown (Monthly Estimates)

### AWS Costs
- **EC2 t2.micro**: ~$8-10/month (or free tier first year)
- **S3 Storage**: ~$0.023 per GB (~$0.10/month for small app)
- **S3 Requests**: Minimal (~$0.01/month)
- **CloudFront**: First 1TB free, then ~$0.085/GB (~$0-5/month for small traffic)
- **ACM Certificate**: **FREE**

### Cloudflare Costs
- **DNS**: **FREE** (Free plan)
- **CDN/Proxy**: **FREE** (Free plan)
- **SSL Certificate**: **FREE** (Free plan)

### Total Estimated Cost
- **First Year**: ~$0-2/month (EC2 free tier)
- **After First Year**: ~$8-15/month

## Scalability Considerations

### Current Limitations
- Single EC2 instance (no redundancy)
- MongoDB on same server as application
- No auto-scaling configured

### Future Improvements
1. **Database**: Migrate to MongoDB Atlas (managed, replicated)
2. **Application**: Add auto-scaling group for EC2
3. **Load Balancing**: Add Application Load Balancer
4. **Caching**: Redis for session storage and caching
5. **Monitoring**: CloudWatch alarms and dashboards
6. **Backups**: Automated S3 backups for database
7. **CI/CD**: GitHub Actions for automated deployments

## Security Features

✅ **HTTPS Everywhere**: All traffic encrypted
✅ **JWT Authentication**: Secure token-based auth
✅ **CORS Protection**: Whitelist of allowed origins
✅ **DDoS Protection**: Cloudflare proxy on API
✅ **Input Validation**: Request validation middleware
✅ **SQL Injection Prevention**: MongoDB (NoSQL) + Mongoose sanitization
✅ **XSS Protection**: Angular's built-in sanitization
✅ **Password Hashing**: bcrypt with salt rounds

## Backup & Disaster Recovery

### Current Backups
- Git repository: GitHub (code backup)
- No automated database backups currently

### Recommended Backup Strategy
1. **Database**: Daily mongodump to S3
2. **Application**: Git tags for releases
3. **Configuration**: Document all nginx/PM2 configs
4. **Recovery Plan**: Documented restore procedures

## Documentation

- **Deployment Guide**: [aws-deployment-guide.md](aws-deployment-guide.md)
- **Custom Domain Setup**: [cloudflare-custom-domain-setup.md](cloudflare-custom-domain-setup.md)
- **Main Documentation**: [CLAUDE.md](../../CLAUDE.md)

---

**Last Updated**: November 14, 2025
**Architecture Version**: 1.0.0
**Status**: Production Ready ✅
