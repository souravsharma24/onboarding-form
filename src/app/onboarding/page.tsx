'use client'

import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  const handleComplete = () => {
    // Redirect to dashboard or main page
    window.location.href = '/'
  }

  const handleBack = () => {
    // Redirect to main page
    window.location.href = '/'
  }

  return (
    <OnboardingFlow
      onComplete={handleComplete}
      onBack={handleBack}
    />
  )
}

