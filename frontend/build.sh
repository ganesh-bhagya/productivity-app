#!/bin/bash

# Production Build Script for Productivity App Frontend
# Usage: ./build.sh

set -e  # Exit on error

echo "🚀 Building Productivity App for Production..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  Warning: .env.production not found"
    echo "📝 Creating .env.production from example..."
    if [ -f .env.production.example ]; then
        cp .env.production.example .env.production
        echo "✅ Created .env.production - Please update VITE_API_URL"
    else
        echo "❌ Error: .env.production.example not found"
        exit 1
    fi
fi

# Check if API URL is set
if ! grep -q "VITE_API_URL=https" .env.production 2>/dev/null; then
    echo "⚠️  Warning: VITE_API_URL not set to HTTPS in .env.production"
    echo "   PWA requires HTTPS for service workers"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for PWA icons
echo "🖼️  Checking PWA icons..."
MISSING_ICONS=0

if [ ! -f "public/favicon.ico" ]; then
    echo "   ⚠️  Missing: public/favicon.ico"
    MISSING_ICONS=1
fi

if [ ! -f "public/apple-touch-icon.png" ]; then
    echo "   ⚠️  Missing: public/apple-touch-icon.png"
    MISSING_ICONS=1
fi

if [ ! -f "public/pwa-192x192.png" ]; then
    echo "   ⚠️  Missing: public/pwa-192x192.png"
    MISSING_ICONS=1
fi

if [ ! -f "public/pwa-512x512.png" ]; then
    echo "   ⚠️  Missing: public/pwa-512x512.png"
    MISSING_ICONS=1
fi

if [ $MISSING_ICONS -eq 1 ]; then
    echo "   ⚠️  Some PWA icons are missing. PWA may not work correctly."
    echo "   📖 See DEPLOYMENT.md for icon requirements"
fi

# Type check
echo "🔍 Type checking..."
npm run build -- --mode production 2>&1 | grep -E "(error|Error)" && exit 1 || true

# Build
echo "🏗️  Building application..."
npm run build

# Check build output
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Output directory: dist/"
    echo ""
    echo "📊 Build size:"
    du -sh dist/
    echo ""
    echo "🚀 Ready to deploy!"
    echo "   Deploy the 'dist' folder to your hosting service"
else
    echo "❌ Build failed - dist/ directory not found"
    exit 1
fi

