#!/bin/bash

API_PORT=3001
API_BASE="http://localhost:$API_PORT"

case "$1" in
    start)
        echo "🚀 Starting TetraSaaS API Server..."
        cd /data/data/com.termux/files/home/tetra-saas-real/apps/api
        PORT=$API_PORT node src/server.js &
        echo $! > server.pid
        echo "✅ Server started on port $API_PORT (PID: $(cat server.pid))"
        sleep 2
        curl -s "$API_BASE/health" > /dev/null && echo "🌐 Server is responding!" || echo "⚠️ Server may not be ready yet"
        ;;
    stop)
        if [ -f server.pid ]; then
            echo "🛑 Stopping TetraSaaS API Server..."
            kill $(cat server.pid) 2>/dev/null
            rm server.pid
            echo "✅ Server stopped"
        else
            echo "⚠️ No server PID found. Trying to kill by port..."
            pkill -f "node.*$API_PORT" 2>/dev/null && echo "✅ Killed processes on port $API_PORT" || echo "✅ No processes found on port $API_PORT"
        fi
        ;;
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
    status)
        if curl -s "$API_BASE/health" > /dev/null 2>&1; then
            echo "✅ TetraSaaS API Server is RUNNING on port $API_PORT"
            curl -s "$API_BASE/health" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f'   Status: {data.get(\"status\", \"N/A\")}')
print(f'   Uptime: {data.get(\"uptime\", 0):.0f} seconds')
"
        else
            echo "❌ TetraSaaS API Server is NOT RUNNING on port $API_PORT"
            echo "   Try: ./manage-server.sh start"
        fi
        ;;
    test)
        echo "🧪 Running API tests..."
        export TEST_API_KEY="ts_live_7xzb2m86ndt4f2t5d..."
        export API_BASE="http://localhost:$API_PORT"
        
        echo "1. Health check..."
        curl -s "$API_BASE/health" | grep -q "running" && echo "   ✅ Health: OK" || echo "   ❌ Health: FAILED"
        
        echo "2. Services list..."
        curl -s "$API_BASE/api/services" | grep -q "success" && echo "   ✅ Services: OK" || echo "   ❌ Services: FAILED"
        
        echo "3. API Key validation..."
        curl -s -X POST "$API_BASE/api/auth/validate" -H "X-API-Key: $TEST_API_KEY" | grep -q "success" && echo "   ✅ Auth: OK" || echo "   ❌ Auth: FAILED"
        
        echo "🎉 Basic tests completed"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|test}"
        echo "   start   - Start the API server"
        echo "   stop    - Stop the API server"
        echo "   restart - Restart the API server"
        echo "   status  - Check server status"
        echo "   test    - Run basic API tests"
        exit 1
        ;;
esac
