#!/bin/bash
# 🚀 Quick Start Script for Hotel Booking App

echo "🏨 Hotel Booking - Quick Start"
echo "========================================"
echo ""
echo "Choose an option:"
echo ""
echo "1) Start Backend (Local Development)"
echo "2) Start Frontend (Local Development)"
echo "3) Start Both (requires 2 terminals)"
echo "4) Build for Production"
echo "5) Test Backend Health"
echo "6) Show Environment Variables"
echo "7) Check Backend Logs"
echo ""
read -p "Enter your choice (1-7): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting Backend..."
    echo "Backend will run on: http://localhost:5000"
    echo "Frontend URL: http://localhost:5173"
    echo ""
    cd Server
    npm run server
    ;;
  2)
    echo ""
    echo "🚀 Starting Frontend..."
    echo "Frontend will run on: http://localhost:5173"
    echo "Backend URL: http://localhost:5000"
    echo ""
    cd Client
    npm run dev
    ;;
  3)
    echo ""
    echo "🚀 Starting Both..."
    echo ""
    echo "Backend will run on: http://localhost:5000"
    echo "Frontend will run on: http://localhost:5173"
    echo ""
    echo "Starting Backend in background..."
    cd Server
    npm run server &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    echo ""
    echo "Give backend 3 seconds to start..."
    sleep 3
    echo ""
    echo "Starting Frontend..."
    cd ../Client
    npm run dev
    ;;
  4)
    echo ""
    echo "🏗️ Building for Production..."
    echo ""
    cd Client
    npm run build
    echo ""
    echo "✅ Frontend built successfully!"
    echo "Build output in: Client/dist"
    ;;
  5)
    echo ""
    echo "🏥 Testing Backend Health..."
    echo ""
    echo "Testing Local Backend (http://localhost:5000):"
    curl -s http://localhost:5000/api/health | jq '.' 2>/dev/null || echo "Backend not running locally"
    echo ""
    echo "Testing Production Backend (https://hotel-booking-backend-...):"
    curl -s https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/health | jq '.' 2>/dev/null || echo "Cannot reach production backend"
    ;;
  6)
    echo ""
    echo "📋 Environment Variables"
    echo ""
    echo "=== Local Development (.env.local) ==="
    echo ""
    echo "Backend:"
    if [ -f Server/.env.local ]; then
      grep -E "(FRONTEND_URL|NODE_ENV|MONGODB_URL)" Server/.env.local | head -5
    else
      echo "  .env.local not found"
    fi
    echo ""
    echo "Frontend:"
    if [ -f Client/.env.local ]; then
      grep -E "VITE_BACKEND_URL" Client/.env.local
    else
      echo "  .env.local not found"
    fi
    echo ""
    echo "=== Production (.env) ==="
    echo ""
    echo "Backend:"
    if [ -f Server/.env ]; then
      grep -E "(FRONTEND_URL|NODE_ENV|MONGODB_URL)" Server/.env | head -3
    else
      echo "  .env not found"
    fi
    echo ""
    echo "Frontend:"
    if [ -f Client/.env ]; then
      grep -E "VITE_BACKEND_URL" Client/.env
    else
      echo "  .env not found"
    fi
    ;;
  7)
    echo ""
    echo "📊 Backend Logs"
    echo ""
    echo "Production Logs:"
    echo "vercel logs --follow hotel-booking-backend"
    echo ""
    echo "Or check: https://vercel.com/dashboard"
    ;;
  *)
    echo "Invalid option. Please enter 1-7."
    ;;
esac

echo ""
echo "Done! 👋"
