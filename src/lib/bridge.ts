import axios from 'axios'

// Bridge API configuration
const BRIDGE_API_BASE_URL = 'https://api.bridge.xyz'
const BRIDGE_SANDBOX_BASE_URL = 'https://api.sandbox.bridge.xyz'

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production'
const BRIDGE_API_URL = isProduction ? BRIDGE_API_BASE_URL : BRIDGE_SANDBOX_BASE_URL

// Get API key from environment variables
const BRIDGE_API_KEY = process.env.NEXT_PUBLIC_BRIDGE_API_KEY || process.env.BRIDGE_API_KEY

// Check if we're using a test/dummy API key
const isTestMode = BRIDGE_API_KEY && BRIDGE_API_KEY.startsWith('test_')

if (!BRIDGE_API_KEY) {
  console.warn('Bridge API key not found. Please set NEXT_PUBLIC_BRIDGE_API_KEY or BRIDGE_API_KEY environment variable.')
} else if (isTestMode) {
  console.log('🧪 Bridge API running in TEST MODE with dummy key:', BRIDGE_API_KEY)
}

// Create axios instance with Bridge API configuration
const bridgeAPI = axios.create({
  baseURL: BRIDGE_API_URL,
  headers: {
    'Authorization': `Bearer ${BRIDGE_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Types for Bridge API
export interface BridgeCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  businessInfo?: {
    legalName: string
    dbaName?: string
    ein: string
    entityType: string
    industry: string
    website?: string
    description?: string
    address: {
      street: string
      city: string
      state: string
      postalCode: string
    }
  }
  kycStatus: 'pending' | 'approved' | 'rejected' | 'requires_action'
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  businessInfo?: {
    legalName: string
    dbaName?: string
    ein: string
    entityType: string
    industry: string
    website?: string
    description?: string
    address: {
      street: string
      city: string
      state: string
      postalCode: string
    }
  }
}

export interface BridgeAPIResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Bridge API Service Class
export class BridgeService {
  /**
   * Create a new customer in Bridge
   */
  static async createCustomer(customerData: CreateCustomerRequest): Promise<BridgeCustomer> {
    try {
      // In test mode, return a mock customer
      if (isTestMode) {
        console.log('🧪 TEST MODE: Creating mock customer with data:', customerData)
        const mockCustomer: BridgeCustomer = {
          id: 'test_customer_' + Date.now(),
          email: customerData.email,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          dateOfBirth: customerData.dateOfBirth,
          address: customerData.address,
          businessInfo: customerData.businessInfo,
          kycStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return mockCustomer
      }

      const response = await bridgeAPI.post<BridgeAPIResponse<BridgeCustomer>>('/customers', customerData)
      return response.data.data
    } catch (error) {
      console.error('Error creating customer in Bridge:', error)
      throw new Error('Failed to create customer in Bridge')
    }
  }

  /**
   * Get customer by ID
   */
  static async getCustomer(customerId: string): Promise<BridgeCustomer> {
    try {
      const response = await bridgeAPI.get<BridgeAPIResponse<BridgeCustomer>>(`/customers/${customerId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching customer from Bridge:', error)
      throw new Error('Failed to fetch customer from Bridge')
    }
  }

  /**
   * Update customer information
   */
  static async updateCustomer(customerId: string, customerData: Partial<CreateCustomerRequest>): Promise<BridgeCustomer> {
    try {
      const response = await bridgeAPI.put<BridgeAPIResponse<BridgeCustomer>>(`/customers/${customerId}`, customerData)
      return response.data.data
    } catch (error) {
      console.error('Error updating customer in Bridge:', error)
      throw new Error('Failed to update customer in Bridge')
    }
  }

  /**
   * Submit KYC documents for verification
   */
  static async submitKYCDocuments(customerId: string, documents: {
    proofOfAddress?: File
    bankAccountWiringInstructions?: File
    articlesOfIncorporation?: File
    proofOfOwnership?: File
  }): Promise<{ success: boolean; message: string }> {
    try {
      // In test mode, return a mock success response
      if (isTestMode) {
        console.log('🧪 TEST MODE: Submitting mock KYC documents for customer:', customerId)
        console.log('🧪 Documents:', Object.keys(documents).filter(key => documents[key as keyof typeof documents]))
        return {
          success: true,
          message: 'KYC documents submitted successfully (TEST MODE)'
        }
      }

      const formData = new FormData()
      
      if (documents.proofOfAddress) {
        formData.append('proofOfAddress', documents.proofOfAddress)
      }
      if (documents.bankAccountWiringInstructions) {
        formData.append('bankAccountWiringInstructions', documents.bankAccountWiringInstructions)
      }
      if (documents.articlesOfIncorporation) {
        formData.append('articlesOfIncorporation', documents.articlesOfIncorporation)
      }
      if (documents.proofOfOwnership) {
        formData.append('proofOfOwnership', documents.proofOfOwnership)
      }

      const response = await bridgeAPI.post<BridgeAPIResponse<{ success: boolean; message: string }>>(
        `/customers/${customerId}/kyc/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      return response.data.data
    } catch (error) {
      console.error('Error submitting KYC documents to Bridge:', error)
      throw new Error('Failed to submit KYC documents to Bridge')
    }
  }

  /**
   * Check KYC status
   */
  static async getKYCStatus(customerId: string): Promise<{ status: string; details?: any }> {
    try {
      const response = await bridgeAPI.get<BridgeAPIResponse<{ status: string; details?: any }>>(`/customers/${customerId}/kyc/status`)
      return response.data.data
    } catch (error) {
      console.error('Error checking KYC status from Bridge:', error)
      throw new Error('Failed to check KYC status from Bridge')
    }
  }

  /**
   * Submit compliance information
   */
  static async submitComplianceInfo(customerId: string, complianceData: {
    businessActivities: string[]
    expectedMonthlyTransactionAmount: string
    customerAccountUsage: string
    amlKybProcedures: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      // In test mode, return a mock success response
      if (isTestMode) {
        console.log('🧪 TEST MODE: Submitting mock compliance info for customer:', customerId)
        console.log('🧪 Compliance data:', complianceData)
        return {
          success: true,
          message: 'Compliance information submitted successfully (TEST MODE)'
        }
      }

      const response = await bridgeAPI.post<BridgeAPIResponse<{ success: boolean; message: string }>>(
        `/customers/${customerId}/compliance`,
        complianceData
      )
      
      return response.data.data
    } catch (error) {
      console.error('Error submitting compliance info to Bridge:', error)
      throw new Error('Failed to submit compliance info to Bridge')
    }
  }

  /**
   * Complete onboarding process
   */
  static async completeOnboarding(customerId: string): Promise<{ success: boolean; message: string }> {
    try {
      // In test mode, return a mock success response
      if (isTestMode) {
        console.log('🧪 TEST MODE: Completing mock onboarding for customer:', customerId)
        return {
          success: true,
          message: 'Onboarding completed successfully (TEST MODE)'
        }
      }

      const response = await bridgeAPI.post<BridgeAPIResponse<{ success: boolean; message: string }>>(
        `/customers/${customerId}/onboarding/complete`
      )
      
      return response.data.data
    } catch (error) {
      console.error('Error completing onboarding in Bridge:', error)
      throw new Error('Failed to complete onboarding in Bridge')
    }
  }
}

export default BridgeService
