# Custom Domain Setup with Cloudflare (juzi.dev)

This guide covers setting up your Cloudflare-managed domain `juzi.dev` to work with the ClearSkies AWS deployment.

## Overview

We'll configure:
- **Frontend**: `clearskies.juzi.dev` → S3 static website
- **Backend API**: `api.juzi.dev` → EC2 instance (3.226.72.134:3000)

This approach provides:
- Clean URLs without exposing IP addresses
- Free SSL/TLS certificates via Cloudflare
- DDoS protection and CDN caching
- Easy to update if EC2 IP changes

## Architecture

```
User Browser
    ↓
clearskies.juzi.dev (Cloudflare DNS + Proxy)
    ↓
S3 Static Website (clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com)
    ↓ (API calls to api.juzi.dev)
    ↓
api.juzi.dev (Cloudflare DNS + Proxy)
    ↓
EC2 Instance (3.226.72.134:3000)
```

## Part 1: Configure DNS Records in Cloudflare

### 1.1 Access Cloudflare DNS Settings

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain: `juzi.dev`
3. Go to **DNS** → **Records**

### 1.2 Create DNS Record for Backend API

Add a DNS record for the backend API:

**Record Type**: A
- **Name**: `api` (will create api.juzi.dev)
- **IPv4 address**: `3.226.72.134` (your EC2 public IP)
- **Proxy status**: Proxied (orange cloud icon) - enables Cloudflare features
- **TTL**: Auto

Click **Save**

### 1.3 Create DNS Record for Frontend

You have two options for the frontend:

#### Option A: CNAME to S3 (Recommended)

**Record Type**: CNAME
- **Name**: `clearskies` (will create clearskies.juzi.dev)
- **Target**: `clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com`
- **Proxy status**: Proxied (orange cloud) - enables HTTPS and caching
- **TTL**: Auto

#### Option B: Subdomain Redirect (Alternative)

If you want to use the root domain or a different subdomain, you can create a page rule to redirect.

**For this guide, we'll use Option A (CNAME).**

### 1.4 Verify DNS Records

After saving, you should have:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | api | 3.226.72.134 | Proxied |
| CNAME | clearskies | clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com | Proxied |

## Part 2: Configure Cloudflare SSL/TLS Settings

### 2.1 Set SSL/TLS Encryption Mode

