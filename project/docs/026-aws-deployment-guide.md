# AWS Deployment Guide - ClearSkies Game

This guide documents the steps to deploy the ClearSkies game to AWS using S3 for frontend static hosting and EC2 for the backend API.

## Architecture Overview

- **Frontend**: Angular 20 application hosted on AWS S3 with static website hosting
- **Backend**: Node.js/Express API running on AWS EC2 (Amazon Linux 2023)
- **Database**: MongoDB running locally on EC2 instance
- **Process Manager**: PM2 for backend process management
- **Communication**: CORS-enabled REST API + Socket.io for real-time features

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured locally
- SSH key pair for EC2 access
- Node.js 20.x (required for Angular 20)
- Git

## Part 1: EC2 Backend Setup

### 1.1 Launch EC2 Instance

1. Launch an EC2 instance with Amazon Linux 2023
2. Instance type: t2.micro or larger
3. Configure security group with the following inbound rules:
   - SSH (port 22) from your IP
   - Custom TCP (port 3000) from anywhere (0.0.0.0/0)
4. Create or use existing key pair for SSH access
5. Note the public IP address (e.g., 3.226.72.134)

### 1.2 Connect to EC2 Instance

```bash
ssh -i "path/to/your-keypair.pem" ec2-user@<EC2_PUBLIC_IP>
```

### 1.3 Install Node.js 20.x

```bash
# Install Node.js 20.x from NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### 1.4 Install MongoDB 6.0

```bash
# Create MongoDB repository file
sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF

# Install MongoDB
sudo yum install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 1.5 Install Git and PM2

```bash
# Install Git
sudo yum install -y git

# Install PM2 globally
sudo npm install -g pm2
```

### 1.6 Clone and Setup Backend

```bash
# Clone repository
cd /home/ec2-user
git clone https://github.com/your-username/ClearSkies.git
cd ClearSkies

# Install dependencies
npm install
```

### 1.7 Configure Environment Variables

Create `.env` file in the backend directory:

```bash
cd /home/ec2-user/ClearSkies/be
nano .env
```

Add the following configuration:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/clearskies
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=production
```

Save and exit (Ctrl+X, Y, Enter).

### 1.8 Update Backend for Production

The backend needs to:
1. Bind to 0.0.0.0 (not just IPv6) for external accessibility
2. Allow CORS from S3 bucket origin

In `be/index.ts`:

```typescript
// Middleware - CORS configuration
app.use(cors({
  origin: ['http://localhost:4200', 'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com'],
  credentials: true
}));

// Socket.io - CORS configuration
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com'],
    credentials: true
  }
});

// Start server - bind to 0.0.0.0 for IPv4 accessibility
const HOST = '0.0.0.0';
server.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Socket.io is ready for connections`);
});
```

### 1.9 Build and Run Backend

```bash
# Build TypeScript backend
cd /home/ec2-user/ClearSkies/be
npm run build

# Run database migrations
npm run migrate

# Start with PM2
pm2 start dist/index.js --name clearskies-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
# Follow the command it suggests (usually: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user)
```

### 1.10 Verify Backend is Running

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs clearskies-backend

# Test API endpoint locally
curl http://localhost:3000/health

# Verify port binding
netstat -tuln | grep 3000
# Should show: tcp 0 0 0.0.0.0:3000 0.0.0.0:* LISTEN
```

### 1.11 Configure EC2 Security Group

Ensure security group has inbound rule:
- **Type**: Custom TCP
- **Port**: 3000
- **Source**: Anywhere-IPv4 (0.0.0.0/0)
- **Description**: Backend API access

## Part 2: S3 Frontend Setup

### 2.1 Create S3 Bucket

```bash
# Create bucket (replace with your bucket name)
aws s3 mb s3://clearskies-frontend-dev --region us-east-1

# Enable static website hosting
aws s3 website s3://clearskies-frontend-dev \
  --index-document index.html \
  --error-document index.html
