'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProgressState {
  overallProgress: number
  currentStepProgress: number
  currentStep: number
  totalSteps: number
}

interface ProgressContextType {
  progress: ProgressState
  updateProgress: (stepProgress: number, stepNumber: number) => void
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
    totalSteps: 9
  })

  // Update progress for a specific step
  const updateProgress = (stepProgress: number, stepNumber: number) => {
    console.log('ProgressContext: updateProgress called with:', { stepProgress, stepNumber })
    
    setProgress(prev => {
      // Create a copy of current progress
      const newProgress = { ...prev }
      
      // Update current step progress
      newProgress.currentStepProgress = stepProgress
      newProgress.currentStep = stepNumber
      
      // Calculate overall progress based on all steps
      // For simplicity, we'll use a basic calculation
      // You can enhance this based on your specific needs
      const stepWeight = 100 / newProgress.totalSteps
      newProgress.overallProgress = Math.min(100, (stepNumber - 1) * stepWeight + (stepProgress * stepWeight / 100))
      
      console.log('ProgressContext: New progress state:', newProgress)
      return newProgress
    })
  }

  const setCurrentStep = (step: number) => {
    setProgress(prev => ({ ...prev, currentStep: step }))
  }

  const resetProgress = () => {
    setProgress({
      overallProgress: 0,
      currentStepProgress: 0,
      currentStep: 1,
      totalSteps: 9
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