#!/bin/bash

echo "🔒 Removing secrets from git history..."

# Remove files with secrets from git tracking
git rm --cached .env.local.default 2>/dev/null || true
git rm --cached googleoauthsecret.json 2>/dev/null || true
git rm --cached GOOGLE_OAUTH_SETUP.md 2>/dev/null || true

# Remove any other potential secret files
find . -name "*.json" -exec grep -l "client_secret\|api_key\|password" {} \; | xargs -I {} git rm --cached {} 2>/dev/null || true

# Create a new commit without secrets
git add .gitignore
git commit -m "chore: update gitignore to exclude secrets and sensitive files"

echo "✅ Secrets removed from tracking. Please force push if needed:"
echo "git push origin main --force-with-lease" 