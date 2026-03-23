# Production Deployment Checklist

## Pre-Deployment (Do Before Going Live)

### Code Quality
- [x] All tests passing (22/22)
- [x] No console.log (using structured logger)
- [x] Error handling complete
- [x] Input validation on all endpoints
- [x] Rate limiting configured
- [x] CORS properly configured
- [x] Environment variables validated
- [x] No hardcoded secrets
- [ ] Code review completed
- [ ] Security audit completed

### Database
- [x] Schema created
- [x] Indexes created
- [x] Row-level security enabled
- [x] Backups configured
- [ ] Test data cleaned up
- [ ] Backup tested (restore works)

### API
- [x] All endpoints tested
- [x] Error responses standardized
- [x] Pagination implemented
- [x] Rate limiting active
- [x] Health check endpoint
- [ ] API documentation complete
- [ ] Swagger/OpenAPI spec

### Logging & Monitoring
- [x] Structured logging implemented
- [x] Log files configured
- [ ] Log aggregation (Sentry/DataDog)
- [ ] Monitoring dashboards
- [ ] Alerting configured
- [ ] Error tracking setup

### Security
- [x] Input validation
- [x] Error handling (no info leaks)
- [x] Rate limiting
- [x] CORS configured
- [ ] SSL/TLS certificates
- [ ] Secrets management
- [ ] Security headers
- [ ] HTTPS enforced
- [ ] Regular security updates

### Performance
- [x] Database queries optimized
- [x] Indexes created
- [ ] Caching layer (Redis)
- [ ] CDN configured
- [ ] Load testing completed
- [ ] Performance benchmarks

---

## Deployment Day

### 1. Final Verification (30 minutes)
```bash
# Run all tests
npm test

# Check logs
tail -f logs/combined.log

# Verify environment variables
env | grep SUPABASE
env | grep NODE_ENV

# Test health endpoint
curl http://localhost:3000/health
```

### 2. Database Backup (5 minutes)
```bash
# In Supabase dashboard
# Settings → Backups → Create backup
```

### 3. Deploy (5-30 minutes depending on platform)

**Railway:**
```bash
git push origin main
# Auto-deploys
```

**Manual:**
```bash
# Stop current
pm2 stop memorylayer

# Pull latest
git pull origin main

# Install dependencies
npm install

# Start
pm2 start server.js
```

### 4. Verify Deployment (10 minutes)
```bash
# Health check
curl https://api.memorylayer.com/health

# Test API
curl -X POST https://api.memorylayer.com/api/memory/capture \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Production test",
    "user_id": "test-user",
    "section": "personal"
  }'

# Check logs
tail -f logs/combined.log
```

### 5. Monitor (First 24 hours)
- Watch error logs
- Monitor CPU/memory
- Check response times
- Verify rate limiting
- Test all endpoints

---

## Post-Deployment

### Day 1
- [ ] Monitor logs continuously
- [ ] Check error rate
- [ ] Verify backups working
- [ ] Test all endpoints
- [ ] Monitor performance

### Week 1
- [ ] Gather metrics
- [ ] Review logs
- [ ] Check for errors
- [ ] Optimize if needed
- [ ] Document issues

### Month 1
- [ ] Review performance
- [ ] Analyze usage patterns
- [ ] Plan optimizations
- [ ] Security audit
- [ ] Update documentation

---

## Rollback Plan

### If Something Goes Wrong

**Immediate (First 5 minutes):**
```bash
# Stop the server
pm2 stop memorylayer

# Revert to previous version
git checkout HEAD~1

# Restart
npm install
pm2 start server.js
```

**Restore from Backup:**
```bash
# In Supabase dashboard
# Settings → Backups → Restore
```

**Contact Support:**
- Check logs for errors
- Review PRODUCTION_READINESS_REPORT.md
- Contact team

---

## Monitoring Checklist

### Daily
- [ ] Check error logs
- [ ] Verify health endpoint
- [ ] Monitor CPU/memory
- [ ] Check response times

