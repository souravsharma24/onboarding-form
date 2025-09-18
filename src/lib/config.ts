// Application configuration

export const config = {
  bridgeApi: {
    baseUrl: process.env.NEXT_PUBLIC_BRIDGE_API_URL || 'https://api.bridge.example.com',
    apiKey: process.env.NEXT_PUBLIC_BRIDGE_API_KEY || 'demo-api-key',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  localStorage: {
    prefix: 'innovo_',
    version: '1.0.0',
    onboardingDataTtl: 7 * 24 * 60 * 60 * 1000, // 7 days
    inviteCodeTtl: 24 * 60 * 60 * 1000 // 24 hours
  },
  debug: {
    enabled: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
  }
}

// Development mode configuration
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
