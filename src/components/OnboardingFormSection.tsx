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
}

const sectionFields: Record<string, Field[]> = {
  'your-info': [
    { id: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter your first name' },
    { id: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter your last name' },
    { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter your email' },
  ],
  'business-info': [
    { id: 'businessName', label: 'Business Legal Name', type: 'text', required: true, placeholder: 'Enter full legal business name' },
    { id: 'businessWebsite', label: 'Business Website', type: 'url', required: true, placeholder: 'https://example.com' },
    { id: 'businessEIN', label: 'Business EIN', type: 'text', required: true, placeholder: 'XX-XXXXXXX' },
    { id: 'entityType', label: 'Entity Type', type: 'select', required: true, options: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship'] },
    { id: 'industry', label: 'Industry', type: 'select', required: true, options: ['Finance', 'Energy', 'Technology', 'Other'] },
  ],
  'ownership': [
    { id: 'owner1Name', label: 'Beneficial Owner 1 Full Name', type: 'text', required: true, placeholder: 'Full Name' },
    { id: 'owner1Percentage', label: 'Beneficial Owner 1 Ownership Percentage', type: 'text', required: true, placeholder: 'e.g., 50.00' },
    { id: 'controlPersonEmail', label: 'Control Person Email', type: 'email', required: true, placeholder: 'Email' },
  ],
  'docs': [
    { id: 'operatingAddressFile', label: 'Proof of Operating Address File', type: 'file', required: true, help: 'Upload a recent document clearly showing business name and address' },
    { id: 'articlesFile', label: 'Articles of Incorporation File', type: 'file', required: true },
  ],
  'funds': [
    { id: 'primarySource', label: 'Primary Source of Funds', type: 'select', required: true, options: ['Business Revenue', 'Outside Investment', 'Loans', 'Other'] },
    { id: 'sourceDescription', label: 'Source of Funds Description', type: 'textarea', required: true, placeholder: 'Describe' },
  ],
  'compliance': [
    { id: 'customerAccount', label: 'Will this account be used on behalf of customers?', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'amlProcedures', label: 'If yes, describe AML/KYB procedures', type: 'textarea', required: true, placeholder: 'Type N/A if not applicable' },
  ],
  'terms': [
    { id: 'acceptTerms', label: 'Accept the Terms of Service (Stripe/Bridge)', type: 'select', required: true, options: ['No', 'Yes'] },
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

export default function OnboardingFormSection({ sectionId, onBack, onNext, onPrevious }: OnboardingFormSectionProps) {
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
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
                  onClick={() => onBack()}
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
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-sm border p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {sectionTitle}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
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
                className={`flex items-center space-x-2 transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
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
            <div className={`flex items-center justify-between mt-8 pt-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
