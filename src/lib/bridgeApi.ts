// Bridge API integration for user onboarding data submission

import { config } from './config'

export interface BridgeApiConfig {
  baseUrl: string
  apiKey: string
  timeout?: number
}

export interface BridgeUserData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  
  // Company Information
  companyName: string
  jobTitle: string
  industry: string
  companySize: string
  address: string
  
  // Business Information
  businessType: string
  annualRevenue: string
  taxId: string
  website?: string
  
  // Additional Information
  referralSource: string
  interests: string[]
  additionalNotes?: string
  
  // Metadata
  inviteCode?: string
  submissionTimestamp: string
  source: string
}

export interface BridgeApiResponse {
  success: boolean
  userId?: string
  message: string
  errors?: string[]
}

export interface BridgeApiError {
  message: string
  status?: number
  code?: string
}

class BridgeApiService {
  private config: BridgeApiConfig
  private retryAttempts = 3
  private retryDelay = 1000 // 1 second

  constructor(config: BridgeApiConfig) {
    this.config = {
      timeout: 30000, // 30 seconds default
      ...config
    }
  }

  /**
   * Submit user onboarding data to Bridge API
   */
  async submitUserData(userData: BridgeUserData): Promise<BridgeApiResponse> {
    const url = `${this.config.baseUrl}/api/v1/users/onboard`
    
    const payload = {
      ...userData,
      source: 'innovo-onboarding-form',
      submissionTimestamp: new Date().toISOString()
    }

    return this.makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Version': '1.0'
      },
      body: JSON.stringify(payload)
    })
  }

  /**
   * Validate invite code with Bridge API
   */
  async validateInviteCode(code: string): Promise<{ valid: boolean; message: string }> {
    const url = `${this.config.baseUrl}/api/v1/invites/validate`
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({ code })
      })

      return {
        valid: response.success,
        message: response.message
      }
    } catch (error) {
      console.error('Error validating invite code:', error)
      return {
        valid: false,
        message: 'Unable to validate invite code. Please try again.'
      }
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest(url: string, options: RequestInit): Promise<BridgeApiResponse> {
    let lastError: BridgeApiError | null = null

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new BridgeApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.code
          )
        }

        const data = await response.json()
        return data

      } catch (error) {
        lastError = error as BridgeApiError
        
        if (attempt < this.retryAttempts) {
          console.warn(`API request failed (attempt ${attempt}/${this.retryAttempts}), retrying...`, error)
          await this.delay(this.retryDelay * attempt) // Exponential backoff
        }
      }
    }

    throw lastError || new BridgeApiError('Unknown error occurred')
  }

  /**
   * Delay execution for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const bridgeApi = new BridgeApiService(config.bridgeApi)

// Utility functions for data transformation
export const transformFormDataToBridgeFormat = (formData: any): BridgeUserData => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    dateOfBirth: formData.dateOfBirth,
    companyName: formData.companyName,
    jobTitle: formData.jobTitle,
    industry: formData.industry,
    companySize: formData.companySize,
    address: formData.address,
    businessType: formData.businessType,
    annualRevenue: formData.annualRevenue,
    taxId: formData.taxId,
    website: formData.website || undefined,
    referralSource: formData.referralSource,
    interests: formData.interests,
    additionalNotes: formData.additionalNotes || undefined,
    inviteCode: formData.inviteCode,
    submissionTimestamp: new Date().toISOString(),
    source: 'innovo-onboarding-form'
  }
}

// Error class for Bridge API errors
export class BridgeApiError extends Error {
  public status?: number
  public code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'BridgeApiError'
    this.status = status
    this.code = code
  }
}
