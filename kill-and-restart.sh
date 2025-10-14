#!/bin/bash

echo "🔴 Killing all Node/Electron processes..."
killall -9 node electron npm 2>/dev/null

echo "⏳ Waiting for processes to die..."
sleep 5

echo "🔍 Checking for remaining processes..."
REMAINING=$(ps aux | grep -E "(electron|webpack|node.*start)" | grep -v grep | wc -l)
echo "Found $REMAINING remaining processes"

if [ "$REMAINING" -gt 0 ]; then
    echo "⚠️  Warning: Some processes still running. Trying harder..."
    ps aux | grep -E "(electron|webpack|node.*start)" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
    sleep 3
fi

echo "🧹 Cleaning build caches..."
rm -rf .webpack node_modules/.cache

echo "🚀 Starting VibeMD..."
npm start
