# Next Steps Guide - ComicWise

Complete implementation guide for the optimization work.

## ✅ What Was Completed

### 1. Package.json Optimization
- ✅ 100+ scripts organized into 12 categories
- ✅ 20+ new utility commands added
- ✅ Better naming and categorization
- ✅ Comment headers for easy navigation

### 2. Utility Scripts Created
- ✅ `scripts/cache-stats.ts` - Redis statistics
- ✅ `scripts/clear-cache.ts` - Cache management
- ✅ `scripts/queue-worker.ts` - Background jobs
- ✅ `scripts/health-check.ts` - System health
- ✅ `scripts/check-db.ts` - Database check
- ✅ `scripts/check-redis.ts` - Redis check

### 3. Shell Aliases
- ✅ `scripts/aliases.sh` - Bash/Zsh aliases
- ✅ `scripts/aliases.ps1` - PowerShell aliases

### 4. CI/CD Integration
- ✅ `.github/workflows/health-check.yml` - Standalone health checks
- ✅ `.github/workflows/ci-with-health.yml` - Full CI with health checks

### 5. Documentation
- ✅ `docs/SCRIPTS_REFERENCE.md` - Complete guide
- ✅ `SCRIPTS_QUICK_REFERENCE.md` - Quick lookup
- ✅ `PACKAGE_JSON_OPTIMIZATION.md` - Summary
- ✅ This guide - Next steps

## 🚀 Action Items

### Immediate (Do Now)

#### 1. Review Documentation ✅
```bash
# Quick reference
cat SCRIPTS_QUICK_REFERENCE.md

# Full documentation
cat docs/SCRIPTS_REFERENCE.md
```

#### 2. Test Health Checks
```bash
# Check database (should work)
pnpm health:db

# Start Redis first
pnpm redis:start

# Then check Redis
pnpm health:redis

# Full check
pnpm health:all
```

Result: 
- ✅ Database: Connected
- ⚠️ Redis: Not running (expected - start with `pnpm redis:start`)

#### 3. Install Shell Aliases

**For Bash/Zsh (Linux/macOS):**
```bash
# Add to your shell config
cat scripts/aliases.sh >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc  # or ~/.zshrc

# Test it
pd  # Should run pnpm dev
```

**For PowerShell (Windows):**
```powershell
# Open profile
notepad $PROFILE

# Copy content from scripts/aliases.ps1
# Save and reload
. $PROFILE

# Test it
pd  # Should run pnpm dev
```

#### 4. Try New Commands
```bash
# View all scripts
pnpm run

# Try cache stats (requires Redis running)
pnpm redis:start
pnpm cache:stats

# Check database
pnpm health:db

# Upload images (dry run)
pnpm upload:bulk:dry-run
```

### Short Term (This Week)

#### 1. Set Up Redis
```bash
# Option 1: Docker (recommended)
pnpm redis:start

# Option 2: Direct install
# Follow: https://redis.io/docs/getting-started/installation/
```

#### 2. Test Queue Workers
```bash
# Start Redis
pnpm redis:start

# Start queue worker (in separate terminal)
pnpm queue:worker

# Test email queue
pnpm email:test
```

#### 3. Configure CI/CD

**If using GitHub Actions:**

The workflows are already created! Just push to trigger:

```bash
git add .github/workflows/
git commit -m "Add health check workflows"
git push
```

They will run on:
- Every push to main/develop
- Every pull request
- Daily at 6 AM UTC (health-check.yml)
- Manual trigger

**If using other CI:**

Copy the workflow structure from `.github/workflows/ci-with-health.yml` and adapt.

#### 4. Set Up Pre-commit Hooks

Husky is already configured. Ensure hooks run:

```bash
# Reinstall hooks
pnpm prepare

# Test pre-commit
git commit -m "test"  # Should run lint + format
```

#### 5. Team Onboarding

Share these docs with your team:
- `SCRIPTS_QUICK_REFERENCE.md` - Quick commands
- `scripts/aliases.sh` or `.ps1` - Shell aliases
- `docs/SCRIPTS_REFERENCE.md` - Full reference

### Medium Term (This Month)

#### 1. Monitor Health Checks

Review health check results in GitHub Actions:

```bash
# View locally
pnpm health:all

# View in CI
# Go to: https://github.com/YOUR_REPO/actions
# Look for "Health Checks" workflow
```

#### 2. Optimize Cache Usage

```bash
# Monitor cache
pnpm cache:stats

# Clear old cache
pnpm cache:clear "old:*"

# Full flush (careful!)
pnpm redis:flush
```

#### 3. Set Up Monitoring

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Datadog/New Relic for APM

Use health check scripts as foundation:
```typescript
// Example: Send health data to monitoring
const health = await healthCheck();
await monitoring.sendMetrics(health);
```

#### 4. Queue Dashboard

Access Bull Board for queue management:

```bash
pnpm queue:dashboard
# Open: http://localhost:3002
```

#### 5. Workflow Testing

Test QStash integration:

```bash
# Set QSTASH_TOKEN in .env.local
pnpm qstash:test

# Test workflow
pnpm workflow:test
```

### Long Term (Ongoing)

#### 1. Keep Scripts Updated

As project grows, add new scripts:

