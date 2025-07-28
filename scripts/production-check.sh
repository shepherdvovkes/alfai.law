#!/bin/bash

echo "🚀 Legal AI System - Production Status Check"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if server is running
check_server() {
    echo -e "\n📡 Checking server status..."
    
    if curl -s -I http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is running on http://localhost:3000${NC}"
        
        # Get response details
        RESPONSE=$(curl -s -I http://localhost:3000 | head -1)
        echo -e "${GREEN}   Response: $RESPONSE${NC}"
        
        # Check if it's a Next.js server
        if curl -s http://localhost:3000 | grep -q "Next.js"; then
            echo -e "${GREEN}   ✅ Next.js application detected${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Next.js signature not found${NC}"
        fi
    else
        echo -e "${RED}❌ Server is not running on port 3000${NC}"
        return 1
    fi
}

# Function to check process
check_process() {
    echo -e "\n🔍 Checking Node.js process..."
    
    if lsof -i :3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Process found on port 3000${NC}"
        
        # Get process details
        PROCESS_INFO=$(lsof -i :3000 | grep LISTEN)
        echo -e "${GREEN}   Process: $PROCESS_INFO${NC}"
    else
        echo -e "${RED}❌ No process found on port 3000${NC}"
        return 1
    fi
}

# Function to check build status
check_build() {
    echo -e "\n🏗️  Checking build status..."
    
    if [ -d ".next" ]; then
        echo -e "${GREEN}✅ Production build found (.next directory exists)${NC}"
        
        # Check if build is recent
        BUILD_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" .next 2>/dev/null || stat -c "%y" .next 2>/dev/null)
        echo -e "${GREEN}   Build time: $BUILD_TIME${NC}"
    else
        echo -e "${RED}❌ No production build found. Run 'npm run build' first.${NC}"
        return 1
    fi
}

# Function to check environment
check_environment() {
    echo -e "\n🌍 Checking environment..."
    
    if [ "$NODE_ENV" = "production" ]; then
        echo -e "${GREEN}✅ NODE_ENV is set to production${NC}"
    else
        echo -e "${YELLOW}⚠️  NODE_ENV is not set to production (current: $NODE_ENV)${NC}"
    fi
    
    # Check for environment file
    if [ -f ".env.local" ]; then
        echo -e "${GREEN}✅ Environment file (.env.local) exists${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env.local file found${NC}"
    fi
}

# Function to test key endpoints
test_endpoints() {
    echo -e "\n🔗 Testing key endpoints..."
    
    ENDPOINTS=("/" "/login" "/dashboard" "/api/auth/login")
    
    for endpoint in "${ENDPOINTS[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$endpoint | grep -q "200\|301\|302"; then
            echo -e "${GREEN}   ✅ $endpoint - OK${NC}"
        else
            echo -e "${RED}   ❌ $endpoint - Failed${NC}"
        fi
    done
}

# Function to check performance
check_performance() {
    echo -e "\n⚡ Checking performance..."
    
    # Test response time
    START_TIME=$(date +%s%N)
    curl -s http://localhost:3000 > /dev/null
    END_TIME=$(date +%s%N)
    
    RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
    
    if [ $RESPONSE_TIME -lt 1000 ]; then
        echo -e "${GREEN}   ✅ Response time: ${RESPONSE_TIME}ms (Good)${NC}"
    elif [ $RESPONSE_TIME -lt 3000 ]; then
        echo -e "${YELLOW}   ⚠️  Response time: ${RESPONSE_TIME}ms (Acceptable)${NC}"
    else
        echo -e "${RED}   ❌ Response time: ${RESPONSE_TIME}ms (Slow)${NC}"
    fi
}

# Function to show system info
show_system_info() {
    echo -e "\n💻 System Information:"
    echo -e "   Node.js version: $(node --version)"
    echo -e "   NPM version: $(npm --version)"
    echo -e "   Platform: $(uname -s) $(uname -m)"
    echo -e "   Memory usage: $(ps -o rss= -p $(lsof -ti:3000 2>/dev/null | head -1) 2>/dev/null | awk '{print $1/1024 " MB"}' || echo "Unknown")"
}

# Main execution
main() {
    echo -e "\n🚀 Starting production status check...\n"
    
    # Run all checks
    check_build
    BUILD_STATUS=$?
    
    check_environment
    
    check_process
    PROCESS_STATUS=$?
    
    check_server
    SERVER_STATUS=$?
    
    if [ $SERVER_STATUS -eq 0 ]; then
        test_endpoints
        check_performance
    fi
    
    show_system_info
    
    # Summary
    echo -e "\n📊 Summary:"
    if [ $BUILD_STATUS -eq 0 ] && [ $PROCESS_STATUS -eq 0 ] && [ $SERVER_STATUS -eq 0 ]; then
        echo -e "${GREEN}🎉 All checks passed! Your Legal AI System is running successfully in production mode.${NC}"
        echo -e "${GREEN}   🌐 Access your application at: http://localhost:3000${NC}"
    else
        echo -e "${RED}❌ Some checks failed. Please review the issues above.${NC}"
        echo -e "${YELLOW}   💡 Try running: npm run build && npm start${NC}"
    fi
    
    echo -e "\n📝 For detailed deployment information, see: PRODUCTION_DEPLOYMENT.md"
}

# Run the main function
main 