```

### 2.2 Configure Bucket Policy

Create a bucket policy to allow public read access:

```bash
aws s3api put-bucket-policy --bucket clearskies-frontend-dev --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::clearskies-frontend-dev/*"
    }
  ]
}'
```

### 2.3 Update Frontend Configuration

Create production environment file with EC2 backend URL:

`ui/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://3.226.72.134:3000/api'  // Replace with your EC2 public IP
};
```

### 2.4 Configure Angular Build

Ensure `angular.json` has production configuration with file replacements:

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
            }
          }
        }
      }
    }
  }
}
```

Add explicit build script to `ui/package.json`:

```json
{
  "scripts": {
    "build:prod": "ng build --configuration production"
  }
}
```

### 2.5 Update Frontend Services

Ensure all Angular services use `environment.apiUrl` instead of hardcoded localhost URLs:

**Files to update:**
- `ui/src/app/services/auth.service.ts`
- `ui/src/app/services/inventory.service.ts`
- `ui/src/app/services/location.service.ts`
- `ui/src/app/services/equipment.service.ts`
- All other services making HTTP requests

**Pattern:**

```typescript
import { environment } from '../../environments/environment';

export class ExampleService {
  private apiUrl = `${environment.apiUrl}/endpoint`;
  // ...
}
```

### 2.6 Build Angular Application

```bash
# Navigate to UI directory
cd ui

# Build for production
npm run build:prod

# Verify correct IP in build output
# On Windows:
cd dist/ui/browser
findstr /s "3.226.72.134" *

# On Mac/Linux:
cd dist/ui/browser
grep -r "3.226.72.134" .
```

### 2.7 Upload to S3

**Quick Deploy (Recommended):**
```bash
cd ui
npm run deploy
```

This automated script will:
1. Build the app with Cloudflare configuration
2. Upload all files to S3
3. Remove old files from S3

**Manual Upload:**
```bash
# Upload built files to S3 (--delete removes old files)
cd ui/dist/ui/browser
aws s3 sync . s3://clearskies-frontend-dev --delete
```

### 2.8 Access Application

Your application is now live:
- **Frontend URL**: http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com
- **Backend API**: http://3.226.72.134:3000/api

## Part 3: Testing and Verification

### 3.1 Test API Connectivity

1. Open the S3 frontend URL in your browser
2. Open browser DevTools (F12) → Network tab
3. Try to register/login
4. Verify API calls are going to EC2 IP (e.g., `http://3.226.72.134:3000/api/auth/login`)
5. Check for CORS errors in console (should be none)

### 3.2 Test Socket.io Connection

1. Login to the application
2. Check browser console for Socket.io connection message
3. Try real-time features (chat, activities, crafting, combat)
4. Verify Socket.io events are working

### 3.3 Monitor Backend

```bash
# SSH into EC2
ssh -i "your-keypair.pem" ec2-user@<EC2_IP>

# Check PM2 status
pm2 status

# View logs in real-time
pm2 logs clearskies-backend

# View last 100 lines of logs
pm2 logs clearskies-backend --lines 100
```

## Part 4: Maintenance and Updates

### 4.1 Update Backend Code

```bash
# SSH into EC2
ssh -i "your-keypair.pem" ec2-user@<EC2_IP>

# Navigate to project directory
cd /home/ec2-user/ClearSkies

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild backend
cd be
npm run build

# Run new migrations (if any)
npm run migrate

# Restart PM2 process
pm2 restart clearskies-backend

# Check logs
pm2 logs clearskies-backend
```

### 4.2 Update Frontend Code

```bash
# On local machine, update environment.prod.ts if needed
# Navigate to UI directory
cd ui

# Pull latest changes (if needed)
git pull origin main

# Install new dependencies (if any)
npm install

# Build for production
npm run build:prod

# Upload to S3
cd dist/ui/browser
aws s3 sync . s3://clearskies-frontend-dev --delete

# Clear browser cache and test
```

### 4.3 PM2 Useful Commands

```bash
# View process status
pm2 status

# View logs
pm2 logs clearskies-backend

# Restart process
pm2 restart clearskies-backend

# Stop process
pm2 stop clearskies-backend

# Start process
pm2 start clearskies-backend

# Delete process from PM2
pm2 delete clearskies-backend

# Monitor processes
pm2 monit
```

### 4.4 MongoDB Maintenance

```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use clearskies database
use clearskies

# Show collections
show collections

# Query users
db.users.find()

# Exit MongoDB shell
exit
```

## Troubleshooting

### Issue: API Calls Timeout

**Symptoms**: Frontend shows network timeout errors when calling backend API

**Solutions**:
1. Verify EC2 security group has port 3000 open to 0.0.0.0/0
2. Check backend is listening on 0.0.0.0 (not just IPv6):
   ```bash
   netstat -tuln | grep 3000
   # Should show: tcp 0 0 0.0.0.0:3000
   ```
3. Test from EC2 instance:
   ```bash
   curl http://localhost:3000/health
   ```
4. Verify you're using the correct EC2 public IP address

### Issue: CORS Errors

**Symptoms**: Browser console shows CORS policy errors

**Solutions**:
1. Verify S3 bucket URL is in CORS origin list in `be/index.ts`
2. Rebuild and restart backend after CORS changes
3. Clear browser cache

### Issue: Socket.io Not Connecting

**Symptoms**: Real-time features don't work, Socket.io connection errors

**Solutions**:
1. Verify Socket.io CORS configuration includes S3 bucket URL
2. Check browser console for connection errors
3. Verify backend Socket.io is initialized before starting server
4. Check PM2 logs for Socket.io errors

### Issue: Wrong EC2 IP Address

**Symptoms**: Worked locally but fails in production

**Solutions**:
1. Double-check EC2 public IP address in AWS Console
2. Update `environment.prod.ts` with correct IP
3. Rebuild Angular app: `npm run build:prod`
4. Re-upload to S3: `aws s3 sync . s3://clearskies-frontend-dev --delete`
5. Verify correct IP in build: `grep -r "YOUR_IP" dist/ui/browser/`

### Issue: MongoDB Connection Refused

**Symptoms**: Backend logs show MongoDB connection errors

**Solutions**:
1. Check MongoDB service status:
   ```bash
   sudo systemctl status mongod
   ```
2. Start MongoDB if stopped:
   ```bash
   sudo systemctl start mongod
   ```
3. Verify MongoDB URI in `.env` file

### Issue: PM2 Process Not Starting on Reboot

**Symptoms**: Backend down after EC2 restart

**Solutions**:
1. Run PM2 startup command:
   ```bash
   pm2 startup
   # Follow the command it suggests
   ```
2. Save PM2 process list:
   ```bash
   pm2 save
   ```
3. Reboot and test:
   ```bash
   sudo reboot
   # After reboot:
   pm2 status
   ```

## Security Considerations

### Production Recommendations

1. **Use HTTPS**: Set up SSL/TLS certificates for both frontend and backend
   - Frontend: Use CloudFront with ACM certificate
   - Backend: Use nginx reverse proxy with Let's Encrypt

2. **Restrict Security Group**: Limit port 3000 access to specific IP ranges if possible

3. **Use Environment Variables**: Never commit `.env` file to version control

4. **Strong JWT Secret**: Use a cryptographically secure random string for `JWT_SECRET`

5. **MongoDB Authentication**: Enable authentication for MongoDB in production

6. **Regular Updates**: Keep Node.js, npm packages, and MongoDB up to date

7. **Monitoring**: Set up CloudWatch monitoring for EC2 instance

8. **Backups**: Configure automated MongoDB backups

9. **Rate Limiting**: Implement rate limiting on API endpoints

10. **Firewall**: Consider using EC2 instance firewall (iptables/nftables) in addition to security groups

## Cost Optimization

- **EC2**: Use t2.micro (or t3.micro) for development (free tier eligible)
- **S3**: Static hosting is very cost-effective, only pay for storage and bandwidth
- **Data Transfer**: Minimize cross-region data transfer
- **Reserved Instances**: Consider reserved instances for production workloads
- **Auto-scaling**: Implement auto-scaling for production if needed

## Next Steps

1. **Custom Domain**: Configure Route 53 and CloudFront for custom domain
2. **HTTPS**: Set up SSL/TLS certificates
3. **CI/CD**: Automate deployments with GitHub Actions or AWS CodePipeline
4. **Monitoring**: Set up CloudWatch alarms and logging
5. **Backups**: Implement automated database backups
6. **Load Balancing**: Add application load balancer for high availability
7. **Database**: Consider moving to MongoDB Atlas for managed database

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
