#!/usr/bin/env node

const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login functionality...');
    
    // Create axios client similar to frontend
    const client = axios.create({
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor like frontend
    client.interceptors.response.use(
      (response) => {
        console.log('📡 Raw API Response:', JSON.stringify(response.data, null, 2));
        
        // Apply the same logic as frontend interceptor
        if (response.data && response.data.success && response.data.data) {
          console.log('✅ Extracting data from response.data.data');
          return {
            ...response,
            data: response.data.data,
          };
        }
        console.log('⚠️ Returning response as-is');
        return response;
      },
      (error) => {
        console.error('❌ API Error:', error.message);
        return Promise.reject(error);
      }
    );

    // Test login
    const response = await client.post('/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });

    console.log('🎉 Processed Response Data:', JSON.stringify(response.data, null, 2));
    console.log('✅ Login test successful!');
    
    // Test accessing user, token, refreshToken
    if (response.data.user && response.data.token && response.data.refreshToken) {
      console.log('✅ All required fields present');
      console.log('👤 User:', response.data.user.email);
      console.log('🔑 Token length:', response.data.token.length);
      console.log('🔄 RefreshToken length:', response.data.refreshToken.length);
    } else {
      console.error('❌ Missing required fields in response');
      console.error('Has user:', !!response.data.user);
      console.error('Has token:', !!response.data.token);
      console.error('Has refreshToken:', !!response.data.refreshToken);
    }
    
  } catch (error) {
    console.error('💥 Login test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testLogin();

