#!/bin/bash
API_BASE="http://localhost:3001"
TEST_API_KEY="ts_live_7xzb2m86ndt4f2t5d..."

echo "
📊 TetraSaaS Platform Monitor
=============================
$(date)
"

# بررسی سلامت سرور
echo "🔍 Server Health:"
curl -s "$API_BASE/health" | python3 -c "
import json, sys, datetime
data = json.load(sys.stdin)
print(f'   Status: {data.get(\"status\", \"N/A\")}')
uptime = data.get('uptime', 0)
hours = int(uptime // 3600)
minutes = int((uptime % 3600) // 60)
print(f'   Uptime: {hours}h {minutes}m')
print(f'   Timestamp: {data.get(\"timestamp\", \"N/A\")}')
"

# بررسی سرویس‌ها
echo -e "\n📦 Available Services:"
curl -s "$API_BASE/api/services" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data.get('success'):
    print(f'   Total: {data.get(\"count\", 0)} services')
    categories = data.get(\"categories\", [])
    print(f'   Categories: {len(categories)}')
else:
    print('   ❌ Could not fetch services')
"

# بررسی وضعیت Tenant
echo -e "\n👤 Tenant Status:"
curl -s "$API_BASE/api/auth/status" \
  -H "X-API-Key: $TEST_API_KEY" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data.get('success'):
    print(f'   Tenant ID: {data.get(\"tenantId\", \"N/A\")}')
    print(f'   API Key: {data.get(\"apiKeyName\", \"N/A\")}')
    print(f'   Credits: {data.get(\"remainingCredits\", 0)}')
    print(f'   Total Spent: {data.get(\"totalSpent\", 0)}')
    usage = data.get('usage', {}).get('today', {})
    print(f'   Today\'s Usage: {usage.get(\"requests\", 0)} requests')
else:
    print('   ❌ Could not fetch tenant status')
"

# بررسی دیتابیس
echo -e "\n🗄️ Database Status:"
curl -s "$API_BASE/api/services/categories" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data.get('success'):
    print(f'   Categories in DB: {data.get(\"count\", 0)}')
else:
    print('   ❌ Database connection issue')
"

echo -e "\n✅ TetraSaaS Platform Monitoring Complete"
