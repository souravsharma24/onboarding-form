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
  DollarSign,
  Shield,
  Globe,
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
import { saveOnboardingData, loadOnboardingData, saveInviteCode, loadInviteCode, clearOnboardingData } from '@/lib/localStorage'
import { useBridge } from '@/hooks/useBridge'
import { calculateOnboardingProgress, calculateStepProgress, OnboardingFormData } from '@/lib/data'
import { useProgress } from '@/contexts/ProgressContext'

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
  businessLocatedInUS: string
  businessLocation: string
  businessLegalName: string
  dbaName: string
  businessWebsite: string
  businessEIN: string
  businessEntityType: string
  businessIndustry: string
  businessDescription: string
  businessStreetAddress: string
  businessCity: string
  businessState: string
  businessPostalCode: string
  
  // Ownership and Management
  owner1Name: string
  owner1Percentage: string
  owner1Email: string
  owner2Name: string
  owner2Percentage: string
  owner2Email: string
  controlPersonFirstName: string
  controlPersonLastName: string
  controlPersonEmail: string
  controlPersonJobTitle: string
  controlPersonDateStarted: string
  authorizedSignerFirstName: string
  authorizedSignerLastName: string
  authorizedSignerEmail: string
  authorizedSignerJobTitle: string
  authorizedSignerDateStarted: string
  
  // Business Documentation
  proofOfOperatingAddressFile: File | null
  bankAccountWiringInstructionsFile: File | null
  articlesOfIncorporationFile: File | null
  signedProofOfOwnershipDocumentFile: File | null
  
  // Source of Fund
  primarySourceOfFund: string
  sourceOfFundDescription: string
  estimatedAnnualRevenue: string
  
  // Compliance and Business Activity
  businessActivities: string[]
  expectedMonthlyTransactionAmount: string
  customerAccountUsage: string
  amlKybProcedures: string
  
  // Additional Information
  referralSource: string
  interests: string[]
  additionalNotes: string
  
  // Network Access Requirement
  acceptStripeTerms: boolean
  
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
    fields: ['firstName', 'lastName', 'email']
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
    fields: ['businessLocatedInUS', 'businessLocation', 'businessLegalName', 'dbaName', 'businessWebsite', 'businessEIN', 'businessEntityType', 'businessIndustry', 'businessDescription', 'businessStreetAddress', 'businessCity', 'businessState', 'businessPostalCode']
  },
  {
    id: 4,
    title: 'Ownership and Management',
    icon: User,
    fields: ['owner1Name', 'owner1Percentage', 'owner1Email', 'owner2Name', 'owner2Percentage', 'owner2Email', 'controlPersonFirstName', 'controlPersonLastName', 'controlPersonEmail', 'controlPersonJobTitle', 'controlPersonDateStarted', 'authorizedSignerFirstName', 'authorizedSignerLastName', 'authorizedSignerEmail', 'authorizedSignerJobTitle', 'authorizedSignerDateStarted']
  },
  {
    id: 5,
    title: 'Business Documentation',
    icon: FileText,
    fields: ['proofOfOperatingAddressFile', 'bankAccountWiringInstructionsFile', 'articlesOfIncorporationFile', 'signedProofOfOwnershipDocumentFile']
  },
  {
    id: 6,
    title: 'Source of Fund',
    icon: DollarSign,
    fields: ['primarySourceOfFund', 'sourceOfFundDescription', 'estimatedAnnualRevenue']
  },
  {
    id: 7,
    title: 'Compliance and Business Activity',
    icon: Shield,
    fields: ['businessActivities', 'expectedMonthlyTransactionAmount', 'customerAccountUsage', 'amlKybProcedures']
  },
  {
    id: 8,
    title: 'Additional Information',
    icon: FileText,
    fields: ['referralSource', 'interests', 'additionalNotes']
  },
  {
    id: 9,
    title: 'Network Access Requirement',
    icon: Globe,
    fields: ['acceptStripeTerms']
  }
]

interface PersistentOnboardingFormProps {
  inviteCode?: string
  onComplete: (data: FormData) => void
  onBack: () => void
}

