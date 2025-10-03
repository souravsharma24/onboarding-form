'use client'

import { useProgress } from '@/contexts/ProgressContext'
import { motion } from 'framer-motion'

interface ProgressDisplayProps {
  showStepProgress?: boolean
  showOverallProgress?: boolean
  className?: string
}

export default function ProgressDisplay({ 
  showStepProgress = true, 
  showOverallProgress = true,
  className = ''
}: ProgressDisplayProps) {
  const { progress } = useProgress()
  
  console.log('ProgressDisplay: Current progress', progress)

  return (
    <div className={`space-y-2 ${className}`}>
      {showOverallProgress && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(progress.overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
      
      {showStepProgress && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Step {progress.currentStep} Progress</span>
            <span>{Math.round(progress.currentStepProgress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1">
            <motion.div
              className="bg-green-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.currentStepProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

