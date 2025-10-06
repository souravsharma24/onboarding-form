'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OnboardingDashboard from './OnboardingDashboard'
import OnboardingFormSection from './OnboardingFormSection'
import { useTheme } from '@/contexts/ThemeContext'

type View = 'dashboard' | 'form' | 'collaborators'

interface OnboardingManagerProps {
  onBack: () => void
}

const sectionOrder = [
  'your-info',
  'business-info', 
  'ownership',
  'docs',
  'funds',
  'compliance',
  'terms'
]

export default function OnboardingManager({ onBack }: OnboardingManagerProps) {
  const { theme } = useTheme()
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentSection, setCurrentSection] = useState<string>('your-info')


  const handleNavigateToSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentView('form')
  }

  const handleManageCollaborators = () => {
    setCurrentView('collaborators')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleNextSection = () => {
    const currentIndex = sectionOrder.indexOf(currentSection)
    if (currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1]
      setCurrentSection(nextSection)
    } else {
      // Last section, go back to dashboard
      setCurrentView('dashboard')
    }
  }

  const handlePreviousSection = () => {
    const currentIndex = sectionOrder.indexOf(currentSection)
    if (currentIndex > 0) {
      const prevSection = sectionOrder[currentIndex - 1]
      setCurrentSection(prevSection)
    } else {
      // First section, go back to dashboard
      setCurrentView('dashboard')
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <OnboardingDashboard
              onNavigateToSection={handleNavigateToSection}
              onManageCollaborators={handleManageCollaborators}
            />
          </motion.div>
        )}

        {currentView === 'form' && (
          <motion.div
            key="form"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <OnboardingFormSection
              sectionId={currentSection}
              onBack={handleBackToDashboard}
              onNext={handleNextSection}
              onPrevious={handlePreviousSection}
              onNavigateToSection={handleNavigateToSection}
            />
          </motion.div>
        )}

        {currentView === 'collaborators' && (
          <motion.div
            key="collaborators"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <CollaboratorsView onBack={handleBackToDashboard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simple collaborators view component
function CollaboratorsView({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme()
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`rounded-lg shadow-sm border p-6 ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Manage Collaborators
          </h2>
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
        
        <div className="text-center py-12">
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            You have not invited any collaborators yet.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Invite New Collaborator
          </button>
        </div>
      </div>
    </div>
  )
}
