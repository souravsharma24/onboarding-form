#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🧪 Setting up Bridge API Test Environment...\n')

// Test environment variables
const testEnvContent = `# Bridge API Configuration - TEST MODE
NEXT_PUBLIC_BRIDGE_API_KEY=test_bridge_api_key_12345
BRIDGE_API_KEY=test_bridge_api_key_12345
NODE_ENV=development
`

const envPath = path.join(__dirname, '.env.local')

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Backing up to .env.local.backup')
    fs.copyFileSync(envPath, envPath + '.backup')
  }

  // Create .env.local with test configuration
  fs.writeFileSync(envPath, testEnvContent)
  
  console.log('✅ Created .env.local with test configuration')
  console.log('🧪 Bridge API will run in TEST MODE')
  console.log('📝 Test API Key: test_bridge_api_key_12345')
  console.log('\n🚀 Next steps:')
  console.log('1. Restart your development server: npm run dev')
  console.log('2. Open http://localhost:3001/onboarding')
  console.log('3. Complete the form and submit')
  console.log('4. Check browser console for test mode logs')
  console.log('\n💡 To use real Bridge API:')
  console.log('1. Get API key from https://dashboard.bridge.xyz')
  console.log('2. Replace test_bridge_api_key_12345 with your real key')
  console.log('3. Restart development server')
  
} catch (error) {
  console.error('❌ Error setting up test environment:', error.message)
  console.log('\n📝 Manual setup:')
  console.log('1. Create .env.local file in project root')
  console.log('2. Add the following content:')
  console.log(testEnvContent)
}
