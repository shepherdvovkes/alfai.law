#!/bin/bash

echo "Clearing cache and restarting servers with updated CSP..."

# Kill existing processes
pkill -f "next start" 2>/dev/null
pkill -f "ws-openai-server.js" 2>/dev/null

# Wait for processes to stop
sleep 3

# Clear Next.js cache
rm -rf .next/cache 2>/dev/null

# Restart servers
./scripts/start-production.sh 