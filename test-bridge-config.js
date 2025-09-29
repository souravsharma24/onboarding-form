// Test Bridge API Configuration
// Copy this to .env.local for testing

const testConfig = {
  // Dummy API key for testing
  NEXT_PUBLIC_BRIDGE_API_KEY: 'test_bridge_api_key_12345',
  BRIDGE_API_KEY: 'test_bridge_api_key_12345',
  NODE_ENV: 'development'
}

// Instructions:
// 1. Create a .env.local file in your project root
// 2. Copy the values above into .env.local
// 3. Restart your development server
// 4. Test the integration

console.log('Test configuration ready. Copy these values to .env.local:')
console.log(JSON.stringify(testConfig, null, 2))

module.exports = testConfig
