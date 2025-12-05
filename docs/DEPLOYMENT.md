# AssignmentHub Deployment Guide

Complete guide for deploying AssignmentHub to production environments.

## 🚀 Deployment Overview

AssignmentHub consists of two main components:
- **Backend API** (Node.js/Express) - Can be deployed to any Node.js hosting service
- **Frontend App** (React) - Can be deployed to any static hosting service

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Production MongoDB database ready
- [ ] Domain names configured
- [ ] SSL certificates obtained
- [ ] Environment variables prepared
- [ ] Twilio account setup (optional)

### Code Preparation
- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment-specific configurations set
- [ ] Security configurations reviewed
- [ ] Database migrations ready

## 🗄 Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   ```bash
   # Visit https://www.mongodb.com/atlas
   # Create free tier cluster
   ```

2. **Configure Database**
   - Create database: `assignmenthub`
   - Create user with read/write permissions
   - Whitelist IP addresses (0.0.0.0/0 for development)

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/assignmenthub?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # CentOS/RHEL
   sudo yum install mongodb-server

   # macOS
   brew install mongodb-community
   ```

2. **Configure Security**
   ```bash
   # Enable authentication
   sudo nano /etc/mongod.conf
   
   # Add:
   security:
     authorization: enabled
   ```

3. **Create Database User**
   ```javascript
   use assignmenthub
   db.createUser({
     user: "assignmenthub_user",
     pwd: "secure_password",
     roles: ["readWrite"]
   })
   ```

## 🖥 Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**
   ```bash
   cd server
   railway init
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set MONGODB_URI="your_mongodb_connection_string"
   railway variables set JWT_SECRET="your_super_secret_jwt_key"
   railway variables set CLIENT_URL="https://your-frontend-domain.com"
   railway variables set NODE_ENV="production"
   ```

4. **Configure Custom Domain**
   ```bash
   railway domain add your-api-domain.com
   ```

### Option 2: Render

1. **Create Render Account**
   - Visit https://render.com
   - Connect your GitHub repository

2. **Create Web Service**
   - Select your repository
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assignmenthub
   JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random
   CLIENT_URL=https://your-frontend-domain.com
   NODE_ENV=production
   PORT=5000
   ```

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create your-app-name-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set JWT_SECRET="your_super_secret_jwt_key"
   heroku config:set CLIENT_URL="https://your-frontend-domain.com"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Visit DigitalOcean App Platform
   - Connect GitHub repository
   - Select `server` folder as source

2. **Configure Build**
   ```yaml
   # .do/app.yaml
   name: assignmenthub-api
   services:
   - name: api
     source_dir: /server
     github:
       repo: your-username/assignmenthub
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: MONGODB_URI
       value: your_mongodb_connection_string
     - key: JWT_SECRET
       value: your_super_secret_jwt_key
     - key: CLIENT_URL
       value: https://your-frontend-domain.com
     - key: NODE_ENV
       value: production
   ```

### Option 5: VPS/Dedicated Server

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/assignmenthub.git
   cd assignmenthub/server

   # Install dependencies
   npm install --production

   # Create environment file
   nano .env
   ```

3. **Environment Configuration**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/assignmenthub
   JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random
   CLIENT_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

4. **Start with PM2**
   ```bash
   pm2 start server.js --name "assignmenthub-api"
   pm2 startup
   pm2 save
   ```

5. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/assignmenthub-api
   server {
       listen 80;
       server_name your-api-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-api-domain.com
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd client
   vercel --prod
   ```

3. **Environment Variables**
   - Go to Vercel dashboard
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-api-domain.com
     ```

4. **Custom Domain**
   - Add custom domain in Vercel dashboard
   - Configure DNS records

### Option 2: Netlify

1. **Build Application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop `build` folder to Netlify
   - Or connect GitHub repository

3. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-api-domain.com
   ```

4. **Configure Redirects**
   ```bash
   # client/public/_redirects
   /*    /index.html   200
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://your-username.github.io/assignmenthub",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: AWS S3 + CloudFront

1. **Build Application**
   ```bash
   cd client
   REACT_APP_API_URL=https://your-api-domain.com npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 website s3://your-bucket-name --index-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

4. **Configure CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain and SSL

## 🔧 Production Configuration

### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assignmenthub?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random_at_least_32_characters

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Optional: Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Optional: File Storage (if using cloud storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your-s3-bucket-name
```

### Frontend Environment Variables

```env
# API Configuration
REACT_APP_API_URL=https://your-api-domain.com

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Optional: Error Tracking
REACT_APP_SENTRY_DSN=https://your-sentry-dsn
```

## 🔒 Security Configuration

### Backend Security

1. **HTTPS Only**
   ```javascript
   // server.js
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

2. **Security Headers**
   ```bash
   npm install helmet
   ```
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

3. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

### Database Security

1. **MongoDB Security**
   - Enable authentication
   - Use strong passwords
   - Limit network access
   - Regular backups

2. **Connection Security**
   ```javascript
   // Use SSL for MongoDB connection
   const mongoOptions = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     ssl: true,
     sslValidate: true
   };
   ```

## 📊 Monitoring & Logging

### Application Monitoring

1. **PM2 Monitoring** (for VPS deployments)
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

2. **Error Tracking with Sentry**
   ```bash
   npm install @sentry/node
   ```
   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   ```

3. **Uptime Monitoring**
   - Use services like UptimeRobot, Pingdom, or StatusCake
   - Monitor both API and frontend endpoints

### Database Monitoring

1. **MongoDB Atlas Monitoring**
   - Built-in monitoring and alerts
   - Performance insights
   - Automated backups

2. **Custom Health Checks**
   ```javascript
   // Add to server.js
   app.get('/api/health', async (req, res) => {
     try {
       await mongoose.connection.db.admin().ping();
       res.json({
         status: 'OK',
         database: 'Connected',
         timestamp: new Date().toISOString()
       });
     } catch (error) {
       res.status(500).json({
         status: 'Error',
         database: 'Disconnected',
         error: error.message
       });
     }
   });
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy AssignmentHub

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd server && npm install
        cd ../client && npm install
    
    - name: Run tests
      run: |
        cd server && npm test
        cd ../client && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Railway
      run: |
        npm install -g @railway/cli
        cd server
        railway login --token ${{ secrets.RAILWAY_TOKEN }}
        railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Build and Deploy to Vercel
      run: |
        cd client
        npm install
        npm run build
        npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📱 Mobile Considerations

### PWA Configuration

1. **Service Worker** (already included with Create React App)
   ```javascript
   // client/public/sw.js
   // Customize caching strategies
   ```

2. **App Manifest**
   ```json
   // client/public/manifest.json
   {
     "short_name": "AssignmentHub",
     "name": "AssignmentHub - Holiday Assignments",
     "icons": [
       {
         "src": "favicon.ico",
         "sizes": "64x64 32x32 24x24 16x16",
         "type": "image/x-icon"
       }
     ],
     "start_url": ".",
     "display": "standalone",
     "theme_color": "#3B82F6",
     "background_color": "#ffffff"
   }
   ```

## 🔧 Performance Optimization

### Backend Optimization

1. **Compression**
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Caching**
   ```bash
   npm install redis
   ```
   ```javascript
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   ```

### Frontend Optimization

1. **Build Optimization**
   ```bash
   # Analyze bundle size
   cd client
   npm install --save-dev webpack-bundle-analyzer
   npm run build
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

2. **CDN Configuration**
   - Use CloudFront, CloudFlare, or similar
   - Configure proper cache headers
   - Enable gzip compression

## 🔄 Backup Strategy

### Database Backups

1. **MongoDB Atlas** (Automatic)
   - Continuous backups enabled by default
   - Point-in-time recovery available

2. **Self-Hosted MongoDB**
   ```bash
   # Daily backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --db assignmenthub --out /backups/mongodb_$DATE
   
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

### File Backups

1. **Local Files**
   ```bash
   # Backup uploads directory
   tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/
   ```

2. **Cloud Storage Migration**
   ```javascript
   // Consider migrating to AWS S3, Google Cloud Storage, etc.
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3();
   ```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Ensure CLIENT_URL is correctly set
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

2. **Database Connection Issues**
   ```javascript
   // Add connection error handling
   mongoose.connection.on('error', (err) => {
     console.error('MongoDB connection error:', err);
   });
   ```

3. **File Upload Issues**
   ```javascript
   // Check file permissions and disk space
   const fs = require('fs');
   if (!fs.existsSync('uploads')) {
     fs.mkdirSync('uploads');
   }
   ```

### Health Check Endpoints

```javascript
// Add comprehensive health checks
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {}
  };

  try {
    // Database check
    await mongoose.connection.db.admin().ping();
    health.services.database = 'Connected';
  } catch (error) {
    health.services.database = 'Error';
    health.status = 'Error';
  }

  // File system check
  try {
    fs.accessSync('uploads', fs.constants.W_OK);
    health.services.filesystem = 'OK';
  } catch (error) {
    health.services.filesystem = 'Error';
    health.status = 'Error';
  }

  res.status(health.status === 'OK' ? 200 : 500).json(health);
});
```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**
   ```nginx
   upstream assignmenthub_api {
       server api1.yourdomain.com;
       server api2.yourdomain.com;
   }
   ```

2. **Database Scaling**
   - MongoDB replica sets
   - Read replicas for better performance
   - Sharding for large datasets

3. **File Storage Scaling**
   - Migrate to cloud storage (AWS S3, Google Cloud)
   - CDN for file delivery
   - Image optimization services

### Vertical Scaling

1. **Server Resources**
   - Monitor CPU and memory usage
   - Scale server instances as needed
   - Optimize database queries

2. **Database Optimization**
   - Add indexes for frequently queried fields
   - Optimize aggregation pipelines
   - Regular performance monitoring

---

**Complete Deployment Guide for AssignmentHub**
*Production-ready deployment strategies and best practices*