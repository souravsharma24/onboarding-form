'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { bridgeApi } from '@/lib/bridgeApi'
import { saveInviteCode, loadInviteCode } from '@/lib/localStorage'

interface InviteCodeFormProps {
  onInviteCodeSubmit: (code: string) => void
  onSkip: () => void
}

export default function InviteCodeForm({ onInviteCodeSubmit, onSkip }: InviteCodeFormProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  // Load saved invite code from localStorage
  useEffect(() => {
    const savedCode = loadInviteCode()
    if (savedCode) {
      setInviteCode(savedCode)
      setIsValid(true)
    }
  }, [])

  const validateInviteCode = async (code: string) => {
    setIsValidating(true)
    setError('')
    
    try {
      // Try Bridge API validation first
      const response = await bridgeApi.validateInviteCode(code)
      
      setIsValidating(false)
      
      if (response.valid) {
        setIsValid(true)
        saveInviteCode(code)
        return true
      } else {
        setError(response.message || 'Invalid invite code. Please check and try again.')
        setIsValid(false)
        return false
      }
    } catch (error) {
      // Fallback to mock validation if API fails
      console.warn('Bridge API validation failed, using fallback:', error)
      
      const validCodes = ['INNOVO2024', 'WELCOME123', 'DEMO2024', 'TESTCODE']
      const isValidCode = validCodes.includes(code.toUpperCase())
      
      setIsValidating(false)
      
      if (isValidCode) {
        setIsValid(true)
        saveInviteCode(code)
        return true
      } else {
        setError('Invalid invite code. Please check and try again.')
        setIsValid(false)
        return false
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code')
      return
    }

    const isValidCode = await validateInviteCode(inviteCode)
    if (isValidCode) {
      onInviteCodeSubmit(inviteCode)
    }
  }

  const handleSkip = () => {
    // Note: We don't remove the invite code when skipping, as it might be valid
    onSkip()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">i</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Innovo</h1>
          <h2 className="text-xl font-semibold text-gray-700">New Customer Form</h2>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">Welcome! Please enter your invite code below:</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <div className="relative">
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value)
                  setError('')
                  setIsValid(false)
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  error ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-300'
                }`}
                placeholder="Enter your invite code"
                disabled={isValidating}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                </div>
              )}
              {isValid && !isValidating && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 mt-2 text-red-600"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isValidating || !inviteCode.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Validating...</span>
              </>
            ) : (
              <>
                <span>SUBMIT</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Skip Option */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
            >
              Don't have an invite code? Continue anyway
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@innovomarkets.com" className="text-primary-600 hover:underline">
              support@innovomarkets.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

