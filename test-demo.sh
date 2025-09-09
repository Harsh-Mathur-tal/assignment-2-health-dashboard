#!/bin/bash

echo "🧪 CI/CD Dashboard Demo Test Script"
echo "===================================="

# Check if services are running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ Backend service is not running!"
    echo "Please run: ./setup-demo.sh first"
    exit 1
fi

if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Frontend service is not running!"
    echo "Please run: ./setup-demo.sh first"
    exit 1
fi

echo "✅ Services are running"

# Login to get authentication token
echo "🔐 Logging in to get authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Failed to login. Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Successfully logged in"

# Test email configuration
echo "📧 Testing email configuration..."
EMAIL_TEST=$(curl -s -X GET http://localhost:3001/api/demo/test-email \
  -H "Authorization: Bearer $TOKEN")

echo "Email Config: $EMAIL_TEST"

# Send test alert email
echo "📤 Sending test alert email to harsh.mathur@talentica.com..."
ALERT_EMAIL=$(curl -s -X POST http://localhost:3001/api/demo/alert-email \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Alert Email Result: $ALERT_EMAIL"

# Simulate a failed pipeline run
echo "🚨 Simulating a failed pipeline run..."
PIPELINE_RUN=$(curl -s -X POST http://localhost:3001/api/demo/pipeline-run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "failed",
    "pipelineId": "demo-pipeline-1"
  }')

echo "Pipeline Run Result: $PIPELINE_RUN"

# Simulate a successful pipeline run
echo "✅ Simulating a successful pipeline run..."
SUCCESS_RUN=$(curl -s -X POST http://localhost:3001/api/demo/pipeline-run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "pipelineId": "demo-pipeline-2"
  }')

echo "Success Run Result: $SUCCESS_RUN"

# Create sample data
echo "📊 Creating sample demo data..."
SAMPLE_DATA=$(curl -s -X POST http://localhost:3001/api/demo/sample-data \
  -H "Authorization: Bearer $TOKEN")

echo "Sample Data Result: $SAMPLE_DATA"

# Get demo status
echo "📋 Getting demo status..."
DEMO_STATUS=$(curl -s -X GET http://localhost:3001/api/demo/status \
  -H "Authorization: Bearer $TOKEN")

echo "Demo Status: $DEMO_STATUS"

echo ""
echo "🎉 Demo tests completed!"
echo ""
echo "📧 Check the email logs in the backend container:"
echo "   docker-compose logs backend | grep -i email"
echo ""
echo "🌐 Open the dashboard to see the demo data:"
echo "   http://localhost:3000"
echo ""
echo "🔍 Check backend logs for detailed output:"
echo "   docker-compose logs -f backend"

