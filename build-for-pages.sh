#!/bin/bash

# Build script for GitHub Pages deployment
echo "Building frontend for GitHub Pages..."

cd frontend

# Build with production mode (Vite automatically sets mode=production)
npm run build

echo ""
echo "Build complete! Output is in frontend/dist/"
echo "Files generated:"
ls -la dist/

# Verify index.html has correct base path
echo ""
echo "Verifying GitHub Pages base path is configured correctly:"
echo "Looking for '/ai-coding-as-a-blackbox/' in index.html:"
grep -n "ai-coding-as-a-blackbox" dist/index.html && echo "✓ Base path configured correctly!" || echo "✗ Base path not found"