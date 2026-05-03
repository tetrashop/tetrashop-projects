#!/bin/bash
echo "🚀 راه‌اندازی سیستم برای مشتری..."
cd ~/tetrashop-projects/client_system
pkill -f "python.*simple_gateway" 2>/dev/null
sleep 2
lsof -ti:5000 2>/dev/null | xargs kill -9 2>/dev/null
python3 -c "import flask" 2>/dev/null || pip3 install flask > /dev/null 2>&1
python3 simple_gateway.py
