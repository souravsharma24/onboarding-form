'use client'

import { useState } from 'react'
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
  Calendar
} from 'lucide-react'

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
  
  // Business Operating Address
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

export default function OnboardingForm() {
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
    acceptStripeTerms: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData)
      alert('Form submitted successfully!')
    }
  }

  const getProgressPercentage = () => {
    return (currentStep / steps.length) * 100
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.companySize ? 'border-red-500' : 'border-gray-300'
                }`}
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
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
            {/* Business Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is your business located in the US? *
              </label>
              <select
                value={formData.businessLocatedInUS}
                onChange={(e) => handleInputChange('businessLocatedInUS', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessLocatedInUS ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Please Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.businessLocatedInUS && <p className="text-red-500 text-sm mt-1">{errors.businessLocatedInUS}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where is your business located? *
              </label>
              <input
                type="text"
                value={formData.businessLocation}
                onChange={(e) => handleInputChange('businessLocation', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessLocation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter business location"
              />
              {errors.businessLocation && <p className="text-red-500 text-sm mt-1">{errors.businessLocation}</p>}
            </div>

            {/* Business Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business legal name *
              </label>
              <input
                type="text"
                value={formData.businessLegalName}
                onChange={(e) => handleInputChange('businessLegalName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessLegalName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter business legal name"
              />
              {errors.businessLegalName && <p className="text-red-500 text-sm mt-1">{errors.businessLegalName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DBA name / trade name (optional)
              </label>
              <input
                type="text"
                value={formData.dbaName}
                onChange={(e) => handleInputChange('dbaName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter DBA name if applicable"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Website *
              </label>
              <input
                type="url"
                value={formData.businessWebsite}
                onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessWebsite ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://www.yourbusiness.com"
              />
              {errors.businessWebsite && <p className="text-red-500 text-sm mt-1">{errors.businessWebsite}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business EIN *
              </label>
              <input
                type="text"
                value={formData.businessEIN}
                onChange={(e) => handleInputChange('businessEIN', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessEIN ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="XX-XXXXXXX"
              />
              {errors.businessEIN && <p className="text-red-500 text-sm mt-1">{errors.businessEIN}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Entity Type *
              </label>
              <select
                value={formData.businessEntityType}
                onChange={(e) => handleInputChange('businessEntityType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessEntityType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Please Select</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="non-profit">Non-Profit</option>
              </select>
              {errors.businessEntityType && <p className="text-red-500 text-sm mt-1">{errors.businessEntityType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Industry *
              </label>
              <select
                value={formData.businessIndustry}
                onChange={(e) => handleInputChange('businessIndustry', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessIndustry ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.businessIndustry && <p className="text-red-500 text-sm mt-1">{errors.businessIndustry}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your business activities"
              />
              {errors.businessDescription && <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>}
            </div>

            {/* Business Operating Address */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Operating Address</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street address *
                </label>
                <input
                  type="text"
                  value={formData.businessStreetAddress}
                  onChange={(e) => handleInputChange('businessStreetAddress', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.businessStreetAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter street address"
                />
                {errors.businessStreetAddress && <p className="text-red-500 text-sm mt-1">{errors.businessStreetAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => handleInputChange('businessCity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.businessCity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.businessCity && <p className="text-red-500 text-sm mt-1">{errors.businessCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Region *
                  </label>
                  <input
                    type="text"
                    value={formData.businessState}
                    onChange={(e) => handleInputChange('businessState', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.businessState ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter state/region"
                  />
                  {errors.businessState && <p className="text-red-500 text-sm mt-1">{errors.businessState}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal code *
                </label>
                <input
                  type="text"
                  value={formData.businessPostalCode}
                  onChange={(e) => handleInputChange('businessPostalCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.businessPostalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter postal code"
                />
                {errors.businessPostalCode && <p className="text-red-500 text-sm mt-1">{errors.businessPostalCode}</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {/* Beneficial Owner 1 */}
            <div className="border-b pb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Beneficial Owner 1</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficial Owner 1 Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.owner1Name}
                    onChange={(e) => handleInputChange('owner1Name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.owner1Name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Full Name"
                  />
                  {errors.owner1Name && <p className="text-red-500 text-sm mt-1">{errors.owner1Name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficial Owner 1 Ownership Percentage *
                  </label>
                  <input
                    type="text"
                    value={formData.owner1Percentage}
                    onChange={(e) => handleInputChange('owner1Percentage', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.owner1Percentage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 50.00"
                  />
                  {errors.owner1Percentage && <p className="text-red-500 text-sm mt-1">{errors.owner1Percentage}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficial Owner 1 Email *
                </label>
                <input
                  type="email"
                  value={formData.owner1Email}
                  onChange={(e) => handleInputChange('owner1Email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.owner1Email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.owner1Email && <p className="text-red-500 text-sm mt-1">{errors.owner1Email}</p>}
              </div>
            </div>

            {/* Beneficial Owner 2 */}
            <div className="border-b pb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Beneficial Owner 2 (Optional)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficial Owner 2 Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.owner2Name}
                    onChange={(e) => handleInputChange('owner2Name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Full Name (if applicable)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficial Owner 2 Ownership Percentage
                  </label>
                  <input
                    type="text"
                    value={formData.owner2Percentage}
                    onChange={(e) => handleInputChange('owner2Percentage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 25.00"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficial Owner 2 Email
                </label>
                <input
                  type="email"
                  value={formData.owner2Email}
                  onChange={(e) => handleInputChange('owner2Email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Control Person */}
            <div className="border-b pb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Control Person</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Control Person First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.controlPersonFirstName}
                    onChange={(e) => handleInputChange('controlPersonFirstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.controlPersonFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First Name"
                  />
                  {errors.controlPersonFirstName && <p className="text-red-500 text-sm mt-1">{errors.controlPersonFirstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Control Person Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.controlPersonLastName}
                    onChange={(e) => handleInputChange('controlPersonLastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.controlPersonLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last Name"
                  />
                  {errors.controlPersonLastName && <p className="text-red-500 text-sm mt-1">{errors.controlPersonLastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Control Person Email *
                  </label>
                  <input
                    type="email"
                    value={formData.controlPersonEmail}
                    onChange={(e) => handleInputChange('controlPersonEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.controlPersonEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Email"
                  />
                  {errors.controlPersonEmail && <p className="text-red-500 text-sm mt-1">{errors.controlPersonEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Control Person Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.controlPersonJobTitle}
                    onChange={(e) => handleInputChange('controlPersonJobTitle', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.controlPersonJobTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Operations Manager, Controller"
                  />
                  {errors.controlPersonJobTitle && <p className="text-red-500 text-sm mt-1">{errors.controlPersonJobTitle}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Control Person Date Started *
                </label>
                <input
                  type="date"
                  value={formData.controlPersonDateStarted}
                  onChange={(e) => handleInputChange('controlPersonDateStarted', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.controlPersonDateStarted ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.controlPersonDateStarted && <p className="text-red-500 text-sm mt-1">{errors.controlPersonDateStarted}</p>}
              </div>
            </div>

            {/* Authorized Signer */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Authorized Signer</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized Signer First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedSignerFirstName}
                    onChange={(e) => handleInputChange('authorizedSignerFirstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.authorizedSignerFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First Name"
                  />
                  {errors.authorizedSignerFirstName && <p className="text-red-500 text-sm mt-1">{errors.authorizedSignerFirstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized Signer Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedSignerLastName}
                    onChange={(e) => handleInputChange('authorizedSignerLastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.authorizedSignerLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last Name"
                  />
                  {errors.authorizedSignerLastName && <p className="text-red-500 text-sm mt-1">{errors.authorizedSignerLastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized Signer Email *
                  </label>
                  <input
                    type="email"
                    value={formData.authorizedSignerEmail}
                    onChange={(e) => handleInputChange('authorizedSignerEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.authorizedSignerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Email"
                  />
                  {errors.authorizedSignerEmail && <p className="text-red-500 text-sm mt-1">{errors.authorizedSignerEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized Signer Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedSignerJobTitle}
                    onChange={(e) => handleInputChange('authorizedSignerJobTitle', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.authorizedSignerJobTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Operations Manager, Controller"
                  />
                  {errors.authorizedSignerJobTitle && <p className="text-red-500 text-sm mt-1">{errors.authorizedSignerJobTitle}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorized Signer Date Started *
                </label>
                <input
                  type="date"
                  value={formData.authorizedSignerDateStarted}
                  onChange={(e) => handleInputChange('authorizedSignerDateStarted', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.authorizedSignerDateStarted ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.authorizedSignerDateStarted && <p className="text-red-500 text-sm mt-1">{errors.authorizedSignerDateStarted}</p>}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof of Operating Address File *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('proofOfOperatingAddressFile', e.target.files?.[0] || null)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.proofOfOperatingAddressFile ? 'border-red-500' : 'border-gray-300'
                }`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.proofOfOperatingAddressFile && <p className="text-red-500 text-sm mt-1">{errors.proofOfOperatingAddressFile}</p>}
              {formData.proofOfOperatingAddressFile && (
                <p className="text-sm text-gray-600 mt-1">Selected: {formData.proofOfOperatingAddressFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Wiring Instructions *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('bankAccountWiringInstructionsFile', e.target.files?.[0] || null)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.bankAccountWiringInstructionsFile ? 'border-red-500' : 'border-gray-300'
                }`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.bankAccountWiringInstructionsFile && <p className="text-red-500 text-sm mt-1">{errors.bankAccountWiringInstructionsFile}</p>}
              {formData.bankAccountWiringInstructionsFile && (
                <p className="text-sm text-gray-600 mt-1">Selected: {formData.bankAccountWiringInstructionsFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Articles of Incorporation File *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('articlesOfIncorporationFile', e.target.files?.[0] || null)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.articlesOfIncorporationFile ? 'border-red-500' : 'border-gray-300'
                }`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.articlesOfIncorporationFile && <p className="text-red-500 text-sm mt-1">{errors.articlesOfIncorporationFile}</p>}
              {formData.articlesOfIncorporationFile && (
                <p className="text-sm text-gray-600 mt-1">Selected: {formData.articlesOfIncorporationFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signed Proof of Ownership Document *
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('signedProofOfOwnershipDocumentFile', e.target.files?.[0] || null)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.signedProofOfOwnershipDocumentFile ? 'border-red-500' : 'border-gray-300'
                }`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.signedProofOfOwnershipDocumentFile && <p className="text-red-500 text-sm mt-1">{errors.signedProofOfOwnershipDocumentFile}</p>}
              {formData.signedProofOfOwnershipDocumentFile && (
                <p className="text-sm text-gray-600 mt-1">Selected: {formData.signedProofOfOwnershipDocumentFile.name}</p>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Source of Fund *
              </label>
              <select
                value={formData.primarySourceOfFund}
                onChange={(e) => handleInputChange('primarySourceOfFund', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.primarySourceOfFund ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.primarySourceOfFund && <p className="text-red-500 text-sm mt-1">{errors.primarySourceOfFund}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source of Fund Description *
              </label>
              <textarea
                value={formData.sourceOfFundDescription}
                onChange={(e) => handleInputChange('sourceOfFundDescription', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.sourceOfFundDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide detailed description of your primary source of funds"
              />
              {errors.sourceOfFundDescription && <p className="text-red-500 text-sm mt-1">{errors.sourceOfFundDescription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Annual Revenue *
              </label>
              <input
                type="text"
                value={formData.estimatedAnnualRevenue}
                onChange={(e) => handleInputChange('estimatedAnnualRevenue', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.estimatedAnnualRevenue ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., $100,000 - $500,000"
              />
              {errors.estimatedAnnualRevenue && <p className="text-red-500 text-sm mt-1">{errors.estimatedAnnualRevenue}</p>}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Please select all activities that apply to your business
              </label>
              <div className="space-y-2">
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
                  <label key={activity} className="flex items-start space-x-3 cursor-pointer py-1">
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
                    <span className="text-sm text-gray-700 leading-relaxed">{activity}</span>
                  </label>
                ))}
              </div>
              {errors.businessActivities && <p className="text-red-500 text-sm mt-1">{errors.businessActivities}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
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
              {errors.expectedMonthlyTransactionAmount && <p className="text-red-500 text-sm mt-1">{errors.expectedMonthlyTransactionAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Will this account be used to invest, transfer, or trade funds on behalf of customers or 3rd parties?
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customerAccountUsage"
                    value="yes"
                    checked={formData.customerAccountUsage === 'yes'}
                    onChange={(e) => handleInputChange('customerAccountUsage', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
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
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
              {errors.customerAccountUsage && <p className="text-red-500 text-sm mt-1">{errors.customerAccountUsage}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
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
              {errors.amlKybProcedures && <p className="text-red-500 text-sm mt-1">{errors.amlKybProcedures}</p>}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us? *
              </label>
              <select
                value={formData.referralSource}
                onChange={(e) => handleInputChange('referralSource', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.referralSource ? 'border-red-500' : 'border-gray-300'
                }`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional information you'd like to share..."
              />
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Network Access Requirements
              </h3>
              <p className="text-blue-800 mb-4">
                To ensure proper functionality of the Innovo platform, please ensure that your organization's network/firewall settings allow access to the following URLs:
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 font-medium min-w-0 flex-shrink-0">•</span>
                  <div>
                    <span className="text-blue-800 font-medium">Innovo App:</span>
                    <span className="text-blue-700 ml-2 break-all">https://app.innovomarkets.com/</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 font-medium min-w-0 flex-shrink-0">•</span>
                  <div>
                    <span className="text-blue-800 font-medium">MetaMask Wallet:</span>
                    <span className="text-blue-700 ml-2 break-all">https://metamask.io/</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 font-medium min-w-0 flex-shrink-0">•</span>
                  <div>
                    <span className="text-blue-800 font-medium">Innovo Blockchain RPC Endpoint:</span>
                    <span className="text-blue-700 ml-2 break-all">https://subnets.avax.network/innovo/mainnet/rpc</span>
                  </div>
                </div>
              </div>
              
              <p className="text-blue-800 mb-4">
                If your IT or network security team requires additional information, the Chain ID used by our platform is <span className="font-mono font-semibold">10036</span>.
              </p>
              
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  📩 Please coordinate with your IT team to whitelist these URLs, if necessary, before proceeding.
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acceptStripeTerms"
                  checked={formData.acceptStripeTerms}
                  onChange={(e) => handleInputChange('acceptStripeTerms', e.target.checked)}
                  className={`w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5 ${
                    errors.acceptStripeTerms ? 'border-red-500' : ''
                  }`}
                />
                <label htmlFor="acceptStripeTerms" className="text-sm text-gray-700 leading-relaxed">
                  Accept the Terms of Service of our payment provider, Stripe (Bridge). *
                </label>
              </div>
              {errors.acceptStripeTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptStripeTerms}</p>}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 italic">
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customer Onboarding Form</h2>
          <p className="text-gray-600 mt-1">Please complete all steps to get started</p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getProgressPercentage())}% Complete
            </span>
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
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : currentStep === step.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
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
              className="flex items-center space-x-2 bg-success-600 text-white px-6 py-2 rounded-lg hover:bg-success-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

