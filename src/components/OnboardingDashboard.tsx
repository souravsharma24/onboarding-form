'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Edit3, Users, Send } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useProgress } from '@/contexts/ProgressContext'

interface Section {
  id: string
  title: string
  requiredFields: number
  completedFields: number
}

interface OnboardingData {
  companyName: string
  status: 'Draft' | 'Submitted'
  sections: Section[]
  lastEditedSectionId: string
}

const defaultSections: Section[] = [
  { id: 'your-info', title: 'Your Information', requiredFields: 11, completedFields: 0 },
  { id: 'business-info', title: 'Business Information', requiredFields: 13, completedFields: 0 },
  { id: 'ownership', title: 'Ownership and Management', requiredFields: 13, completedFields: 0 },
  { id: 'docs', title: 'Business Documentation', requiredFields: 5, completedFields: 0 },
  { id: 'funds', title: 'Source of Funds', requiredFields: 7, completedFields: 0 },
  { id: 'compliance', title: 'Compliance and Business Activity', requiredFields: 11, completedFields: 0 },
  { id: 'terms', title: 'Terms and Conditions', requiredFields: 6, completedFields: 0 },
]

interface OnboardingDashboardProps {
  onNavigateToSection: (sectionId: string) => void
  onManageCollaborators: () => void
}

export default function OnboardingDashboard({ onNavigateToSection, onManageCollaborators }: OnboardingDashboardProps) {
  const { user } = useUser()
  const { theme } = useTheme()
  const { progress } = useProgress()
  
  // Debug progress updates
  useEffect(() => {
    console.log('Dashboard: Progress updated', progress)
  }, [progress])
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyName: 'GreenEnergy Traders Inc.',
    status: 'Draft',
    sections: defaultSections,
    lastEditedSectionId: 'business-info'
  })


  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('innovo_onboarding_dashboard')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOnboardingData(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [])

  // Listen for form data changes to update progress
  useEffect(() => {
    const handleDataChange = () => {
      // Force re-render when form data changes
      setOnboardingData(prev => ({ ...prev }))
    }

    const handleProgressChange = (event: CustomEvent) => {
      // Force re-render when progress changes
      setOnboardingData(prev => ({ ...prev }))
    }

    // Listen for storage events and custom events
    window.addEventListener('storage', handleDataChange)
    window.addEventListener('onboardingDataChanged', handleDataChange)
    window.addEventListener('onboardingProgressChanged', handleProgressChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleDataChange)
      window.removeEventListener('onboardingDataChanged', handleDataChange)
      window.removeEventListener('onboardingProgressChanged', handleProgressChange as EventListener)
    }
  }, [])

  // Dashboard will automatically show progress from context

  const sectionCompletion = (section: Section) => {
    // Map section IDs to step numbers
    const sectionToStepMap: { [key: string]: number } = {
      'your-info': 1,
      'business-info': 3,
      'ownership': 4,
      'docs': 5,
      'funds': 6,
      'compliance': 7,
      'terms': 9
    }
    
    const stepNumber = sectionToStepMap[section.id]
    if (stepNumber) {
      // Use progress context for current step, fallback to 0 for other steps
      if (stepNumber === progress.currentStep) {
        return progress.currentStepProgress
      } else {
        // For completed steps, return 100%, for future steps return 0%
        return stepNumber < progress.currentStep ? 100 : 0
      }
    }
    
    // Fallback to section-based calculation
    if (section.requiredFields === 0) return 100
    return Math.min(100, (section.completedFields / section.requiredFields) * 100)
  }

  const appCompletion = () => {
    // Use progress from context
    return progress.overallProgress
  }

  const allSectionsComplete = () => {
    return onboardingData.sections.every(s => sectionCompletion(s) >= 100)
  }

  const handleContinueApplication = () => {
    if (onboardingData.lastEditedSectionId) {
      onNavigateToSection(onboardingData.lastEditedSectionId)
    }
  }

  const handleSubmitApplication = () => {
    if (allSectionsComplete() && onboardingData.status === 'Draft') {
      const updatedData = { ...onboardingData, status: 'Submitted' as const }
      setOnboardingData(updatedData)
      localStorage.setItem('innovo_onboarding_dashboard', JSON.stringify(updatedData))
      
      // Show success message
      alert('Application submitted successfully!')
    }
  }

  const formatPercent = (n: number) => `${Math.round(n)}%`

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg shadow-sm border p-4 sm:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
      >
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome, {user.displayName.split(' ')[0]}!
        </h1>
        <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage the Innovo Onboarding Application for {user.companyName}.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Onboarding Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-lg shadow-sm border p-4 sm:p-6 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Your Onboarding Form
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Status:
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              onboardingData.status === 'Submitted' 
                ? (theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                : allSectionsComplete()
                ? (theme === 'dark' ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800')
                : (theme === 'dark' ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
            }`}>
              {onboardingData.status}
              {allSectionsComplete() && onboardingData.status === 'Draft' && ' - Ready to Submit'}
            </span>
          </div>
          
          <div className="space-y-3">
            {onboardingData.sections.map((section, index) => {
              const completion = sectionCompletion(section)
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`rounded-lg p-4 transition-colors cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => onNavigateToSection(section.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {section.title}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatPercent(completion)} Complete
                      </p>
                    </div>
                    <button className={`p-2 rounded-full transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}>
                      <ArrowRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <motion.div
                      className="bg-primary-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Actions Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg shadow-sm border p-4 sm:p-6 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`text-base sm:text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleContinueApplication}
              disabled={!onboardingData.lastEditedSectionId}
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Continue Application</span>
            </button>
            
            <button
              onClick={onManageCollaborators}
              className={`w-full flex items-center justify-center space-x-2 font-medium py-3 px-4 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Manage Collaborators</span>
            </button>
            
            <button
              onClick={handleSubmitApplication}
              disabled={!allSectionsComplete() || onboardingData.status === 'Submitted'}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </div>

          {/* Progress Summary */}
          <div className={`mt-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h4 className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Overall Progress
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Application Completion
              </span>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {formatPercent(appCompletion())}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${appCompletion()}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>

        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        © 2025 Innovo. All rights reserved.
      </motion.div>
    </div>
  )
}
