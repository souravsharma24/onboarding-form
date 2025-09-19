// Simple Bridge API integration for user onboarding data submission

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

// Simple Bridge API service
class BridgeApiService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BRIDGE_API_URL || 'https://api.bridge.example.com'
    this.apiKey = process.env.NEXT_PUBLIC_BRIDGE_API_KEY || 'demo-key'
  }

  /**
   * Submit user onboarding data to Bridge API
   */
  async submitUserData(userData: BridgeUserData): Promise<BridgeApiResponse> {
    // For now, simulate API call with local storage
    console.log('Submitting user data to Bridge API:', userData)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful response
    return {
      success: true,
      userId: `user_${Date.now()}`,
      message: 'User data submitted successfully',
      errors: []
    }
  }

  /**
   * Validate invite code with Bridge API
   */
  async validateInviteCode(code: string): Promise<{ valid: boolean; message: string }> {
    // For now, simulate validation
    console.log('Validating invite code:', code)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simple validation logic
    const validCodes = ['WELCOME2024', 'INNOVO123', 'BRIDGE456']
    const isValid = validCodes.includes(code.toUpperCase())
    
    return {
      valid: isValid,
      message: isValid ? 'Invite code is valid' : 'Invalid invite code'
    }
  }
}

// Export singleton instance
export const bridgeApi = new BridgeApiService()

// Utility function for data transformation
export const transformFormDataToBridgeFormat = (formData: any): BridgeUserData => {
  return {
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    email: formData.email || '',
    phone: formData.phone || '',
    dateOfBirth: formData.dateOfBirth || '',
    companyName: formData.companyName || '',
    jobTitle: formData.jobTitle || '',
    industry: formData.industry || '',
    companySize: formData.companySize || '',
    address: formData.address || '',
    businessType: formData.businessType || '',
    annualRevenue: formData.annualRevenue || '',
    taxId: formData.taxId || '',
    website: formData.website || undefined,
    referralSource: formData.referralSource || '',
    interests: formData.interests || [],
    additionalNotes: formData.additionalNotes || undefined,
    inviteCode: formData.inviteCode,
    submissionTimestamp: new Date().toISOString(),
    source: 'innovo-onboarding-form'
  }
}