### Weekly
- [ ] Review performance metrics
- [ ] Analyze usage patterns
- [ ] Check for security issues
- [ ] Review error trends

### Monthly
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Capacity planning
- [ ] Update dependencies

---

## Alerts to Set Up

### Critical (Page immediately)
- [ ] Server down (health check fails)
- [ ] Error rate > 5%
- [ ] Response time > 5 seconds
- [ ] Database connection error

### Warning (Email)
- [ ] Error rate > 1%
- [ ] Response time > 1 second
- [ ] CPU > 80%
- [ ] Memory > 80%
- [ ] Disk > 90%

### Info (Log only)
- [ ] Rate limit hit
- [ ] Validation error
- [ ] Deprecation warning

---

## Maintenance Windows

### Planned Maintenance
- Schedule: Sundays 2-4 AM UTC
- Duration: 30 minutes
- Notification: 24 hours before
- Rollback: <5 minutes

### Emergency Maintenance
- No advance notice
- Rollback: <5 minutes
- Communication: Immediate

---

## Success Criteria

### Deployment Success
- [x] All tests passing
- [x] Health check responding
- [x] API endpoints working
- [x] Database connected
- [x] Logging working
- [x] Rate limiting active
- [x] Error handling working

### Post-Deployment Success
- [ ] Error rate < 0.1%
- [ ] Response time < 200ms
- [ ] Uptime > 99.9%
- [ ] No critical errors
- [ ] Users can create memories
- [ ] File sync working
- [ ] Context files updating

---

## Troubleshooting

### Server Won't Start
```bash
# Check logs
tail -f logs/error.log

# Check port
lsof -i :3000

# Check environment
env | grep SUPABASE

# Restart
pm2 restart memorylayer
```

### Database Connection Error
```bash
# Verify credentials
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test connection
psql postgresql://user:password@host/database
```

### High Error Rate
```bash
# Check logs
grep ERROR logs/combined.log

# Check rate limiting
grep "rate limit" logs/combined.log

# Check validation errors
grep "VALIDATION_ERROR" logs/combined.log
```

### Slow Response Times
```bash
# Check database queries
grep "duration" logs/combined.log | sort -t: -k3 -rn | head

# Check AI refinement time
grep "Refining memory" logs/combined.log

# Check rate limiting
grep "RateLimit" logs/combined.log
```

---

## Communication Plan

### Before Deployment
- [ ] Notify team
- [ ] Schedule maintenance window
- [ ] Prepare rollback plan
- [ ] Brief on-call engineer

### During Deployment
- [ ] Monitor logs
- [ ] Check health endpoint
- [ ] Test endpoints
- [ ] Verify backups

### After Deployment
- [ ] Confirm success
- [ ] Monitor for 24 hours
- [ ] Document any issues
- [ ] Update team

---

## Documentation

### Update Before Deployment
- [ ] API documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Runbook
- [ ] Architecture diagram

### Keep Updated
- [ ] Change log
- [ ] Known issues
- [ ] Performance metrics
- [ ] Capacity planning

---

## Final Sign-Off

- [ ] Code review: _______________
- [ ] QA testing: _______________
- [ ] Security audit: _______________
- [ ] DevOps approval: _______________
- [ ] Product approval: _______________

**Deployment approved by:** _______________
**Date:** _______________
**Time:** _______________

---

## Post-Deployment Review

### 24 Hours After
- [ ] Error rate acceptable
- [ ] Response times good
- [ ] No critical issues
- [ ] Users happy

### 1 Week After
- [ ] Performance stable
- [ ] No regressions
- [ ] Metrics collected
- [ ] Lessons learned

### 1 Month After
- [ ] Full analysis
- [ ] Optimization opportunities
- [ ] Capacity planning
- [ ] Next improvements

---

**Status: Ready for Production Deployment**

**Last Updated:** March 23, 2026
**Next Review:** After deployment
