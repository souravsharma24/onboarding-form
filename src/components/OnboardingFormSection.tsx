'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save, CheckCircle, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface Field {
  id: string
  label: string
  type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'file'
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
    { id: 'phone', label: 'Phone Number', type: 'text', required: true, placeholder: '+1 (555) 123-4567' },
    { id: 'dateOfBirth', label: 'Date of Birth', type: 'text', required: true, placeholder: 'MM/DD/YYYY' },
    { id: 'ssn', label: 'Social Security Number', type: 'text', required: true, placeholder: 'XXX-XX-XXXX' },
    { id: 'address', label: 'Residential Address', type: 'textarea', required: true, placeholder: 'Enter your full residential address' },
    { id: 'city', label: 'City', type: 'text', required: true, placeholder: 'Enter city' },
    { id: 'state', label: 'State', type: 'select', required: true, options: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'] },
    { id: 'zipCode', label: 'ZIP Code', type: 'text', required: true, placeholder: '12345' },
    { id: 'country', label: 'Country', type: 'select', required: true, options: ['United States', 'Canada', 'United Kingdom', 'Other'] },
  ],
  'business-info': [
    { id: 'businessName', label: 'Business Legal Name', type: 'text', required: true, placeholder: 'Enter full legal business name' },
    { id: 'dbaName', label: 'DBA/Trade Name', type: 'text', required: false, placeholder: 'Enter DBA name if different from legal name' },
    { id: 'businessWebsite', label: 'Business Website', type: 'url', required: true, placeholder: 'https://example.com' },
    { id: 'businessEIN', label: 'Business EIN/Tax ID', type: 'text', required: true, placeholder: 'XX-XXXXXXX' },
    { id: 'entityType', label: 'Entity Type', type: 'select', required: true, options: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Trust', 'Non-Profit'] },
    { id: 'industry', label: 'Industry', type: 'select', required: true, options: ['Finance', 'Energy', 'Technology', 'Healthcare', 'Real Estate', 'Manufacturing', 'Retail', 'Agriculture', 'Other'] },
    { id: 'businessAddress', label: 'Business Address', type: 'textarea', required: true, placeholder: 'Enter full business address' },
    { id: 'businessCity', label: 'Business City', type: 'text', required: true, placeholder: 'Enter business city' },
    { id: 'businessState', label: 'Business State', type: 'select', required: true, options: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'] },
    { id: 'businessZipCode', label: 'Business ZIP Code', type: 'text', required: true, placeholder: '12345' },
    { id: 'businessPhone', label: 'Business Phone', type: 'text', required: true, placeholder: '+1 (555) 123-4567' },
    { id: 'annualRevenue', label: 'Annual Revenue', type: 'select', required: true, options: ['Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M'] },
    { id: 'numberOfEmployees', label: 'Number of Employees', type: 'select', required: true, options: ['1-10', '11-50', '51-200', '201-500', '501-1000', 'Over 1000'] },
  ],
  'ownership': [
    { id: 'owner1Name', label: 'Beneficial Owner 1 Full Name', type: 'text', required: true, placeholder: 'Full Name' },
    { id: 'owner1Percentage', label: 'Beneficial Owner 1 Ownership Percentage', type: 'text', required: true, placeholder: 'e.g., 50.00' },
    { id: 'owner1Title', label: 'Beneficial Owner 1 Title/Position', type: 'text', required: true, placeholder: 'e.g., CEO, President, Managing Member' },
    { id: 'owner1Address', label: 'Beneficial Owner 1 Address', type: 'textarea', required: true, placeholder: 'Enter full address' },
    { id: 'owner1SSN', label: 'Beneficial Owner 1 SSN', type: 'text', required: true, placeholder: 'XXX-XX-XXXX' },
    { id: 'owner1DOB', label: 'Beneficial Owner 1 Date of Birth', type: 'text', required: true, placeholder: 'MM/DD/YYYY' },
    { id: 'owner2Name', label: 'Beneficial Owner 2 Full Name', type: 'text', required: false, placeholder: 'Full Name (if applicable)' },
    { id: 'owner2Percentage', label: 'Beneficial Owner 2 Ownership Percentage', type: 'text', required: false, placeholder: 'e.g., 25.00' },
    { id: 'owner2Title', label: 'Beneficial Owner 2 Title/Position', type: 'text', required: false, placeholder: 'e.g., CFO, Vice President' },
    { id: 'controlPersonName', label: 'Control Person Full Name', type: 'text', required: true, placeholder: 'Full Name' },
    { id: 'controlPersonEmail', label: 'Control Person Email', type: 'email', required: true, placeholder: 'Email' },
    { id: 'controlPersonPhone', label: 'Control Person Phone', type: 'text', required: true, placeholder: '+1 (555) 123-4567' },
    { id: 'controlPersonTitle', label: 'Control Person Title', type: 'text', required: true, placeholder: 'e.g., Operations Manager, Controller' },
  ],
  'docs': [
    { id: 'operatingAddressFile', label: 'Proof of Operating Address File', type: 'file', required: true, help: 'Upload a recent document clearly showing business name and address' },
    { id: 'articlesFile', label: 'Articles of Incorporation/Organization File', type: 'file', required: true, help: 'Upload Articles of Incorporation, Articles of Organization, or similar formation document' },
    { id: 'bylawsFile', label: 'Bylaws/Operating Agreement File', type: 'file', required: true, help: 'Upload company bylaws, operating agreement, or partnership agreement' },
    { id: 'bankStatementFile', label: 'Business Bank Statement', type: 'file', required: true, help: 'Upload most recent business bank statement (last 3 months)' },
    { id: 'taxReturnFile', label: 'Business Tax Return', type: 'file', required: true, help: 'Upload most recent business tax return (Form 1120, 1065, or Schedule C)' },
    { id: 'businessLicenseFile', label: 'Business License/Permits', type: 'file', required: false, help: 'Upload business license or relevant permits (if applicable)' },
    { id: 'insuranceFile', label: 'Business Insurance Certificate', type: 'file', required: false, help: 'Upload business insurance certificate (if applicable)' },
  ],
  'funds': [
    { id: 'primarySource', label: 'Primary Source of Funds', type: 'select', required: true, options: ['Business Revenue', 'Outside Investment', 'Loans', 'Personal Savings', 'Inheritance', 'Sale of Assets', 'Other'] },
    { id: 'sourceDescription', label: 'Source of Funds Description', type: 'textarea', required: true, placeholder: 'Please provide detailed description of your primary source of funds' },
    { id: 'expectedMonthlyVolume', label: 'Expected Monthly Trading Volume', type: 'select', required: true, options: ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K - $1M', 'Over $1M'] },
    { id: 'expectedAnnualVolume', label: 'Expected Annual Trading Volume', type: 'select', required: true, options: ['Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M'] },
    { id: 'fundingPurpose', label: 'Primary Purpose of Trading Account', type: 'select', required: true, options: ['Hedging', 'Speculation', 'Investment', 'Arbitrage', 'Market Making', 'Other'] },
    { id: 'previousTradingExperience', label: 'Previous Trading Experience', type: 'select', required: true, options: ['None', 'Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'Over 10 years'] },
    { id: 'riskTolerance', label: 'Risk Tolerance', type: 'select', required: true, options: ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'] },
  ],
  'compliance': [
    { id: 'customerAccount', label: 'Will this account be used on behalf of customers?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'amlProcedures', label: 'If yes, describe AML/KYB procedures', type: 'textarea', required: true, placeholder: 'Type N/A if not applicable' },
    { id: 'sanctionsCheck', label: 'Are you or any beneficial owners on any sanctions lists?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'pepStatus', label: 'Are you or any beneficial owners a Politically Exposed Person (PEP)?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'pepDetails', label: 'If yes, provide PEP details', type: 'textarea', required: false, placeholder: 'Provide details about PEP status' },
    { id: 'regulatoryViolations', label: 'Have you or the business had any regulatory violations?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'violationDetails', label: 'If yes, provide violation details', type: 'textarea', required: false, placeholder: 'Provide details about regulatory violations' },
    { id: 'criminalHistory', label: 'Do you or any beneficial owners have criminal history?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'criminalDetails', label: 'If yes, provide criminal history details', type: 'textarea', required: false, placeholder: 'Provide details about criminal history' },
    { id: 'bankruptcyHistory', label: 'Have you or the business filed for bankruptcy?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'bankruptcyDetails', label: 'If yes, provide bankruptcy details', type: 'textarea', required: false, placeholder: 'Provide details about bankruptcy filings' },
  ],
  'terms': [
    { id: 'acceptTerms', label: 'Accept the Terms of Service (Innovo Markets)', type: 'select', required: true, options: ['No', 'Yes'] },
    { id: 'acceptPrivacyPolicy', label: 'Accept the Privacy Policy', type: 'select', required: true, options: ['No', 'Yes'] },
    { id: 'acceptRiskDisclosure', label: 'Accept the Risk Disclosure Statement', type: 'select', required: true, options: ['No', 'Yes'] },
    { id: 'acceptDataProcessing', label: 'Accept Data Processing Agreement', type: 'select', required: true, options: ['No', 'Yes'] },
    { id: 'marketingConsent', label: 'Marketing Communications Consent', type: 'select', required: true, options: ['Yes', 'No'], help: 'Do you consent to receive marketing communications from Innovo Markets?' },
    { id: 'electronicDelivery', label: 'Electronic Delivery Consent', type: 'select', required: true, options: ['Yes', 'No'], help: 'Do you consent to receive account statements and other documents electronically?' },
  ],
}

const sectionTitles: Record<string, string> = {
  'your-info': 'Your Information',
  'business-info': 'Business Information',
  'ownership': 'Ownership and Management',
  'docs': 'Business Documentation',
  'funds': 'Source of Funds',
  'compliance': 'Compliance and Business Activity',
  'terms': 'Terms and Conditions',
}

export default function OnboardingFormSection({ sectionId, onBack, onNext, onPrevious, onNavigateToSection }: OnboardingFormSectionProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<Record<string, string>>({})
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

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const calculateCompletion = () => {
    const requiredFields = fields.filter(f => f.required)
    const completedFields = requiredFields.filter(f => formData[f.id]?.trim())
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
              {fields.map((field, index) => (
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
              ))}
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
