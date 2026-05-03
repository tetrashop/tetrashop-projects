#!/bin/bash

echo "🛑 توقف Tetrashop..."
pkill -f "python.*tetrashop" 2>/dev/null
pkill -f "python.*gateway" 2>/dev/null
sleep 2

lsof -ti:5000 2>/dev/null | xargs kill -9 2>/dev/null

echo "✅ Tetrashop متوقف شد"
echo "   پورت 5000 آزاد است"
