'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { validateField } from '@/lib/validation'

interface OverallProgressBarProps {
  className?: string
}

export default function OverallProgressBar({ className = '' }: OverallProgressBarProps) {
  const [overallProgress, setOverallProgress] = useState(0)
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({})

  // Get field type for validation
  const getFieldType = (fieldId: string) => {
    if (fieldId.includes('email') || fieldId.includes('Email')) return 'email'
    if (fieldId.includes('website') || fieldId.includes('Website') || fieldId.includes('url')) return 'url'
    if (fieldId.includes('description') || fieldId.includes('Description')) return 'textarea'
    if (fieldId.includes('name') || fieldId.includes('Name')) return 'text'
    return 'text'
  }

  // Define all sections and their required fields
  const getAllSections = () => {
    return {
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
  }

  // Calculate progress for a specific section
  const calculateSectionProgress = (sectionId: string, requiredFields: string[]) => {
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
          formData = {}
          requiredFields.forEach(field => {
            if (parsed[field] !== undefined) {
              formData[field] = parsed[field]
            }
          })
        }
      }

      // Calculate progress for this section's fields
      const completedFields = requiredFields.filter(field => {
        const value = formData[field]
        const hasValue = Array.isArray(value) ? value.length > 0 : value && value.toString().trim() !== ''
        
        if (!hasValue) return false
        
        // Validate the field - only count as completed if it passes validation
        const validation = validateField(field, value, getFieldType(field))
        return validation.isValid
      })
      
      return requiredFields.length > 0 
        ? Math.round((completedFields.length / requiredFields.length) * 100)
        : 0
    } catch (error) {
      console.error(`Error calculating progress for ${sectionId}:`, error)
      return 0
    }
  }

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const allSections = getAllSections()
    const sectionProgresses: Record<string, number> = {}
    let totalFields = 0
    let completedFields = 0

    Object.entries(allSections).forEach(([sectionId, requiredFields]) => {
      const sectionProgress = calculateSectionProgress(sectionId, requiredFields)
      sectionProgresses[sectionId] = sectionProgress
      
      // Calculate weighted progress (each section contributes equally to overall)
      totalFields += requiredFields.length
      completedFields += Math.round((sectionProgress / 100) * requiredFields.length)
    })

    const overallPercent = totalFields > 0 
      ? Math.round((completedFields / totalFields) * 100)
      : 0

    setSectionProgress(sectionProgresses)
    setOverallProgress(overallPercent)
  }

  // Update progress when component mounts and on storage changes
  useEffect(() => {
    calculateOverallProgress()

    const handleStorageChange = () => {
      calculateOverallProgress()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Overall Progress
        </span>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {overallProgress}%
        </span>
      </div>
      
      {/* Overall progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
