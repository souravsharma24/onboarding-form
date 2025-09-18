'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import InviteCodeForm from './InviteCodeForm'
import PersistentOnboardingForm from './PersistentOnboardingForm'

interface OnboardingFlowProps {
  onComplete: () => void
  onBack: () => void
}

type FlowStep = 'invite' | 'form' | 'complete'

export default function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('invite')
  const [inviteCode, setInviteCode] = useState('')
  const [formData, setFormData] = useState<any>(null)

  // Check if user has already started the onboarding process
  useEffect(() => {
    const savedData = localStorage.getItem('innovo_onboarding_data')
    const savedInviteCode = localStorage.getItem('innovo_invite_code')
    
    if (savedData && savedInviteCode) {
      setInviteCode(savedInviteCode)
      setCurrentStep('form')
    }
  }, [])

  const handleInviteCodeSubmit = (code: string) => {
    setInviteCode(code)
    setCurrentStep('form')
  }

  const handleInviteCodeSkip = () => {
    setCurrentStep('form')
  }

  const handleFormComplete = (data: any) => {
    setFormData(data)
    setCurrentStep('complete')
    
    // Show completion for 3 seconds then redirect
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  const handleBackToInvite = () => {
    setCurrentStep('invite')
    setInviteCode('')
    localStorage.removeItem('innovo_invite_code')
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
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {currentStep === 'invite' && (
          <motion.div
            key="invite"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <InviteCodeForm
              onInviteCodeSubmit={handleInviteCodeSubmit}
              onSkip={handleInviteCodeSkip}
            />
          </motion.div>
        )}

        {currentStep === 'form' && (
          <motion.div
            key="form"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <PersistentOnboardingForm
              inviteCode={inviteCode}
              onComplete={handleFormComplete}
              onBack={onBack}
            />
          </motion.div>
        )}

        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
              <div className="w-16 h-16 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Innovo!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Your onboarding has been completed successfully. You can now access all features of the platform.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-success-50 rounded-lg">
                  <p className="text-sm text-success-800">
                    <strong>Invite Code:</strong> {formData?.inviteCode || 'N/A'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Redirecting to dashboard in a few seconds...
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={onComplete}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

