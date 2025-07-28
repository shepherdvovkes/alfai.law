#!/bin/bash

echo "🚀 Starting Legal AI System in Production Mode"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${RED}❌ Port $port is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
        return 0
    fi
}

# Function to start WebSocket server
start_websocket_server() {
    echo -e "\n🔌 Starting WebSocket server on port 3001..."
    
    if check_port 3001; then
        echo -e "${GREEN}Starting WebSocket server...${NC}"
        node ws-openai-server.js &
        WEBSOCKET_PID=$!
        echo -e "${GREEN}✅ WebSocket server started (PID: $WEBSOCKET_PID)${NC}"
        
        # Wait a moment for the server to start
        sleep 2
        
        # Check if WebSocket server is running
        if curl -s http://localhost:3001 > /dev/null 2>&1 || lsof -i :3001 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ WebSocket server is running on ws://localhost:3001${NC}"
        else
            echo -e "${YELLOW}⚠️  WebSocket server may not be fully started yet${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Skipping WebSocket server (port 3001 in use)${NC}"
    fi
}

# Function to start main Next.js server
start_main_server() {
    echo -e "\n🌐 Starting main Next.js server on port 3000..."
    
    if check_port 3000; then
        echo -e "${GREEN}Starting Next.js production server...${NC}"
        npm start &
        MAIN_PID=$!
        echo -e "${GREEN}✅ Main server started (PID: $MAIN_PID)${NC}"
        
        # Wait for server to start
        sleep 3
        
        # Check if main server is running
        if curl -s -I http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Main server is running on http://localhost:3000${NC}"
        else
            echo -e "${YELLOW}⚠️  Main server may not be fully started yet${NC}"
        fi
    else
        echo -e "${RED}❌ Cannot start main server (port 3000 in use)${NC}"
        exit 1
    fi
}

# Function to create missing routes
create_missing_routes() {
    echo -e "\n📁 Creating missing route placeholders..."
    
    # Create directories for missing routes
    mkdir -p app/dashboard/analytics
    mkdir -p app/calendar
    mkdir -p app/research
    mkdir -p app/reports
    mkdir -p app/settings
    mkdir -p app/precedent-analysis
    
    # Create placeholder pages
    cat > app/dashboard/analytics/page.tsx << 'EOF'
export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <p className="text-text-secondary">Analytics features coming soon...</p>
    </div>
  )
}
EOF

    cat > app/calendar/page.tsx << 'EOF'
export default function CalendarPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar & Tasks</h1>
      <p className="text-text-secondary">Calendar features coming soon...</p>
    </div>
  )
}
EOF

    cat > app/research/page.tsx << 'EOF'
export default function ResearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Legal Research</h1>
      <p className="text-text-secondary">Research features coming soon...</p>
    </div>
  )
}
EOF

    cat > app/reports/page.tsx << 'EOF'
export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
      <p className="text-text-secondary">Reporting features coming soon...</p>
    </div>
  )
}
EOF

    cat > app/settings/page.tsx << 'EOF'
export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings & Admin</h1>
      <p className="text-text-secondary">Settings features coming soon...</p>
    </div>
  )
}
EOF

    cat > app/precedent-analysis/page.tsx << 'EOF'
export default function PrecedentAnalysisPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Precedent Analysis</h1>
      <p className="text-text-secondary">Precedent analysis features coming soon...</p>
    </div>
  )
}
EOF

    echo -e "${GREEN}✅ Created placeholder pages for missing routes${NC}"
}

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    
    if [ ! -z "$WEBSOCKET_PID" ]; then
        echo -e "Stopping WebSocket server (PID: $WEBSOCKET_PID)..."
        kill $WEBSOCKET_PID 2>/dev/null
    fi
    
    if [ ! -z "$MAIN_PID" ]; then
        echo -e "Stopping main server (PID: $MAIN_PID)..."
        kill $MAIN_PID 2>/dev/null
    fi
    
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo -e "\n🔧 Preparing production environment..."
    
    # Check if build exists
    if [ ! -d ".next" ]; then
        echo -e "${RED}❌ No production build found. Run 'npm run build' first.${NC}"
        exit 1
    fi
    
    # Create missing routes
    create_missing_routes
    
    # Start WebSocket server
    start_websocket_server
    
    # Start main server
    start_main_server
    
    # Final status
    echo -e "\n🎉 Legal AI System is now running in production mode!"
    echo -e "${GREEN}   🌐 Main Application: http://localhost:3000${NC}"
    echo -e "${GREEN}   🔌 WebSocket Server: ws://localhost:3001${NC}"
    echo -e "\n📝 Press Ctrl+C to stop all servers"
    
    # Keep script running
    wait
}

# Run main function
main 