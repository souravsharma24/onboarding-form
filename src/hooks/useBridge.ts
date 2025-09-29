import { useState, useCallback } from 'react'
import BridgeService, { BridgeCustomer, CreateCustomerRequest } from '@/lib/bridge'

interface UseBridgeReturn {
  customer: BridgeCustomer | null
  loading: boolean
  error: string | null
  createCustomer: (data: CreateCustomerRequest) => Promise<BridgeCustomer>
  updateCustomer: (customerId: string, data: Partial<CreateCustomerRequest>) => Promise<BridgeCustomer>
  submitKYCDocuments: (customerId: string, documents: any) => Promise<{ success: boolean; message: string }>
  submitComplianceInfo: (customerId: string, complianceData: any) => Promise<{ success: boolean; message: string }>
  completeOnboarding: (customerId: string) => Promise<{ success: boolean; message: string }>
  getKYCStatus: (customerId: string) => Promise<{ status: string; details?: any }>
  clearError: () => void
}

export const useBridge = (): UseBridgeReturn => {
  const [customer, setCustomer] = useState<BridgeCustomer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const createCustomer = useCallback(async (data: CreateCustomerRequest): Promise<BridgeCustomer> => {
    setLoading(true)
    setError(null)
    
    try {
      const newCustomer = await BridgeService.createCustomer(data)
      setCustomer(newCustomer)
      return newCustomer
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCustomer = useCallback(async (customerId: string, data: Partial<CreateCustomerRequest>): Promise<BridgeCustomer> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedCustomer = await BridgeService.updateCustomer(customerId, data)
      setCustomer(updatedCustomer)
      return updatedCustomer
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const submitKYCDocuments = useCallback(async (customerId: string, documents: any): Promise<{ success: boolean; message: string }> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await BridgeService.submitKYCDocuments(customerId, documents)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit KYC documents'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const submitComplianceInfo = useCallback(async (customerId: string, complianceData: any): Promise<{ success: boolean; message: string }> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await BridgeService.submitComplianceInfo(customerId, complianceData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit compliance info'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const completeOnboarding = useCallback(async (customerId: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await BridgeService.completeOnboarding(customerId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getKYCStatus = useCallback(async (customerId: string): Promise<{ status: string; details?: any }> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await BridgeService.getKYCStatus(customerId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get KYC status'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    customer,
    loading,
    error,
    createCustomer,
    updateCustomer,
    submitKYCDocuments,
    submitComplianceInfo,
    completeOnboarding,
    getKYCStatus,
    clearError
  }
}

export default useBridge
