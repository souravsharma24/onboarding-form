'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { calculateOnboardingProgress, calculateStepProgress, OnboardingFormData } from '@/lib/data'

interface ProgressState {
  overallProgress: number
  currentStepProgress: number
  currentStep: number
  totalSteps: number
  isUpdating: boolean
}

interface ProgressContextType {
  progress: ProgressState
  updateProgress: (formData: OnboardingFormData, currentStep: number) => void
  setCurrentStep: (step: number) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

interface ProgressProviderProps {
  children: ReactNode
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, setProgress] = useState<ProgressState>({
    overallProgress: 0,
    currentStepProgress: 0,
    currentStep: 1,
    totalSteps: 9,
    isUpdating: false
  })

  const updateProgress = (formData: OnboardingFormData, currentStep: number) => {
    // Calculate progress values
    const overallProgress = calculateOnboardingProgress(formData)
    const currentStepProgress = calculateStepProgress(formData, currentStep)
    
    console.log('ProgressContext: Updating progress', { overallProgress, currentStepProgress, currentStep })
    
    setProgress(prev => ({
      ...prev,
      overallProgress,
      currentStepProgress,
      currentStep,
      isUpdating: false
    }))
  }

  const setCurrentStep = (step: number) => {
    setProgress(prev => ({ ...prev, currentStep: step }))
  }

  const resetProgress = () => {
    setProgress({
      overallProgress: 0,
      currentStepProgress: 0,
      currentStep: 1,
      totalSteps: 9,
      isUpdating: false
    })
  }


  return (
    <ProgressContext.Provider value={{
      progress,
      updateProgress,
      setCurrentStep,
      resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

