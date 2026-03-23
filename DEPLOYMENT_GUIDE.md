# MemoryLayer Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [x] All tests passing (22/22)
- [x] Input validation implemented
- [x] Error handling implemented
- [x] Rate limiting implemented
- [x] Structured logging implemented
- [x] Graceful shutdown implemented
- [ ] Code review completed
- [ ] Security audit completed

### Infrastructure
- [ ] Database backups configured
- [ ] Environment variables set
- [ ] SSL/TLS certificates ready
- [ ] CDN configured (optional)
- [ ] Monitoring/alerting set up
- [ ] Log aggregation configured

---

## Deployment Options

### Option 1: Railway (Recommended for MVP)

**Pros:**
- Simple deployment
- Auto-scaling
- Free tier available
- PostgreSQL support
- Environment variables management

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/memorylayer.git
git push -u origin main
```

2. **Connect to Railway**
- Go to https://railway.app
- Sign up with GitHub
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your memorylayer repo
- Railway auto-detects Node.js

3. **Configure Environment Variables**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
PORT=3000
```

4. **Deploy**
- Railway automatically deploys on push
- View logs in Railway dashboard

**Cost:** ~$5-10/month for production

---

### Option 2: Vercel

**Pros:**
- Serverless
- Free tier
- Great for Next.js
- Auto-scaling

**Steps:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Configure Environment Variables**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Note:** Vercel is better for frontend. For backend, use Railway or AWS.

---

### Option 3: AWS (EC2 + RDS)

**Pros:**
- Full control
- Scalable
- Enterprise-grade

**Steps:**

1. **Create EC2 Instance**
```bash
# Ubuntu 22.04 LTS
# t3.micro (free tier eligible)
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone and Deploy**
```bash
git clone https://github.com/yourusername/memorylayer.git
cd memorylayer
npm install
npm start
```

4. **Use PM2 for Process Management**
```bash
npm install -g pm2
pm2 start server.js --name "memorylayer"
pm2 startup
pm2 save
```

5. **Set Up Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name api.memorylayer.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.memorylayer.com
```

---

## Environment Variables

### Required
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
PORT=3000
```

### Optional
```
CORS_ORIGIN=https://yourdomain.com
DEBUG=false
LOG_LEVEL=info
```

---

## Database Setup

### Supabase (Already Configured)

Your database is already set up with:
- ✅ Memories table with pgvector
- ✅ Projects table
- ✅ Row-level security policies
- ✅ Proper indexes

### Backups

Enable automatic backups in Supabase:
1. Go to Project Settings
2. Backups
3. Enable daily backups
4. Set retention to 30 days

---

## Monitoring & Logging

### Logs Directory
```
logs/
├── error.log      # Errors only
├── combined.log   # All logs
└── info.log       # Info level
```

### View Logs
```bash
# Real-time
tail -f logs/combined.log

# Last 100 lines
tail -100 logs/combined.log

# Search for errors
grep ERROR logs/combined.log
```

### Recommended: Sentry Integration

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

---

## Performance Optimization

### 1. Enable Caching
```bash
npm install redis
```

### 2. Database Connection Pooling
Already configured with Supabase

### 3. Compression
```javascript
import compression from 'compression';
app.use(compression());
```

### 4. CDN for Static Assets
Use Cloudflare or AWS CloudFront

---

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation enabled
- [ ] Error messages don't leak info
- [ ] Secrets not in code
- [ ] Database backups enabled
- [ ] Monitoring/alerting set up
- [ ] Regular security updates

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Single server
- Supabase managed database
- ~100 concurrent users

### Phase 2: Growth (1000+ users)
- Add Redis caching
- Database read replicas
- Load balancer
- Multiple server instances

### Phase 3: Enterprise (10000+ users)
- Kubernetes cluster
- Distributed caching
- Database sharding
- CDN for global distribution

---

## Rollback Plan

### If Deployment Fails

**Railway:**
```bash
# Revert to previous deployment
# In Railway dashboard: Deployments → Select previous → Redeploy
```

**Manual:**
```bash
# Stop current version
pm2 stop memorylayer

# Checkout previous version
git checkout previous-commit

# Restart
npm install
pm2 start server.js
```

---

## Post-Deployment

### 1. Verify Health
```bash
curl https://api.memorylayer.com/health
```

### 2. Test API
```bash
curl -X POST https://api.memorylayer.com/api/memory/capture \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test memory",
    "user_id": "test-user",
    "section": "personal"
  }'
```

### 3. Monitor Logs
```bash
tail -f logs/combined.log
```

### 4. Set Up Alerts
- CPU > 80%
- Memory > 80%
- Error rate > 1%
- Response time > 1s

---

## Troubleshooting

### Server Won't Start
```bash
# Check logs
tail -f logs/error.log

# Check port
lsof -i :3000

# Check environment variables
env | grep SUPABASE
```

### Database Connection Error
```bash
# Verify credentials
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test connection
psql postgresql://user:password@host/database
```

### High Memory Usage
```bash
# Check process
ps aux | grep node

# Restart
pm2 restart memorylayer
```

### Rate Limiting Issues
- Check logs for rate limit errors
- Adjust limits in `middleware/rateLimiter.js`
- Redeploy

---

## Support

For issues:
1. Check logs: `logs/error.log`
2. Review PRODUCTION_READINESS_REPORT.md
3. Check GitHub issues
4. Contact support

---

## Next Steps

1. ✅ Deploy to production
2. ⏳ Build admin dashboard
3. ⏳ Add Chrome extension
4. ⏳ Integrate with Cursor/Claude Code
5. ⏳ Launch beta program
