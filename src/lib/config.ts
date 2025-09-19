// Simple application configuration

export const config = {
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

// Environment configuration
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
