'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Edit3, Users, Send } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import SimpleProgressBar from '@/components/progress/SimpleProgressBar'
import OverallProgressBar from '@/components/progress/OverallProgressBar'

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
  { id: 'your-info', title: 'Your Information', requiredFields: 3, completedFields: 0 },
  { id: 'business-info', title: 'Business Information', requiredFields: 13, completedFields: 0 },
  { id: 'ownership', title: 'Ownership and Management', requiredFields: 16, completedFields: 0 },
  { id: 'docs', title: 'Business Documentation', requiredFields: 4, completedFields: 0 },
  { id: 'funds', title: 'Source of Funds', requiredFields: 3, completedFields: 0 },
  { id: 'compliance', title: 'Compliance and Business Activity', requiredFields: 4, completedFields: 0 },
  { id: 'terms', title: 'Terms and Conditions', requiredFields: 1, completedFields: 0 },
]

interface OnboardingDashboardProps {
  onNavigateToSection: (sectionId: string) => void
  onManageCollaborators: () => void
}

export default function OnboardingDashboard({ onNavigateToSection, onManageCollaborators }: OnboardingDashboardProps) {
  const { user } = useUser()
  const { theme } = useTheme()
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

  // Listen for form data changes
  useEffect(() => {
    const handleDataChange = () => {
      // Force re-render when form data changes
      setOnboardingData(prev => ({ ...prev }))
    }

    // Listen for storage events and custom events
    window.addEventListener('storage', handleDataChange)
    window.addEventListener('onboardingDataChanged', handleDataChange)

    return () => {
      window.removeEventListener('storage', handleDataChange)
      window.removeEventListener('onboardingDataChanged', handleDataChange)
    }
  }, [])

  // Dashboard will automatically show progress from context

  const sectionCompletion = (section: Section) => {
    if (section.requiredFields === 0) return 100
    return Math.min(100, (section.completedFields / section.requiredFields) * 100)
  }

  const appCompletion = () => {
    const totalRequired = onboardingData.sections.reduce((sum, section) => sum + section.requiredFields, 0)
    const totalCompleted = onboardingData.sections.reduce((sum, section) => sum + section.completedFields, 0)
    return totalRequired > 0 ? Math.min(100, (totalCompleted / totalRequired) * 100) : 0
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
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {section.title}
                      </h3>
                      <button className={`p-2 rounded-full transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      }`}>
                        <ArrowRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                    </div>
                    {/* Progress bar for all sections - now spans full width */}
                    <div className="mt-2">
                      <SimpleProgressBar sectionId={section.id} />
                    </div>
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

          {/* Overall Progress Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <OverallProgressBar />
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
