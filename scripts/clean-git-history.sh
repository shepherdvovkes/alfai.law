#!/bin/bash

echo "🧹 Cleaning git history from secrets..."

# Create a backup branch
git branch backup-before-cleanup

# Remove files from git history completely
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.local.default googleoauthsecret.json GOOGLE_OAUTH_SETUP.md' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up the backup
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Force garbage collection
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Git history cleaned. Now you can push:"
echo "git push origin main --force" 