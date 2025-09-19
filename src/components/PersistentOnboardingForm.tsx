'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  User, 
  Building, 
  CreditCard, 
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { bridgeApi, transformFormDataToBridgeFormat } from '@/lib/bridgeApi'
import { saveOnboardingData, loadOnboardingData, saveInviteCode, loadInviteCode, clearOnboardingData } from '@/lib/localStorage'

interface FormData {
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
  website: string
  
  // Additional Information
  referralSource: string
  interests: string[]
  additionalNotes: string
  
  // Form metadata
  inviteCode?: string
  completedSteps: number[]
  lastSaved: string
}

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    icon: User,
    fields: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth']
  },
  {
    id: 2,
    title: 'Company Information',
    icon: Building,
    fields: ['companyName', 'jobTitle', 'industry', 'companySize', 'address']
  },
  {
    id: 3,
    title: 'Business Information',
    icon: CreditCard,
    fields: ['businessType', 'annualRevenue', 'taxId', 'website']
  },
  {
    id: 4,
    title: 'Additional Information',
    icon: FileText,
    fields: ['referralSource', 'interests', 'additionalNotes']
  }
]

interface PersistentOnboardingFormProps {
  inviteCode?: string
  onComplete: (data: FormData) => void
  onBack: () => void
}

export default function PersistentOnboardingForm({ inviteCode, onComplete, onBack }: PersistentOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    companyName: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    address: '',
    businessType: '',
    annualRevenue: '',
    taxId: '',
    website: '',
    referralSource: '',
    interests: [],
    additionalNotes: '',
    inviteCode: inviteCode || '',
    completedSteps: [],
    lastSaved: new Date().toISOString()
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = loadOnboardingData()
    if (savedData) {
      try {
        setFormData(prev => ({
          ...prev,
          ...savedData,
          inviteCode: inviteCode || savedData.inviteCode || ''
        }))
        
        // Find the last completed step
        const lastCompletedStep = Math.max(...(savedData.completedSteps || []), 0)
        setCurrentStep(lastCompletedStep + 1)
        
        setLastSaved(savedData.lastSaved)
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [inviteCode])

  // Auto-save data to localStorage
  const saveToLocalStorage = async (data: FormData) => {
    setIsSaving(true)
    try {
      const dataToSave = {
        ...data,
        lastSaved: new Date().toISOString()
      }
      const success = saveOnboardingData(dataToSave)
      if (success) {
        setLastSaved(dataToSave.lastSaved)
      }
    } catch (error) {
      console.error('Error saving data:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Save data whenever form data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage(formData)
    }, 1000) // Debounce saves

    return () => clearTimeout(timeoutId)
  }, [formData])

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const currentStepData = steps[step - 1]
    const newErrors: Record<string, string> = {}

    currentStepData.fields.forEach(field => {
      const value = formData[field as keyof FormData]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = 'This field is required'
      }
      
      if (field === 'email' && value && !/\S+@\S+\.\S+/.test(value as string)) {
        newErrors[field] = 'Please enter a valid email address'
      }
      
      if (field === 'phone' && value && !/^\+?[\d\s\-\(\)]+$/.test(value as string)) {
        newErrors[field] = 'Please enter a valid phone number'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Add current step to completed steps if not already present
      const completedSteps = formData.completedSteps.includes(currentStep) 
        ? formData.completedSteps 
        : [...formData.completedSteps, currentStep]
      
      setFormData(prev => ({ ...prev, completedSteps }))
      
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step <= currentStep || formData.completedSteps.includes(step - 1)) {
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      // Add current step to completed steps if not already present
      const completedSteps = formData.completedSteps.includes(currentStep) 
        ? formData.completedSteps 
        : [...formData.completedSteps, currentStep]
      
      const finalData = {
        ...formData,
        completedSteps,
        lastSaved: new Date().toISOString()
      }
      
      // Save final data locally first
      saveOnboardingData(finalData)
      
      // Transform data for Bridge API
      const bridgeData = transformFormDataToBridgeFormat(finalData)
      
      // Submit to Bridge API
      const response = await bridgeApi.submitUserData(bridgeData)
      
      if (response.success) {
        setSubmitSuccess(true)
        
        // Clear saved data after successful submission
        setTimeout(() => {
          clearOnboardingData()
          onComplete(finalData)
        }, 2000)
      } else {
        throw new Error(response.message || 'Failed to submit data to Bridge API')
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('Failed to submit form. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProgressPercentage = () => {
    return (currentStep / steps.length) * 100
  }

  const formatLastSaved = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input pl-10 ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input pl-10 ${errors.phone ? 'form-input-error' : ''}`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`form-input pl-10 ${errors.dateOfBirth ? 'form-input-error' : ''}`}
                />
              </div>
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`form-input ${errors.companyName ? 'form-input-error' : ''}`}
                placeholder="Enter your company name"
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className={`form-input ${errors.jobTitle ? 'form-input-error' : ''}`}
                  placeholder="Enter your job title"
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={`form-input ${errors.industry ? 'form-input-error' : ''}`}
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="energy">Energy</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size *
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                className={`form-input ${errors.companySize ? 'form-input-error' : ''}`}
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
              {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`form-input pl-10 ${errors.address ? 'form-input-error' : ''}`}
                  placeholder="Enter your company address"
                />
              </div>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className={`form-input ${errors.businessType ? 'form-input-error' : ''}`}
              >
                <option value="">Select business type</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="non-profit">Non-Profit</option>
              </select>
              {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue *
              </label>
              <select
                value={formData.annualRevenue}
                onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                className={`form-input ${errors.annualRevenue ? 'form-input-error' : ''}`}
              >
                <option value="">Select annual revenue</option>
                <option value="0-100k">$0 - $100,000</option>
                <option value="100k-500k">$100,000 - $500,000</option>
                <option value="500k-1m">$500,000 - $1,000,000</option>
                <option value="1m-5m">$1,000,000 - $5,000,000</option>
                <option value="5m+">$5,000,000+</option>
              </select>
              {errors.annualRevenue && <p className="text-red-500 text-sm mt-1">{errors.annualRevenue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID / EIN *
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                className={`form-input ${errors.taxId ? 'form-input-error' : ''}`}
                placeholder="Enter your Tax ID or EIN"
              />
              {errors.taxId && <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="form-input"
                placeholder="https://www.yourcompany.com"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us? *
              </label>
              <select
                value={formData.referralSource}
                onChange={(e) => handleInputChange('referralSource', e.target.value)}
                className={`form-input ${errors.referralSource ? 'form-input-error' : ''}`}
              >
                <option value="">Select referral source</option>
                <option value="google">Google Search</option>
                <option value="social-media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="advertisement">Advertisement</option>
                <option value="event">Event/Conference</option>
                <option value="other">Other</option>
              </select>
              {errors.referralSource && <p className="text-red-500 text-sm mt-1">{errors.referralSource}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Interest *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Renewable Energy', 'Carbon Credits', 'Sustainability', 'ESG', 'Green Finance', 'Clean Technology'].map((interest) => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('interests', [...formData.interests, interest])
                        } else {
                          handleInputChange('interests', formData.interests.filter(i => i !== interest))
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={4}
                className="form-input"
                placeholder="Any additional information you'd like to share..."
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Onboarding Form</h2>
              <p className="text-gray-600 mt-1">Please complete all steps to get started</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <div className="flex items-center space-x-4">
              {isSaving && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span>Saving...</span>
                </div>
              )}
              {lastSaved && !isSaving && (
                <span className="text-sm text-gray-500">
                  Last saved: {formatLastSaved(lastSaved)}
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep > step.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : currentStep === step.id
                      ? 'border-primary-600 text-primary-600'
                      : formData.completedSteps.includes(step.id - 1)
                      ? 'border-green-500 text-green-500 cursor-pointer hover:bg-green-50'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id || formData.completedSteps.includes(step.id - 1) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id || formData.completedSteps.includes(step.id - 1) ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          {/* Submission Status */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Submission Failed</p>
              </div>
              <p className="text-red-700 mt-1">{submitError}</p>
              <button
                onClick={() => setSubmitError('')}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Submission Successful!</p>
              </div>
              <p className="text-green-700 mt-1">
                Your data has been submitted to Bridge API. Redirecting to dashboard...
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-gray-600">
                  Please provide the following information to continue.
                </p>
              </div>
              
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || submitSuccess}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                isSubmitting || submitSuccess
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-success-600 hover:bg-success-700'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submitted</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

