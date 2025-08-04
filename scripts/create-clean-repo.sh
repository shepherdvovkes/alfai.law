#!/bin/bash

echo "🔄 Creating clean repository without secrets..."

# Create a new directory for clean repo
cd ..
mkdir alfai-law-clean
cd alfai-law-clean

# Initialize new git repository
git init

# Copy all files except secrets
cp -r ../alfai.law/* .
cp -r ../alfai.law/.* . 2>/dev/null || true

# Remove secret files
rm -f .env.local.default
rm -f googleoauthsecret.json
rm -f GOOGLE_OAUTH_SETUP.md
rm -f .env.local.default~

# Remove any other potential secret files
find . -name "*.json" -exec grep -l "client_secret\|api_key\|password" {} \; | xargs rm -f 2>/dev/null || true

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit - clean repository without secrets"

# Add remote
git remote add origin https://github.com/shepherdvovkes/alfai.law.git

echo "✅ Clean repository created. You can now push:"
echo "cd ../alfai-law-clean"
echo "git push origin main --force" 