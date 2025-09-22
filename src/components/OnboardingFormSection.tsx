'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save, CheckCircle, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface Field {
  id: string
  label: string
  type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'file' | 'date' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: string[]
  help?: string
}

interface Section {
  id: string
  title: string
  requiredFields: number
  completedFields: number
}

interface OnboardingFormSectionProps {
  sectionId: string
  onBack: () => void
  onNext: () => void
  onPrevious: () => void
  onNavigateToSection: (sectionId: string) => void
}

const sectionFields: Record<string, Field[]> = {
  'your-info': [
    { id: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter your first name' },
    { id: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter your last name' },
    { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter your email' },
  ],
  'business-info': [
    { id: 'businessLocatedInUS', label: 'Is your business located in the US?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'businessLocation', label: 'Where is your business located?', type: 'text', required: true, placeholder: 'Enter business location' },
    { id: 'businessLegalName', label: 'Business legal name', type: 'text', required: true, placeholder: 'Enter business legal name' },
    { id: 'dbaName', label: 'DBA name / trade name (optional)', type: 'text', required: false, placeholder: 'Enter DBA name if applicable' },
    { id: 'businessWebsite', label: 'Business Website', type: 'url', required: true, placeholder: 'https://www.yourbusiness.com' },
    { id: 'businessEIN', label: 'Business EIN', type: 'text', required: true, placeholder: 'XX-XXXXXXX' },
    { id: 'businessEntityType', label: 'Business Entity Type', type: 'select', required: true, options: ['Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 'Non-Profit'] },
    { id: 'businessIndustry', label: 'Business Industry', type: 'select', required: true, options: ['Technology', 'Finance', 'Healthcare', 'Energy', 'Manufacturing', 'Retail', 'Other'] },
    { id: 'businessDescription', label: 'Business Description', type: 'textarea', required: true, placeholder: 'Describe your business activities' },
    { id: 'businessStreetAddress', label: 'Street address', type: 'text', required: true, placeholder: 'Enter street address' },
    { id: 'businessCity', label: 'City', type: 'text', required: true, placeholder: 'Enter city' },
    { id: 'businessState', label: 'State/Region', type: 'text', required: true, placeholder: 'Enter state/region' },
    { id: 'businessPostalCode', label: 'Postal code', type: 'text', required: true, placeholder: 'Enter postal code' },
  ],
  'ownership': [
    { id: 'owner1Name', label: 'Beneficial Owner 1 Full Name', type: 'text', required: true, placeholder: 'Full Name' },
    { id: 'owner1Percentage', label: 'Beneficial Owner 1 Ownership Percentage', type: 'text', required: true, placeholder: 'e.g., 50.00' },
    { id: 'owner1Email', label: 'Beneficial Owner 1 Email', type: 'email', required: true, placeholder: 'Enter email address' },
    { id: 'owner2Name', label: 'Beneficial Owner 2 Full Name', type: 'text', required: false, placeholder: 'Full Name (if applicable)' },
    { id: 'owner2Percentage', label: 'Beneficial Owner 2 Ownership Percentage', type: 'text', required: false, placeholder: 'e.g., 25.00' },
    { id: 'owner2Email', label: 'Beneficial Owner 2 Email', type: 'email', required: false, placeholder: 'Enter email address' },
    { id: 'controlPersonFirstName', label: 'Control Person First Name', type: 'text', required: true, placeholder: 'First Name' },
    { id: 'controlPersonLastName', label: 'Control Person Last Name', type: 'text', required: true, placeholder: 'Last Name' },
    { id: 'controlPersonEmail', label: 'Control Person Email', type: 'email', required: true, placeholder: 'Email' },
    { id: 'controlPersonJobTitle', label: 'Control Person Job Title', type: 'text', required: true, placeholder: 'e.g., Operations Manager, Controller' },
    { id: 'controlPersonDateStarted', label: 'Control Person Date Started', type: 'date', required: true, placeholder: '' },
    { id: 'authorizedSignerFirstName', label: 'Authorized Signer First Name', type: 'text', required: true, placeholder: 'First Name' },
    { id: 'authorizedSignerLastName', label: 'Authorized Signer Last Name', type: 'text', required: true, placeholder: 'Last Name' },
    { id: 'authorizedSignerEmail', label: 'Authorized Signer Email', type: 'email', required: true, placeholder: 'Email' },
    { id: 'authorizedSignerJobTitle', label: 'Authorized Signer Job Title', type: 'text', required: true, placeholder: 'e.g., Operations Manager, Controller' },
    { id: 'authorizedSignerDateStarted', label: 'Authorized Signer Date Started', type: 'date', required: true, placeholder: '' },
  ],
  'docs': [
    { id: 'proofOfOperatingAddressFile', label: 'Proof of Operating Address File', type: 'file', required: true, help: 'Upload a recent document clearly showing business name and address' },
    { id: 'bankAccountWiringInstructionsFile', label: 'Bank Account Wiring Instructions', type: 'file', required: true, help: 'Upload bank account wiring instructions document' },
    { id: 'articlesOfIncorporationFile', label: 'Articles of Incorporation File', type: 'file', required: true, help: 'Upload Articles of Incorporation, Articles of Organization, or similar formation document' },
    { id: 'signedProofOfOwnershipDocumentFile', label: 'Signed Proof of Ownership Document', type: 'file', required: true, help: 'Upload signed document proving ownership structure' },
  ],
  'funds': [
    { id: 'primarySourceOfFund', label: 'Primary Source of Fund', type: 'select', required: true, options: ['Business Revenue', 'Outside Investment', 'Loans', 'Personal Savings', 'Inheritance', 'Sale of Assets', 'Other'] },
    { id: 'sourceOfFundDescription', label: 'Source of Fund Description', type: 'textarea', required: true, placeholder: 'Please provide detailed description of your primary source of funds' },
    { id: 'estimatedAnnualRevenue', label: 'Estimated Annual Revenue', type: 'text', required: true, placeholder: 'e.g., $100,000 - $500,000' },
  ],
  'compliance': [
    { id: 'businessActivities', label: 'Please select all activities that apply to your business', type: 'checkbox', required: true, options: ['Money Services (i.e., check cashing, gift cards, ATMs, remittances)', 'Lending/Banking', 'Operate Foreign Exchange/Virtual Currencies Brokerage/OTC', 'Hold Client Funds (i.e., escrow)', 'Investment Services', 'Safe Deposit Box Rentals', 'Marijuana or Related Services', 'Third-Party Payment Processing', 'Adult Entertainment', 'Weapons, Firearms, and Explosives', 'Gambling', 'None of the above'] },
    { id: 'expectedMonthlyTransactionAmount', label: 'Enter your expected monthly transaction amount in USD', type: 'text', required: true, placeholder: 'e.g., $10,000 - $50,000' },
    { id: 'customerAccountUsage', label: 'Will this account be used to invest, transfer, or trade funds on behalf of customers or 3rd parties?', type: 'radio', required: true, options: ['Yes', 'No'] },
    { id: 'amlKybProcedures', label: 'If transacting on behalf of customers, please explain if your company has any AML/KYB procedures in place (Type N/A if this doesn\'t apply to you)', type: 'textarea', required: true, placeholder: 'Describe your AML/KYB procedures or type N/A if not applicable' },
  ],
  'terms': [
    { id: 'acceptStripeTerms', label: 'Accept the Terms of Service of our payment provider, Stripe (Bridge)', type: 'checkbox', required: true },
  ],
}

const sectionTitles: Record<string, string> = {
  'your-info': 'Your Information',
  'business-info': 'Business Information',
  'ownership': 'Ownership and Management',
  'docs': 'Business Documentation',
  'funds': 'Source of Funds',
  'compliance': 'Compliance and Business Activity',
  'terms': 'Network Access Requirement',
}

export default function OnboardingFormSection({ sectionId, onBack, onNext, onPrevious, onNavigateToSection }: OnboardingFormSectionProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')

  const fields = sectionFields[sectionId] || []
  const sectionTitle = sectionTitles[sectionId] || 'Unknown Section'


  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`innovo_section_${sectionId}`)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.data || {})
        setLastSaved(parsed.lastSaved || '')
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    } else {
      // Set default values for certain fields
      const defaultValues: Record<string, string> = {}
      if (sectionId === 'compliance') {
        defaultValues.customerAccountUsage = 'no'
      }
      if (Object.keys(defaultValues).length > 0) {
        setFormData(defaultValues)
      }
    }
  }, [sectionId])

  // Auto-save data
  const saveData = async () => {
    setIsSaving(true)
    try {
      const dataToSave = {
        data: formData,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem(`innovo_section_${sectionId}`, JSON.stringify(dataToSave))
      setLastSaved(dataToSave.lastSaved)
    } catch (error) {
      console.error('Error saving data:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        saveData()
      }
    }, 1000) // Debounce saves

    return () => clearTimeout(timeoutId)
  }, [formData])

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const calculateCompletion = () => {
    const requiredFields = fields.filter(f => f.required)
    const completedFields = requiredFields.filter(f => {
      const value = formData[f.id]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value?.trim()
    })
    return requiredFields.length === 0 ? 100 : (completedFields.length / requiredFields.length) * 100
  }

  const handleSave = () => {
    saveData()
  }

  const formatLastSaved = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderField = (field: Field) => {
    const value = formData[field.id] || ''

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="flex space-x-6">
            {field.options?.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option.toLowerCase()}
                  checked={value === option.toLowerCase()}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleInputChange(field.id, [...currentValues, option])
                    } else {
                      handleInputChange(field.id, currentValues.filter(v => v !== option))
                    }
                  }}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        )

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleInputChange(field.id, file.name)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        )

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        )
    }
  }

  const completion = calculateCompletion()

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className={`rounded-lg shadow-sm border p-4 sticky top-6 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Form Sections
            </h3>
            <nav className="space-y-2">
              {Object.entries(sectionTitles).map(([id, title]) => (
                <button
                  key={id}
                  onClick={() => onNavigateToSection(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    id === sectionId
                      ? (theme === 'dark' 
                          ? 'bg-primary-900/20 text-primary-400 border border-primary-800' 
                          : 'bg-primary-100 text-primary-800 border border-primary-200')
                      : (theme === 'dark' 
                          ? 'text-gray-400 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100')
                  }`}
                >
                  {title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Form */}
        <div className="col-span-1 lg:col-span-3">
          {/* Mobile Section Navigation */}
          <div className="lg:hidden mb-4">
            <div className={`rounded-lg shadow-sm border p-4 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Form Sections
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(sectionTitles).map(([id, title]) => (
                  <button
                    key={id}
                    onClick={() => onNavigateToSection(id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      id === sectionId
                        ? (theme === 'dark' 
                            ? 'bg-primary-900/20 text-primary-400 border border-primary-800' 
                            : 'bg-primary-100 text-primary-800 border border-primary-200')
                        : (theme === 'dark' 
                            ? 'text-gray-400 hover:bg-gray-700' 
                            : 'text-gray-600 hover:bg-gray-100')
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-sm border p-4 sm:p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {sectionTitle}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    completion === 100 
                      ? (theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                      : (theme === 'dark' ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                  }`}>
                    {Math.round(completion)}% Complete
                  </span>
                  {isSaving && (
                    <span className={`text-sm flex items-center space-x-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                      <span>Saving...</span>
                    </span>
                  )}
                  {lastSaved && !isSaving && (
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Last saved: {formatLastSaved(lastSaved)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onBack}
                className={`flex items-center space-x-2 transition-colors self-start sm:self-auto ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm sm:text-base">Back to Dashboard</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className={`w-full rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <motion.div
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {sectionId === 'terms' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Network Access Information */}
                  <div>
                    <p className={`text-sm mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      To ensure proper functionality of the Innovo platform, please ensure that your organization's network/firewall settings allow access to the following URLs:
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 font-medium min-w-0 flex-shrink-0">•</span>
                        <div>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                          }`}>Innovo App:</span>
                          <a 
                            href="https://app.innovomarkets.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline ml-2"
                          >
                            https://app.innovomarkets.com/
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 font-medium min-w-0 flex-shrink-0">•</span>
                        <div>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                          }`}>MetaMask Wallet:</span>
                          <a 
                            href="https://metamask.io/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline ml-2"
                          >
                            https://metamask.io/
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 font-medium min-w-0 flex-shrink-0">•</span>
                        <div>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                          }`}>Innovo Blockchain RPC Endpoint:</span>
                          <a 
                            href="https://subnets.avax.network/innovo/mainnet/rpc" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline ml-2"
                          >
                            https://subnets.avax.network/innovo/mainnet/rpc
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      If your IT or network security team requires additional information, the <strong>Chain ID</strong> used by our platform is <code className="font-mono font-semibold">10036</code>.
                    </p>
                    
                    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 ${
                      theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : ''
                    }`}>
                      <p className={`text-blue-800 font-medium ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                      }`}>
                        📩 Please coordinate with your IT team to whitelist these URLs, if necessary, before proceeding.
                      </p>
                    </div>
                  </div>

                  {/* Stripe Terms Checkbox */}
                  <div className="border-t pt-6">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptStripeTerms"
                        checked={formData.acceptStripeTerms === 'true'}
                        onChange={(e) => handleInputChange('acceptStripeTerms', e.target.checked.toString())}
                        className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="acceptStripeTerms" className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Accept the <a href="#" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</a> of our payment provider, Stripe (Bridge). *
                      </label>
                    </div>
                  </div>

                  {/* KYB Disclaimer */}
                  <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                  }`}>
                    <p className={`text-sm italic ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <strong>Innovo Markets is acting solely as a facilitator in the Know your Business (KYB) process and does not verify, validate, or certify the accuracy of the information provided on this form by the customer.</strong>
                    </p>
                  </div>
                </motion.div>
              ) : (
                fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                    {field.help && (
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {field.help}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className={`mt-8 pt-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Mobile Layout - Stacked buttons */}
              <div className="flex flex-col space-y-3 sm:hidden">
                <button
                  onClick={onPrevious}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center space-x-2 font-medium py-2 px-4 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                
                <button
                  onClick={onNext}
                  className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <span>Next & Save</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Layout - Horizontal buttons */}
              <div className="hidden sm:flex items-center justify-between">
                <button
                  onClick={onPrevious}
                  className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    className={`flex items-center space-x-2 font-medium py-2 px-4 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                  
                  <button
                    onClick={onNext}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <span>Next & Save</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
