'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { validateField } from '@/lib/validation'

interface SimpleProgressBarProps {
  sectionId: string
  className?: string
}

export default function SimpleProgressBar({ sectionId, className = '' }: SimpleProgressBarProps) {
  const [progress, setProgress] = useState(0)

  // Get field type for validation
  const getFieldType = (fieldId: string) => {
    if (fieldId.includes('email') || fieldId.includes('Email')) return 'email'
    if (fieldId.includes('website') || fieldId.includes('Website') || fieldId.includes('url')) return 'url'
    if (fieldId.includes('description') || fieldId.includes('Description')) return 'textarea'
    if (fieldId.includes('name') || fieldId.includes('Name')) return 'text'
    return 'text'
  }

  // Define required fields for each section
  const getSectionFields = (sectionId: string) => {
    const sectionFields: Record<string, string[]> = {
      'your-info': ['firstName', 'lastName', 'email'],
      'business-info': [
        'businessLocatedInUS', 'businessLocation', 'businessLegalName', 'businessWebsite', 
        'businessEIN', 'businessEntityType', 'businessIndustry', 'businessDescription',
        'businessStreetAddress', 'businessCity', 'businessState', 'businessPostalCode'
      ],
      'ownership': [
        'owner1Name', 'owner1Percentage', 'owner1Email', 'owner2Name', 'owner2Percentage', 
        'owner2Email', 'controlPersonFirstName', 'controlPersonLastName', 'controlPersonEmail',
        'controlPersonJobTitle', 'controlPersonDateStarted', 'authorizedSignerFirstName',
        'authorizedSignerLastName', 'authorizedSignerEmail', 'authorizedSignerJobTitle',
        'authorizedSignerDateStarted'
      ],
      'docs': [
        'proofOfOperatingAddressFile', 'bankAccountWiringInstructionsFile', 
        'articlesOfIncorporationFile', 'signedProofOfOwnershipDocumentFile'
      ],
      'funds': ['primarySourceOfFund', 'sourceOfFundDescription', 'estimatedAnnualRevenue'],
      'compliance': ['businessActivities', 'expectedMonthlyTransactionAmount', 'customerAccountUsage', 'amlKybProcedures'],
      'terms': ['acceptStripeTerms']
    }
    return sectionFields[sectionId] || []
  }

  // Calculate progress from localStorage data
  const calculateProgress = () => {
    try {
      // Try to get data from section-specific storage first
      const sectionData = localStorage.getItem(`innovo_section_${sectionId}`)
      let formData: Record<string, any> = {}

      if (sectionData) {
        const parsed = JSON.parse(sectionData)
        formData = parsed.data || {}
      } else {
        // Fallback to main form data
        const mainFormData = localStorage.getItem('innovo_onboarding_form')
        if (mainFormData) {
          const parsed: Record<string, any> = JSON.parse(mainFormData)
          const requiredFields = getSectionFields(sectionId)
          formData = {}
          requiredFields.forEach(field => {
            if (parsed[field] !== undefined) {
              formData[field] = parsed[field]
            }
          })
        }
      }

      // Calculate progress for this section's fields
      const requiredFields = getSectionFields(sectionId)
      const completedFields = requiredFields.filter(field => {
        const value = formData[field]
        const hasValue = Array.isArray(value) ? value.length > 0 : value && value.toString().trim() !== ''
        
        if (!hasValue) return false
        
        // Validate the field - only count as completed if it passes validation
        const validation = validateField(field, value, getFieldType(field))
        return validation.isValid
      })
      
      const progressPercent = requiredFields.length > 0 
        ? Math.round((completedFields.length / requiredFields.length) * 100)
        : 0
      setProgress(progressPercent)
    } catch (error) {
      console.error('Error calculating progress:', error)
      setProgress(0)
    }
  }

  // Update progress when component mounts and on storage changes
  useEffect(() => {
    calculateProgress()

    const handleStorageChange = () => {
      calculateProgress()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [sectionId])

  // Show for all sections

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Progress
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
