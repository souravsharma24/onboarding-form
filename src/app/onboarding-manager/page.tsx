'use client'

import OnboardingManager from '@/components/onboarding/OnboardingManager'

export default function OnboardingManagerPage() {
  const handleBack = () => {
    // Redirect to main page
    window.location.href = '/'
  }

  return (
    <OnboardingManager onBack={handleBack} />
  )
}