export default function PersistentOnboardingForm({ inviteCode, onComplete, onBack }: PersistentOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bridgeCustomerId, setBridgeCustomerId] = useState<string | null>(null)
  const { createCustomer, updateCustomer, submitKYCDocuments, submitComplianceInfo, completeOnboarding, loading: bridgeLoading, error: bridgeError } = useBridge()
  const { progress, updateProgress, setCurrentStep: setProgressCurrentStep } = useProgress()
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
    businessLocatedInUS: '',
    businessLocation: '',
    businessLegalName: '',
    dbaName: '',
    businessWebsite: '',
    businessEIN: '',
    businessEntityType: '',
    businessIndustry: '',
    businessDescription: '',
    businessStreetAddress: '',
    businessCity: '',
    businessState: '',
    businessPostalCode: '',
    owner1Name: '',
    owner1Percentage: '',
    owner1Email: '',
    owner2Name: '',
    owner2Percentage: '',
    owner2Email: '',
    controlPersonFirstName: '',
    controlPersonLastName: '',
    controlPersonEmail: '',
    controlPersonJobTitle: '',
    controlPersonDateStarted: '',
    authorizedSignerFirstName: '',
    authorizedSignerLastName: '',
    authorizedSignerEmail: '',
    authorizedSignerJobTitle: '',
    authorizedSignerDateStarted: '',
    proofOfOperatingAddressFile: null,
    bankAccountWiringInstructionsFile: null,
    articlesOfIncorporationFile: null,
    signedProofOfOwnershipDocumentFile: null,
    primarySourceOfFund: '',
    sourceOfFundDescription: '',
    estimatedAnnualRevenue: '',
    businessActivities: [],
    expectedMonthlyTransactionAmount: '',
    customerAccountUsage: 'no',
    amlKybProcedures: '',
    referralSource: '',
    interests: [],
    additionalNotes: '',
    acceptStripeTerms: false,
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
        const completedSteps = savedData.completedSteps || []
        const lastCompletedStep = completedSteps.length > 0 ? Math.max(...completedSteps) : 0
        const newStep = lastCompletedStep + 1
        setCurrentStep(newStep)
        setProgressCurrentStep(newStep)
        
        setLastSaved(savedData.lastSaved)
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [inviteCode, setProgressCurrentStep])

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

  const handleInputChange = (field: keyof FormData, value: string | string[] | boolean) => {
    console.log('Input change:', field, value)
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      console.log('New form data:', newData)
      return newData
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
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

  // Helper function to add step to completed steps without using Set
  const addToCompletedSteps = (steps: number[], newStep: number): number[] => {
    if (steps.includes(newStep)) {
      return steps
    }
    return [...steps, newStep]
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Add current step to completed steps if not already present
      const completedSteps = addToCompletedSteps(formData.completedSteps, currentStep)
      
      setFormData(prev => ({ ...prev, completedSteps }))
      
      if (currentStep < steps.length) {
        const newStep = currentStep + 1
        setCurrentStep(newStep)
        setProgressCurrentStep(newStep)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      setProgressCurrentStep(newStep)
    }
  }

  const goToStep = (step: number) => {
    if (step <= currentStep || formData.completedSteps.includes(step - 1)) {
      setCurrentStep(step)
      setProgressCurrentStep(step)
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
      const completedSteps = addToCompletedSteps(formData.completedSteps, currentStep)
      
      const finalData = {
        ...formData,
        completedSteps,
        lastSaved: new Date().toISOString()
      }
      
      // Save final data locally
      saveOnboardingData(finalData)

      // Bridge API Integration
      try {
        // Step 1: Create customer in Bridge (if not already created)
        let customerId = bridgeCustomerId
        if (!customerId) {
          const customer = await createCustomer({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            address: {
              street: formData.businessStreetAddress,
              city: formData.businessCity,
              state: formData.businessState,
              postalCode: formData.businessPostalCode,
              country: formData.businessLocatedInUS === 'yes' ? 'US' : formData.businessLocation
            },
            businessInfo: {
              legalName: formData.businessLegalName,
              dbaName: formData.dbaName,
              ein: formData.businessEIN,
              entityType: formData.businessEntityType,
              industry: formData.businessIndustry,
              website: formData.businessWebsite,
              description: formData.businessDescription,
              address: {
                street: formData.businessStreetAddress,
                city: formData.businessCity,
                state: formData.businessState,
                postalCode: formData.businessPostalCode
              }
            }
          })
          customerId = customer.id
          setBridgeCustomerId(customerId)
        }

        // Step 2: Submit KYC documents
        if (customerId && (
          formData.proofOfOperatingAddressFile ||
          formData.bankAccountWiringInstructionsFile ||
          formData.articlesOfIncorporationFile ||
          formData.signedProofOfOwnershipDocumentFile
        )) {
          await submitKYCDocuments(customerId, {
            proofOfAddress: formData.proofOfOperatingAddressFile,
            bankAccountWiringInstructions: formData.bankAccountWiringInstructionsFile,
            articlesOfIncorporation: formData.articlesOfIncorporationFile,
            proofOfOwnership: formData.signedProofOfOwnershipDocumentFile
          })
        }

        // Step 3: Submit compliance information
        if (customerId) {
          await submitComplianceInfo(customerId, {
            businessActivities: formData.businessActivities,
            expectedMonthlyTransactionAmount: formData.expectedMonthlyTransactionAmount,
            customerAccountUsage: formData.customerAccountUsage,
            amlKybProcedures: formData.amlKybProcedures
          })
        }

        // Step 4: Complete onboarding
        if (customerId) {
          await completeOnboarding(customerId)
        }
      } catch (bridgeError) {
        console.error('Bridge API error:', bridgeError)
        // Continue with local completion even if Bridge fails
      }
      
      // Show success message and complete onboarding
      setSubmitSuccess(true)
      
      // Show success message and complete onboarding
      setTimeout(() => {
        clearOnboardingData()
        onComplete(finalData)
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('Failed to submit form. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update progress when form data changes (with debouncing for real-time updates)
  useEffect(() => {
    console.log('Progress calculation triggered:', { currentStep, formDataKeys: Object.keys(formData) })
    
    // Update progress using context
    updateProgress(formData as OnboardingFormData, currentStep)
  }, [formData, currentStep, updateProgress])

  const formatLastSaved = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input pl-10 ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="Enter your email address"
                />
              </div>
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`form-input ${errors.companyName ? 'form-input-error' : ''}`}
                placeholder="Enter your company name"
              />
                {errors.companyName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.companyName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className={`form-input ${errors.jobTitle ? 'form-input-error' : ''}`}
                  placeholder="Enter your job title"
                />
                {errors.jobTitle && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.jobTitle}</p>}
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                {errors.industry && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.industry}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                {errors.companySize && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.companySize}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Company Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`form-input pl-10 ${errors.address ? 'form-input-error' : ''}`}
                  placeholder="Enter your company address"
                />
              </div>
                {errors.address && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Business Location */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Is your business located in the US? *
              </label>
              <select
                value={formData.businessLocatedInUS}
                onChange={(e) => handleInputChange('businessLocatedInUS', e.target.value)}
                className={`form-input ${errors.businessLocatedInUS ? 'form-input-error' : ''}`}
              >
                <option value="">Please Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.businessLocatedInUS && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessLocatedInUS}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Where is your business located? *
              </label>
              <input
                type="text"
                value={formData.businessLocation}
                onChange={(e) => handleInputChange('businessLocation', e.target.value)}
                className={`form-input ${errors.businessLocation ? 'form-input-error' : ''}`}
                placeholder="Enter business location"
              />
              {errors.businessLocation && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessLocation}</p>}
            </div>

            {/* Business Details */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business legal name *
              </label>
              <input
                type="text"
                value={formData.businessLegalName}
                onChange={(e) => handleInputChange('businessLegalName', e.target.value)}
                className={`form-input ${errors.businessLegalName ? 'form-input-error' : ''}`}
                placeholder="Enter business legal name"
              />
              {errors.businessLegalName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessLegalName}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                DBA name / trade name (optional)
              </label>
              <input
                type="text"
                value={formData.dbaName}
                onChange={(e) => handleInputChange('dbaName', e.target.value)}
                className="form-input"
                placeholder="Enter DBA name if applicable"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Website *
              </label>
              <input
                type="url"
                value={formData.businessWebsite}
                onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                className={`form-input ${errors.businessWebsite ? 'form-input-error' : ''}`}
                placeholder="https://www.yourbusiness.com"
              />
              {errors.businessWebsite && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessWebsite}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business EIN *
              </label>
              <input
                type="text"
                value={formData.businessEIN}
                onChange={(e) => handleInputChange('businessEIN', e.target.value)}
                className={`form-input ${errors.businessEIN ? 'form-input-error' : ''}`}
                placeholder="XX-XXXXXXX"
              />
              {errors.businessEIN && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessEIN}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Entity Type *
              </label>
              <select
                value={formData.businessEntityType}
                onChange={(e) => handleInputChange('businessEntityType', e.target.value)}
                className={`form-input ${errors.businessEntityType ? 'form-input-error' : ''}`}
              >
                <option value="">Please Select</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="non-profit">Non-Profit</option>
              </select>
              {errors.businessEntityType && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessEntityType}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Industry *
              </label>
              <select
                value={formData.businessIndustry}
                onChange={(e) => handleInputChange('businessIndustry', e.target.value)}
                className={`form-input ${errors.businessIndustry ? 'form-input-error' : ''}`}
              >
                <option value="">Please Select</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="energy">Energy</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
              {errors.businessIndustry && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessIndustry}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Description *
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                rows={4}
                className={`form-input ${errors.businessDescription ? 'form-input-error' : ''}`}
                placeholder="Describe your business activities"
              />
              {errors.businessDescription && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessDescription}</p>}
            </div>

            {/* Business Operating Address */}
            <div className="border-t pt-4 sm:pt-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Business Operating Address</h4>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Street address *
              </label>
              <input
                type="text"
                  value={formData.businessStreetAddress}
                  onChange={(e) => handleInputChange('businessStreetAddress', e.target.value)}
                  className={`form-input ${errors.businessStreetAddress ? 'form-input-error' : ''}`}
                  placeholder="Enter street address"
                />
                {errors.businessStreetAddress && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessStreetAddress}</p>}
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    City *
              </label>
              <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => handleInputChange('businessCity', e.target.value)}
                    className={`form-input ${errors.businessCity ? 'form-input-error' : ''}`}
                    placeholder="Enter city"
                  />
                  {errors.businessCity && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessCity}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    State/Region *
                  </label>
                  <input
                    type="text"
                    value={formData.businessState}
                    onChange={(e) => handleInputChange('businessState', e.target.value)}
                    className={`form-input ${errors.businessState ? 'form-input-error' : ''}`}
                    placeholder="Enter state/region"
                  />
                  {errors.businessState && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessState}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Postal code *
                </label>
                <input
                  type="text"
                  value={formData.businessPostalCode}
                  onChange={(e) => handleInputChange('businessPostalCode', e.target.value)}
                  className={`form-input ${errors.businessPostalCode ? 'form-input-error' : ''}`}
                  placeholder="Enter postal code"
                />
                {errors.businessPostalCode && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessPostalCode}</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Beneficial Owner 1 */}
            <div className="border-b pb-4 sm:pb-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Beneficial Owner 1</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Beneficial Owner 1 Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.owner1Name}
                    onChange={(e) => handleInputChange('owner1Name', e.target.value)}
                    className={`form-input ${errors.owner1Name ? 'form-input-error' : ''}`}
                    placeholder="Full Name"
                  />
                  {errors.owner1Name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.owner1Name}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Beneficial Owner 1 Ownership Percentage *
                  </label>
                  <input
                    type="text"
                    value={formData.owner1Percentage}
                    onChange={(e) => handleInputChange('owner1Percentage', e.target.value)}
                    className={`form-input ${errors.owner1Percentage ? 'form-input-error' : ''}`}
                    placeholder="e.g., 50.00"
                  />
                  {errors.owner1Percentage && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.owner1Percentage}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Beneficial Owner 1 Email *
                </label>
                <input
                  type="email"
                  value={formData.owner1Email}
                  onChange={(e) => handleInputChange('owner1Email', e.target.value)}
                  className={`form-input ${errors.owner1Email ? 'form-input-error' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.owner1Email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.owner1Email}</p>}
              </div>
            </div>

            {/* Beneficial Owner 2 */}
            <div className="border-b pb-4 sm:pb-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Beneficial Owner 2 (Optional)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Beneficial Owner 2 Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.owner2Name}
                    onChange={(e) => handleInputChange('owner2Name', e.target.value)}
                    className="form-input"
                    placeholder="Full Name (if applicable)"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Beneficial Owner 2 Ownership Percentage
                  </label>
                  <input
                    type="text"
                    value={formData.owner2Percentage}
                    onChange={(e) => handleInputChange('owner2Percentage', e.target.value)}
                    className="form-input"
                    placeholder="e.g., 25.00"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Beneficial Owner 2 Email
                </label>
                <input
                  type="email"
                  value={formData.owner2Email}
                  onChange={(e) => handleInputChange('owner2Email', e.target.value)}
                  className="form-input"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Control Person */}
            <div className="border-b pb-4 sm:pb-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Control Person</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Control Person First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.controlPersonFirstName}
                    onChange={(e) => handleInputChange('controlPersonFirstName', e.target.value)}
                    className={`form-input ${errors.controlPersonFirstName ? 'form-input-error' : ''}`}
                    placeholder="First Name"
                  />
                  {errors.controlPersonFirstName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.controlPersonFirstName}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Control Person Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.controlPersonLastName}
                    onChange={(e) => handleInputChange('controlPersonLastName', e.target.value)}
                    className={`form-input ${errors.controlPersonLastName ? 'form-input-error' : ''}`}
                    placeholder="Last Name"
                  />
                  {errors.controlPersonLastName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.controlPersonLastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Control Person Email *
                  </label>
                  <input
                    type="email"
                    value={formData.controlPersonEmail}
                    onChange={(e) => handleInputChange('controlPersonEmail', e.target.value)}
                    className={`form-input ${errors.controlPersonEmail ? 'form-input-error' : ''}`}
                    placeholder="Email"
                  />
                  {errors.controlPersonEmail && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.controlPersonEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Control Person Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.controlPersonJobTitle}
                    onChange={(e) => handleInputChange('controlPersonJobTitle', e.target.value)}
                    className={`form-input ${errors.controlPersonJobTitle ? 'form-input-error' : ''}`}
                    placeholder="e.g., Operations Manager, Controller"
                  />
                  {errors.controlPersonJobTitle && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.controlPersonJobTitle}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Control Person Date Started *
                </label>
                <input
                  type="date"
                  value={formData.controlPersonDateStarted}
                  onChange={(e) => handleInputChange('controlPersonDateStarted', e.target.value)}
                  className={`form-input ${errors.controlPersonDateStarted ? 'form-input-error' : ''}`}
                />
                {errors.controlPersonDateStarted && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.controlPersonDateStarted}</p>}
              </div>
            </div>

            {/* Authorized Signer */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Authorized Signer</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Authorized Signer First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedSignerFirstName}
                    onChange={(e) => handleInputChange('authorizedSignerFirstName', e.target.value)}
                    className={`form-input ${errors.authorizedSignerFirstName ? 'form-input-error' : ''}`}
                    placeholder="First Name"
                  />
                  {errors.authorizedSignerFirstName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.authorizedSignerFirstName}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Authorized Signer Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedSignerLastName}
                    onChange={(e) => handleInputChange('authorizedSignerLastName', e.target.value)}
                    className={`form-input ${errors.authorizedSignerLastName ? 'form-input-error' : ''}`}
                    placeholder="Last Name"
                  />
                  {errors.authorizedSignerLastName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.authorizedSignerLastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Authorized Signer Email *
                  </label>
                  <input
                    type="email"
                    value={formData.authorizedSignerEmail}
                    onChange={(e) => handleInputChange('authorizedSignerEmail', e.target.value)}
                    className={`form-input ${errors.authorizedSignerEmail ? 'form-input-error' : ''}`}
                    placeholder="Email"
                  />
                  {errors.authorizedSignerEmail && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.authorizedSignerEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Authorized Signer Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedSignerJobTitle}
                    onChange={(e) => handleInputChange('authorizedSignerJobTitle', e.target.value)}
                    className={`form-input ${errors.authorizedSignerJobTitle ? 'form-input-error' : ''}`}
                    placeholder="e.g., Operations Manager, Controller"
                  />
                  {errors.authorizedSignerJobTitle && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.authorizedSignerJobTitle}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Authorized Signer Date Started *
                </label>
                <input
                  type="date"
                  value={formData.authorizedSignerDateStarted}
                  onChange={(e) => handleInputChange('authorizedSignerDateStarted', e.target.value)}
                  className={`form-input ${errors.authorizedSignerDateStarted ? 'form-input-error' : ''}`}
                />
                {errors.authorizedSignerDateStarted && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.authorizedSignerDateStarted}</p>}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Proof of Operating Address File *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('proofOfOperatingAddressFile', e.target.files?.[0] || null)}
                className={`form-input ${errors.proofOfOperatingAddressFile ? 'form-input-error' : ''}`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.proofOfOperatingAddressFile && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.proofOfOperatingAddressFile}</p>}
              {formData.proofOfOperatingAddressFile && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Selected: {formData.proofOfOperatingAddressFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Bank Account Wiring Instructions *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('bankAccountWiringInstructionsFile', e.target.files?.[0] || null)}
                className={`form-input ${errors.bankAccountWiringInstructionsFile ? 'form-input-error' : ''}`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.bankAccountWiringInstructionsFile && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bankAccountWiringInstructionsFile}</p>}
              {formData.bankAccountWiringInstructionsFile && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Selected: {formData.bankAccountWiringInstructionsFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Articles of Incorporation File *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('articlesOfIncorporationFile', e.target.files?.[0] || null)}
                className={`form-input ${errors.articlesOfIncorporationFile ? 'form-input-error' : ''}`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.articlesOfIncorporationFile && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.articlesOfIncorporationFile}</p>}
              {formData.articlesOfIncorporationFile && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Selected: {formData.articlesOfIncorporationFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Signed Proof of Ownership Document *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('signedProofOfOwnershipDocumentFile', e.target.files?.[0] || null)}
                className={`form-input ${errors.signedProofOfOwnershipDocumentFile ? 'form-input-error' : ''}`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.signedProofOfOwnershipDocumentFile && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.signedProofOfOwnershipDocumentFile}</p>}
              {formData.signedProofOfOwnershipDocumentFile && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Selected: {formData.signedProofOfOwnershipDocumentFile.name}</p>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Primary Source of Fund *
              </label>
              <select
                value={formData.primarySourceOfFund}
                onChange={(e) => handleInputChange('primarySourceOfFund', e.target.value)}
                className={`form-input ${errors.primarySourceOfFund ? 'form-input-error' : ''}`}
              >
                <option value="">Select primary source of fund</option>
                <option value="business-revenue">Business Revenue</option>
                <option value="outside-investment">Outside Investment</option>
                <option value="loans">Loans</option>
                <option value="personal-savings">Personal Savings</option>
                <option value="inheritance">Inheritance</option>
                <option value="sale-of-assets">Sale of Assets</option>
                <option value="other">Other</option>
              </select>
              {errors.primarySourceOfFund && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.primarySourceOfFund}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Source of Fund Description *
              </label>
              <textarea
                value={formData.sourceOfFundDescription}
                onChange={(e) => handleInputChange('sourceOfFundDescription', e.target.value)}
                rows={4}
                className={`form-input ${errors.sourceOfFundDescription ? 'form-input-error' : ''}`}
                placeholder="Please provide detailed description of your primary source of funds"
              />
              {errors.sourceOfFundDescription && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.sourceOfFundDescription}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Estimated Annual Revenue *
              </label>
              <input
                type="text"
                value={formData.estimatedAnnualRevenue}
                onChange={(e) => handleInputChange('estimatedAnnualRevenue', e.target.value)}
                className={`form-input ${errors.estimatedAnnualRevenue ? 'form-input-error' : ''}`}
                placeholder="e.g., $100,000 - $500,000"
              />
              {errors.estimatedAnnualRevenue && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.estimatedAnnualRevenue}</p>}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">
                Please select all activities that apply to your business
              </label>
              <div className="space-y-1 sm:space-y-2">
                {[
                  'Money Services (i.e., check cashing, gift cards, ATMs, remittances)',
                  'Lending/Banking',
                  'Operate Foreign Exchange/Virtual Currencies Brokerage/OTC',
                  'Hold Client Funds (i.e., escrow)',
                  'Investment Services',
                  'Safe Deposit Box Rentals',
                  'Marijuana or Related Services',
                  'Third-Party Payment Processing',
                  'Adult Entertainment',
                  'Weapons, Firearms, and Explosives',
                  'Gambling',
                  'None of the above'
                ].map((activity) => (
                  <label key={activity} className="flex items-start space-x-2 sm:space-x-3 cursor-pointer py-0.5 sm:py-1">
                    <input
                      type="checkbox"
                      checked={formData.businessActivities.includes(activity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('businessActivities', [...formData.businessActivities, activity])
                        } else {
                          handleInputChange('businessActivities', formData.businessActivities.filter(a => a !== activity))
                        }
                      }}
                      className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{activity}</span>
                  </label>
                ))}
              </div>
              {errors.businessActivities && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessActivities}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">
                Enter your expected monthly transaction amount in USD
              </label>
              <input
                type="text"
                value={formData.expectedMonthlyTransactionAmount}
                onChange={(e) => handleInputChange('expectedMonthlyTransactionAmount', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.expectedMonthlyTransactionAmount ? 'border-red-500' : ''
                }`}
                placeholder="e.g., $10,000 - $50,000"
              />
              {errors.expectedMonthlyTransactionAmount && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.expectedMonthlyTransactionAmount}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">
                Will this account be used to invest, transfer, or trade funds on behalf of customers or 3rd parties?
              </label>
              <div className="flex space-x-4 sm:space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customerAccountUsage"
                    value="yes"
                    checked={formData.customerAccountUsage === 'yes'}
                    onChange={(e) => handleInputChange('customerAccountUsage', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customerAccountUsage"
                    value="no"
                    checked={formData.customerAccountUsage === 'no'}
                    onChange={(e) => handleInputChange('customerAccountUsage', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">No</span>
                </label>
              </div>
              {errors.customerAccountUsage && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerAccountUsage}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">
                If transacting on behalf of customers, please explain if your company has any AML/KYB procedures in place (Type N/A if this doesn't apply to you)
              </label>
              <textarea
                value={formData.amlKybProcedures}
                onChange={(e) => handleInputChange('amlKybProcedures', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amlKybProcedures ? 'border-red-500' : ''
                }`}
                placeholder="Describe your AML/KYB procedures or type N/A if not applicable"
              />
              {errors.amlKybProcedures && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.amlKybProcedures}</p>}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                {errors.referralSource && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.referralSource}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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

      case 9:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">
                Network Access Requirements
              </h3>
              <p className="text-blue-800 text-sm sm:text-base mb-3 sm:mb-4">
                To ensure proper functionality of the Innovo platform, please ensure that your organization's network/firewall settings allow access to the following URLs:
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-blue-600 font-medium min-w-0 flex-shrink-0 text-sm sm:text-base">•</span>
                  <div>
                    <span className="text-blue-800 font-medium text-sm sm:text-base">Innovo App:</span>
                    <span className="text-blue-700 ml-1 sm:ml-2 break-all text-xs sm:text-sm">https://app.innovomarkets.com/</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-blue-600 font-medium min-w-0 flex-shrink-0 text-sm sm:text-base">•</span>
                  <div>
                    <span className="text-blue-800 font-medium text-sm sm:text-base">MetaMask Wallet:</span>
                    <span className="text-blue-700 ml-1 sm:ml-2 break-all text-xs sm:text-sm">https://metamask.io/</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-blue-600 font-medium min-w-0 flex-shrink-0 text-sm sm:text-base">•</span>
                  <div>
                    <span className="text-blue-800 font-medium text-sm sm:text-base">Innovo Blockchain RPC Endpoint:</span>
                    <span className="text-blue-700 ml-1 sm:ml-2 break-all text-xs sm:text-sm">https://subnets.avax.network/innovo/mainnet/rpc</span>
                  </div>
                </div>
              </div>
              
              <p className="text-blue-800 text-sm sm:text-base mb-3 sm:mb-4">
                If your IT or network security team requires additional information, the Chain ID used by our platform is <span className="font-mono font-semibold">10036</span>.
              </p>
              
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 sm:p-4">
                <p className="text-blue-800 font-medium text-sm sm:text-base">
                  📩 Please coordinate with your IT team to whitelist these URLs, if necessary, before proceeding.
                </p>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <input
                  type="checkbox"
                  id="acceptStripeTerms"
                  checked={formData.acceptStripeTerms}
                  onChange={(e) => handleInputChange('acceptStripeTerms', e.target.checked)}
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5 ${
                    errors.acceptStripeTerms ? 'border-red-500' : ''
                  }`}
                />
                <label htmlFor="acceptStripeTerms" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Accept the Terms of Service of our payment provider, Stripe (Bridge). *
                </label>
              </div>
              {errors.acceptStripeTerms && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.acceptStripeTerms}</p>}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 italic">
                <strong>Innovo Markets is acting solely as a facilitator in the Know your Business (KYB) process and does not verify, validate, or certify the accuracy of the information provided on this form by the customer.</strong>
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Form Sections
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-colors ${
                    currentStep === step.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <step.icon className="w-4 h-4 mb-1" />
                  <span className="text-center leading-tight">{step.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full overflow-hidden">
        {/* Header */}
        <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Onboarding Form</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Please complete all steps to get started</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800 transition-colors mt-2 sm:mt-0 px-2 py-1 sm:px-0 sm:py-0 rounded-md sm:rounded-none hover:bg-gray-100 sm:hover:bg-transparent"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm md:text-base">Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length} - Step Progress: {Math.round(progress.currentStepProgress)}% | Overall: {Math.round(progress.overallProgress)}%
            </span>
            <div className="text-xs text-gray-500">
              DEBUG: Overall: {progress.overallProgress.toFixed(1)}% | Step: {progress.currentStepProgress.toFixed(1)}% | Fields: {steps[currentStep - 1]?.fields?.length || 0}
            </div>
            <div className="text-xs text-blue-600">
              CONTEXT: Overall: {progress.overallProgress}% | Step: {progress.currentStepProgress}% | Current: {progress.currentStep}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isSaving && (
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary-600"></div>
                  <span>Saving...</span>
                </div>
              )}
              {lastSaved && !isSaving && (
                <span className="text-xs sm:text-sm text-gray-500 truncate">
                  Last saved: {formatLastSaved(lastSaved)}
                </span>
              )}
            </div>
          </div>
          {/* Overall Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Current Step Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-1">
            <motion.div
              className="bg-green-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.currentStepProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                    currentStep > step.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : currentStep === step.id
                      ? 'border-primary-600 text-primary-600'
                      : formData.completedSteps.includes(step.id - 1)
                      ? 'border-green-500 text-green-500 cursor-pointer   hover:bg-green-50'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id || formData.completedSteps.includes(step.id - 1) ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                    currentStep > step.id || formData.completedSteps.includes(step.id - 1) ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
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
        <div className="px-2 sm:px-4 md:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col gap-3 w-full">
            {/* Mobile: Stack all buttons vertically */}
            <div className="flex flex-col gap-2 sm:hidden w-full">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors w-full text-sm ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-100 bg-gray-50 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <button
                onClick={() => {
                  const completedSteps = addToCompletedSteps(formData.completedSteps, currentStep)
                  const dataToSave = {
                    ...formData,
                    completedSteps,
                    lastSaved: new Date().toISOString()
                  }
                  saveOnboardingData(dataToSave)
                  setFormData(dataToSave)
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors w-full text-sm font-medium"
                >
                  <span>Next & Save</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || submitSuccess}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors w-full text-sm font-medium ${
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
            
            {/* Desktop: Horizontal layout */}
            <div className="hidden sm:flex sm:justify-between gap-3 w-full">
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'text-gray-700 hover:bg-gray-100 bg-gray-50 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => {
                    const completedSteps = addToCompletedSteps(formData.completedSteps, currentStep)
                    const dataToSave = {
                      ...formData,
                      completedSteps,
                      lastSaved: new Date().toISOString()
                    }
                    saveOnboardingData(dataToSave)
                    setFormData(dataToSave)
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
              </div>
              
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <span>Next & Save</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || submitSuccess}
                  className={`flex items-center justify-center space-x-2 px-6 py-2 rounded-lg transition-colors text-sm font-medium ${
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
        </div>
        </div>
      </div>
    </div>
  )
}