```json
{
  "scripts": {
    "my:task": "tsx scripts/my-task.ts",
    "my:task:dry-run": "tsx scripts/my-task.ts --dry-run"
  }
}
```

Follow naming conventions:
- `category:action` - Basic action
- `category:action:variant` - Variant

#### 2. Maintain Documentation

Update docs when adding scripts:
- Add to `SCRIPTS_QUICK_REFERENCE.md` if commonly used
- Add to `docs/SCRIPTS_REFERENCE.md` for completeness

#### 3. Monitor Performance

Use built-in commands:

```bash
# Build analysis
pnpm build:analyze

# Bundle size
pnpm bundle-size

# Lighthouse audit
pnpm lighthouse
```

#### 4. Security Audits

Regular security checks:

```bash
# Check vulnerabilities
pnpm audit

# Auto-fix
pnpm audit:fix

# Update dependencies
pnpm update-deps
```

#### 5. Health Check Automation

Schedule health checks:
- Already set up in `.github/workflows/health-check.yml`
- Runs daily at 6 AM UTC
- Creates issue if fails

## 📋 Checklist

### Immediate Tasks
- [ ] Read `SCRIPTS_QUICK_REFERENCE.md`
- [ ] Run `pnpm health:db` (should pass)
- [ ] Start Redis: `pnpm redis:start`
- [ ] Run `pnpm health:all`
- [ ] Install shell aliases
- [ ] Test a few alias shortcuts

### This Week
- [ ] Configure Redis properly
- [ ] Test queue worker
- [ ] Push health check workflows
- [ ] Set up pre-commit hooks
- [ ] Share docs with team

### This Month
- [ ] Monitor health checks in CI
- [ ] Set up cache monitoring
- [ ] Access queue dashboard
- [ ] Test QStash integration
- [ ] Review and optimize

## 🎓 Learning Resources

### Quick References
```bash
# View all available scripts
pnpm run | less

# Search for specific script
pnpm run | grep database

# Get help
pnpm <script> --help
```

### Documentation
1. **Scripts Reference** - `docs/SCRIPTS_REFERENCE.md`
2. **Quick Reference** - `SCRIPTS_QUICK_REFERENCE.md`
3. **Bulk Upload** - `docs/BULK_UPLOAD.md`
4. **Database Seed** - `src/database/seed/README.md`

### External Resources
- [pnpm docs](https://pnpm.io/)
- [BullMQ docs](https://docs.bullmq.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Next.js docs](https://nextjs.org/docs)

## 🆘 Troubleshooting

### Redis Connection Failed
```bash
# Start Redis
pnpm redis:start

# Check if running
pnpm redis:cli
# Type: PING (should return PONG)
```

### Database Issues
```bash
# Check connection
pnpm health:db

# Reset database
pnpm db:reset

# Hard reset
pnpm db:reset:hard
```

### Build Errors
```bash
# Clean everything
pnpm clean:all

# Reinstall
pnpm install

# Try build
pnpm build
```

### Tests Failing
```bash
# Run with debug
pnpm test:debug

# Check unit tests
pnpm test:unit:run

# Update snapshots
pnpm test:update-snapshots
```

## 💡 Pro Tips

### 1. Use Tab Completion
Type `pnpm ` and press Tab to see all scripts.

### 2. Chain Commands
```bash
pnpm lint:fix && pnpm format && pnpm type-check
```

### 3. Background Processes
```bash
# Start multiple services
pnpm dev &          # Dev server
pnpm queue:worker & # Worker
pnpm db:studio      # Database GUI (foreground)
```

### 4. Workflow Shortcuts
```bash
# Daily dev
pd              # Start dev
ptu             # Tests (using alias)
pdb             # Database GUI

# Before commit
pval            # Validate
ptu             # Unit tests

# Before deploy
pfull           # Full check (using alias)
```

### 5. Custom Aliases
Add your own to shell config:
```bash
alias myflow='pnpm clean && pnpm build && pnpm test'
```

## 🎉 Success Metrics

You'll know everything is working when:

- ✅ `pnpm health:all` passes
- ✅ All aliases work (test with `pd`)
- ✅ CI workflows run successfully
- ✅ Queue worker processes jobs
- ✅ Team uses scripts regularly

## 📞 Support

**Questions about scripts?**
- Check `docs/SCRIPTS_REFERENCE.md`
- Review `SCRIPTS_QUICK_REFERENCE.md`
- Look at examples in workflows

**Found a bug?**
- Check health: `pnpm health:all`
- Review logs
- Open issue with details

**Need new script?**
- Follow naming conventions
- Add to appropriate category
- Update documentation

---

## 🎯 Quick Start (TL;DR)

```bash
# 1. Read quick reference
cat SCRIPTS_QUICK_REFERENCE.md

# 2. Check health
pnpm health:db              # Should pass
pnpm redis:start            # Start Redis
pnpm health:all             # All checks

# 3. Install aliases (choose one)
cat scripts/aliases.sh >> ~/.bashrc     # Linux/Mac
# OR copy scripts/aliases.ps1 to $PROFILE  # Windows

# 4. Test shortcuts
pd                          # pnpm dev
phdb                        # pnpm health:db
pval                        # pnpm validate

# 5. Done! 🎉
```

---

**Status**: Ready for Production ✅
**Next Review**: 1 week
**Maintained**: Yes, keep updated