1. In Cloudflare dashboard, go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Flexible** (since S3 and EC2 don't have SSL certificates)
   - This encrypts traffic between user and Cloudflare
   - Cloudflare to origin (S3/EC2) uses HTTP

**Important**: For production, you should upgrade to **Full (Strict)** after setting up SSL on your origins.

### 2.2 Enable Always Use HTTPS

1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **Always Use HTTPS** (forces HTTP to HTTPS redirect)
3. Enable **Automatic HTTPS Rewrites**

### 2.3 Configure Minimum TLS Version

1. In **Edge Certificates**, set **Minimum TLS Version** to 1.2 or higher

## Part 3: Configure Cloudflare Page Rules (Optional but Recommended)

Page rules help optimize caching and routing.

### 3.1 Create Cache Rule for Frontend

1. Go to **Rules** → **Page Rules**
2. Click **Create Page Rule**

**URL Pattern**: `clearskies.juzi.dev/*`

**Settings**:
- **Cache Level**: Cache Everything
- **Edge Cache TTL**: 2 hours (or longer for production)
- **Browser Cache TTL**: Respect Existing Headers

Click **Save and Deploy**

### 3.2 Create Rule for API (No Caching)

**URL Pattern**: `api.juzi.dev/*`

**Settings**:
- **Cache Level**: Bypass
- **Disable Apps**: On
- **Disable Performance**: On

Click **Save and Deploy**

## Part 4: Update Backend CORS Configuration

The backend needs to allow requests from your new domain.

### 4.1 Update be/index.ts

Edit `be/index.ts` to include the new domain in CORS origins:

```typescript
// Middleware - CORS configuration
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com',
    'https://clearskies.juzi.dev',  // Add custom domain
    'http://clearskies.juzi.dev'    // Allow HTTP too (will redirect to HTTPS)
  ],
  credentials: true
}));

// Socket.io - CORS configuration
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:4200',
      'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com',
      'https://clearskies.juzi.dev',  // Add custom domain
      'http://clearskies.juzi.dev'    // Allow HTTP too
    ],
    credentials: true
  }
});
```

### 4.2 Rebuild and Deploy Backend

```bash
# On EC2 instance
cd /home/ec2-user/ClearSkies

# Pull latest changes (if committed)
git pull origin main

# Or manually update be/index.ts via nano/vim
nano be/index.ts
# Make the CORS changes shown above

# Rebuild backend
cd be
npm run build

# Restart PM2
pm2 restart clearskies-backend

# Verify logs
pm2 logs clearskies-backend
```

## Part 5: Update Frontend Configuration

### 5.1 Create New Environment File for Custom Domain

Create a new environment file for the custom domain deployment:

`ui/src/environments/environment.cloudflare.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.juzi.dev/api'
};
```

### 5.2 Update angular.json

Add a new configuration for Cloudflare deployment:

```json
{
  "projects": {
    "ui": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "cloudflare": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.cloudflare.ts"
                }
              ],
              "outputHashing": "all",
              "optimization": true,
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

### 5.3 Add Build Script

Add a new build script to `ui/package.json`:

```json
{
  "scripts": {
    "build:cloudflare": "ng build --configuration cloudflare"
  }
}
```

### 5.4 Build and Deploy Frontend

```bash
# On local machine
cd ui

# Build with Cloudflare configuration
npm run build:cloudflare

# Verify correct API URL in build
cd dist/ui/browser
# Windows:
findstr /s "api.juzi.dev" *
# Mac/Linux:
grep -r "api.juzi.dev" .

# Upload to S3
aws s3 sync . s3://clearskies-frontend-dev --delete
```

## Part 6: Configure Cloudflare for Port 3000 (Backend)

Since the backend runs on port 3000, we need to configure Cloudflare to proxy this correctly.

### 6.1 Create Origin Rule

1. Go to **Rules** → **Transform Rules** → **Modify Request Header**
2. Create a new rule:

**Rule Name**: Backend Port Forward

**When incoming requests match**:
- Field: Hostname
- Operator: equals
- Value: `api.juzi.dev`

**Then**:
- Action: Rewrite to
- Path: Keep same
- Host: `3.226.72.134:3000`

### 6.2 Alternative: Use Cloudflare Spectrum (Enterprise) or Workers

If the above doesn't work due to port restrictions, you have options:

#### Option A: Change Backend to Port 80

Edit backend to listen on port 80 (requires sudo):

```typescript
const PORT = process.env.PORT || 80;
```

Update EC2 security group to allow port 80 instead of 3000.

#### Option B: Use nginx Reverse Proxy on EC2

Install nginx on EC2 to proxy port 80 → 3000:

```bash
sudo yum install -y nginx

# Configure nginx
sudo nano /etc/nginx/conf.d/clearskies.conf
```

Add configuration:

```nginx
server {
    listen 80;
    server_name api.juzi.dev;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Start nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

Update security group to allow port 80 instead of (or in addition to) port 3000.

**Recommended: Option B (nginx reverse proxy)** - This is the most standard approach.

## Part 7: Testing

### 7.1 DNS Propagation Check

Wait 5-10 minutes for DNS to propagate, then test:

```bash
# Check DNS resolution
nslookup api.juzi.dev
nslookup clearskies.juzi.dev

# Should resolve to Cloudflare IPs (proxied) or your EC2/S3 IPs
```

### 7.2 Test Backend API

```bash
# Test API endpoint
curl https://api.juzi.dev/health

# Should return: {"status":"OK", ...}
```

### 7.3 Test Frontend

1. Open browser and navigate to: `https://clearskies.juzi.dev`
2. Open DevTools (F12) → Network tab
3. Try to login/register
4. Verify API calls go to `https://api.juzi.dev/api/...`
5. Check for CORS errors (should be none)
6. Test Socket.io connection
7. Test game features (activities, crafting, combat)

### 7.4 SSL Certificate Check

Verify SSL is working:
1. Click the padlock icon in browser address bar
2. View certificate details
3. Should show Cloudflare certificate
4. Valid and trusted

## Part 8: Update Documentation

Update deployment guide to include custom domain instructions.

Update `CLAUDE.md` with:

```markdown
## Production URLs

- **Frontend**: https://clearskies.juzi.dev
- **Backend API**: https://api.juzi.dev/api
- **S3 Fallback**: http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com
- **EC2 Direct**: http://3.226.72.134:3000
```

## Troubleshooting

### Issue: DNS Not Resolving

**Solution**:
1. Check DNS records are saved in Cloudflare
2. Wait 5-10 minutes for propagation
3. Clear browser DNS cache: `chrome://net-internals/#dns`
4. Flush system DNS: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### Issue: SSL Certificate Errors

**Solution**:
1. Verify SSL/TLS mode is set to **Flexible**
2. Enable **Always Use HTTPS**
3. Wait a few minutes for SSL provisioning
4. Clear browser cache

### Issue: CORS Errors with Custom Domain

**Solution**:
1. Verify backend CORS includes both HTTP and HTTPS versions of domain
2. Rebuild and restart backend after CORS changes
3. Check backend logs: `pm2 logs clearskies-backend`

### Issue: Port 3000 Not Accessible via Domain

**Solution**:
1. Implement nginx reverse proxy (recommended)
2. Or change backend to port 80
3. Update security group rules accordingly

### Issue: API Returns 502 Bad Gateway

**Solution**:
1. Check backend is running: `pm2 status`
2. Check backend logs: `pm2 logs clearskies-backend`
3. Verify EC2 instance is accessible: `curl http://3.226.72.134:3000/health`
4. If using nginx, check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Issue: Frontend Shows Old Content

**Solution**:
1. Clear Cloudflare cache:
   - Go to **Caching** → **Configuration**
   - Click **Purge Everything**
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private browsing mode

## Security Considerations

### Production Checklist

- [ ] Enable **Full (Strict)** SSL mode (after setting up SSL on origins)
- [ ] Enable **HSTS** (HTTP Strict Transport Security)
- [ ] Enable **WAF** (Web Application Firewall) in Cloudflare
- [ ] Set up **Rate Limiting** rules
- [ ] Enable **DDoS Protection**
- [ ] Configure **Bot Fight Mode**
- [ ] Set up **Firewall Rules** to restrict API access if needed
- [ ] Monitor **Analytics** dashboard regularly
- [ ] Set up **Email Alerts** for downtime

### nginx SSL Configuration (Advanced)

For production, set up SSL on nginx:

```bash
# Install certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.juzi.dev

# Auto-renewal
sudo systemctl enable certbot-renew.timer
```

Update Cloudflare SSL mode to **Full (Strict)**.

## Cost Considerations

- **Cloudflare Free Tier**: Includes DNS, basic DDoS protection, shared SSL certificate, caching
- **No additional cost** for DNS and basic features
- **Paid Plans**: If you need advanced features (Page Shield, Advanced DDoS, etc.)

## Next Steps

1. **Monitor Performance**: Use Cloudflare Analytics to track usage
2. **Set Up Monitoring**: Configure uptime monitoring (UptimeRobot, Pingdom)
3. **Backup Strategy**: Document backup/restore procedures
4. **Staging Environment**: Consider creating staging.juzi.dev for testing
5. **CI/CD Pipeline**: Automate deployments with GitHub Actions
6. **Database Security**: Move MongoDB to Atlas or enable authentication
7. **API Rate Limiting**: Implement rate limiting on backend
8. **Logging**: Set up centralized logging (CloudWatch, Datadog)

## Additional Resources

- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Cloudflare SSL/TLS Documentation](https://developers.cloudflare.com/ssl/)
- [nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Let's Encrypt Certbot](https://certbot.eff.org/)
