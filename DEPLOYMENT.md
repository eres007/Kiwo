# Deployment Guide

This guide covers deploying MemoryLayer to various platforms.

## Pre-Deployment Checklist

- [ ] All tests passing (100%)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Documentation updated

## Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev

# Run tests
npm test

# Server runs on http://localhost:3000
```

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t memorylayer:latest .

# Tag for registry
docker tag memorylayer:latest your-registry/memorylayer:latest

# Push to registry
docker push your-registry/memorylayer:latest
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e SUPABASE_SERVICE_ROLE_KEY=your_key \
  -e JWT_SECRET=your_secret \
  -e ENCRYPTION_KEY=your_key \
  -e NODE_ENV=production \
  memorylayer:latest
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f memorylayer

# Stop services
docker-compose down
```

## Heroku Deployment

### Prerequisites
- Heroku CLI installed
- Heroku account

### Deploy

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NEXT_PUBLIC_SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set ENCRYPTION_KEY=your_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Scale dynos
heroku ps:scale web=2
```

### Procfile

Create `Procfile`:
```
web: node server.js
```

## AWS Deployment

### Option 1: Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 memorylayer

# Create environment
eb create memorylayer-env

# Set environment variables
eb setenv NEXT_PUBLIC_SUPABASE_URL=your_url
eb setenv SUPABASE_SERVICE_ROLE_KEY=your_key
eb setenv JWT_SECRET=your_secret
eb setenv ENCRYPTION_KEY=your_key

# Deploy
eb deploy

# View logs
eb logs

# Monitor
eb open
```

### Option 2: EC2 + PM2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/eres007/Kiwo.git
cd Kiwo

# Install dependencies
npm install

# Configure environment
nano .env.local
# Add your environment variables

# Start with PM2
pm2 start server.js --name "memorylayer"
pm2 startup
pm2 save

# View logs
pm2 logs memorylayer

# Monitor
pm2 monit
```

### Option 3: Lambda + API Gateway

```bash
# Install Serverless Framework
npm install -g serverless

# Create serverless config
serverless create --template aws-nodejs

# Deploy
serverless deploy

# View logs
serverless logs -f app
```

## Google Cloud Deployment

### Cloud Run

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project your-project-id

# Build image
gcloud builds submit --tag gcr.io/your-project-id/memorylayer

# Deploy
gcloud run deploy memorylayer \
  --image gcr.io/your-project-id/memorylayer \
  --platform managed \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=your_url \
  --set-env-vars SUPABASE_SERVICE_ROLE_KEY=your_key \
  --set-env-vars JWT_SECRET=your_secret \
  --set-env-vars ENCRYPTION_KEY=your_key

# View logs
gcloud run logs read memorylayer --limit 50
```

### App Engine

```bash
# Create app.yaml
cat > app.yaml << EOF
runtime: nodejs18
env: standard

env_variables:
  NODE_ENV: "production"
  NEXT_PUBLIC_SUPABASE_URL: "your_url"
  SUPABASE_SERVICE_ROLE_KEY: "your_key"
  JWT_SECRET: "your_secret"
  ENCRYPTION_KEY: "your_key"
EOF

# Deploy
gcloud app deploy

# View logs
gcloud app logs read
```

## DigitalOcean Deployment

### App Platform

```bash
# Create app.yaml
cat > app.yaml << EOF
name: memorylayer
services:
- name: api
  github:
    repo: eres007/Kiwo
    branch: main
  build_command: npm install
  run_command: npm start
  http_port: 3000
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_SUPABASE_URL
    value: ${SUPABASE_URL}
  - key: SUPABASE_SERVICE_ROLE_KEY
    value: ${SUPABASE_KEY}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  - key: ENCRYPTION_KEY
    value: ${ENCRYPTION_KEY}
EOF

# Deploy via DigitalOcean dashboard
# Or use doctl CLI
doctl apps create --spec app.yaml
```

### Droplet + Nginx

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Clone repository
cd /var/www
git clone https://github.com/eres007/Kiwo.git memorylayer
cd memorylayer

# Install dependencies
npm install

# Configure Nginx
cat > /etc/nginx/sites-available/memorylayer << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/memorylayer /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Install SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com

# Start application
npm start &
```

## Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_min_32_chars
ENCRYPTION_KEY=your_encryption_key_32_chars
```

### Optional
```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
SENTRY_DSN=your_sentry_dsn
```

## Database Setup

### Supabase

1. Create Supabase project
2. Get credentials from project settings
3. Run migrations in SQL Editor:
   - `migrations/001_update_memories_schema.sql`
   - `migrations/002_create_users_table.sql`
   - `migrations/003_fix_memories_foreign_keys.sql`

### PostgreSQL (Self-hosted)

```bash
# Connect to database
psql -U postgres -h localhost -d memorylayer

# Run migrations
\i migrations/001_update_memories_schema.sql
\i migrations/002_create_users_table.sql
\i migrations/003_fix_memories_foreign_keys.sql
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --standalone -d your-domain.com

# Auto-renewal
certbot renew --dry-run
```

### Self-signed (Development)

```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365
```

## Monitoring & Logging

### Application Logs

```bash
# View logs
tail -f logs/combined.log

# Filter errors
grep ERROR logs/error.log

# Real-time monitoring
watch -n 1 'tail -20 logs/combined.log'
```

### Health Checks

```bash
# Check health
curl http://localhost:3000/health

# Check metrics
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/monitoring/metrics
```

### Uptime Monitoring

- Use services like UptimeRobot, Pingdom, or Datadog
- Monitor `/health` endpoint
- Set up alerts for downtime

## Backup & Recovery

### Database Backup

```bash
# Supabase automatic backups
# Enabled by default, check dashboard

# Manual backup
pg_dump -U postgres -h localhost memorylayer > backup.sql

# Restore
psql -U postgres -h localhost memorylayer < backup.sql
```

### Application Backup

```bash
# Backup code and config
tar -czf memorylayer-backup.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=logs \
  .

# Store in S3
aws s3 cp memorylayer-backup.tar.gz s3://your-bucket/
```

## Scaling

### Horizontal Scaling

```bash
# Load balancer setup (Nginx)
upstream memorylayer {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://memorylayer;
    }
}
```

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Add caching layer (Redis)
- Use CDN for static assets

## Troubleshooting

### Application won't start

```bash
# Check logs
npm run dev 2>&1 | tee debug.log

# Verify environment variables
env | grep SUPABASE

# Check port availability
lsof -i :3000
```

### Database connection issues

```bash
# Test connection
psql -U postgres -h localhost -d memorylayer -c "SELECT 1"

# Check credentials
echo $SUPABASE_SERVICE_ROLE_KEY

# Verify network access
telnet your-db-host 5432
```

### Performance issues

```bash
# Check CPU/Memory
top

# Check disk space
df -h

# Check database performance
EXPLAIN ANALYZE SELECT * FROM memories;
```

## Post-Deployment

1. **Verify deployment**
   - Test all endpoints
   - Run test suite
   - Check logs for errors

2. **Monitor**
   - Set up alerts
   - Monitor metrics
   - Track errors

3. **Backup**
   - Verify backups working
   - Test restore procedure
   - Document recovery steps

4. **Security**
   - Rotate secrets
   - Update dependencies
   - Run security audit

## Support

- 📧 Email: support@memorylayer.dev
- 📚 Docs: [README.md](./README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/eres007/Kiwo/issues)
