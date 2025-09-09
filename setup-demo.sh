#!/bin/bash

echo "🚀 Setting up CI/CD Pipeline Health Dashboard Demo"
echo "================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first!"
    echo "1. Open Docker Desktop application"
    echo "2. Wait for it to fully start"
    echo "3. Run this script again"
    exit 1
fi

echo "✅ Docker is running"

# Create backend .env file
echo "📝 Creating backend configuration..."
cat > backend/.env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration (Docker containers)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=cicd_dashboard
DB_USER=postgres
DB_PASSWORD=postgres123

# Redis Configuration (Docker containers)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=demo-jwt-secret-key-for-testing-only
JWT_REFRESH_SECRET=demo-refresh-secret-key-for-testing-only
JWT_EXPIRE_TIME=1h
JWT_REFRESH_EXPIRE_TIME=7d

# Email Configuration for Demo
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=cicd.dashboard.demo@gmail.com
EMAIL_PASSWORD=demo-app-password
EMAIL_FROM=CI/CD Dashboard Demo <cicd.dashboard.demo@gmail.com>
DEMO_EMAIL_RECIPIENT=harsh.mathur@talentica.com

# GitHub Integration (Demo - these would be real in production)
GITHUB_APP_ID=demo-app-id
GITHUB_PRIVATE_KEY=demo-private-key
GITHUB_WEBHOOK_SECRET=demo-webhook-secret

# Slack Integration (Demo)
SLACK_BOT_TOKEN=xoxb-demo-slack-bot-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/demo/webhook/url
SLACK_DEFAULT_CHANNEL=#dev-alerts

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF

# Create frontend .env file
echo "📝 Creating frontend configuration..."
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_TITLE=CI/CD Pipeline Health Dashboard
EOF

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Pull latest images
echo "📦 Pulling required Docker images..."
docker pull timescale/timescaledb:latest-pg15
docker pull redis:7-alpine
docker pull node:18-alpine
docker pull nginx:alpine

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
echo "Backend: $(curl -s http://localhost:3001/health | jq -r '.status' 2>/dev/null || echo 'Starting...')"
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo 'Starting...')"

echo ""
echo "🎉 Demo setup complete!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/health"
echo ""
echo "🔑 Login Credentials:"
echo "   Email: admin@example.com"
echo "   Password: password123"
echo ""
echo "📧 Email notifications configured for: harsh.mathur@talentica.com"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the demo:"
echo "   docker-compose down"
