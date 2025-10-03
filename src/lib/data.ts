export interface TableRow {
  offerId: string
  rfqId: string
  tradeType: string
  status: 'pending' | 'completed'
  progress: number
  recDirection: string
  energy: string
  market: string
  settledDate: string
}

export const mockData: TableRow[] = [
  {
    offerId: 'OFF-001',
    rfqId: 'RFQ-001',
    tradeType: 'Buy',
    status: 'pending',
    progress: 35,
    recDirection: 'Forward',
    energy: 'Solar',
    market: 'M-RETS',
    settledDate: '2024-01-15'
  },
  {
    offerId: 'OFF-002',
    rfqId: 'RFQ-002',
    tradeType: 'Sell',
    status: 'completed',
    progress: 100,
    recDirection: 'Backward',
    energy: 'Wind',
    market: 'M-RETS',
    settledDate: '2024-01-10'
  },
  {
    offerId: 'OFF-003',
    rfqId: 'RFQ-003',
    tradeType: 'Buy',
    status: 'pending',
    progress: 75,
    recDirection: 'Forward',
    energy: 'Solar',
    market: 'M-RETS',
    settledDate: '2024-01-20'
  },
  {
    offerId: 'OFF-004',
    rfqId: 'RFQ-004',
    tradeType: 'Sell',
    status: 'completed',
    progress: 100,
    recDirection: 'Backward',
    energy: 'Hydro',
    market: 'M-RETS',
    settledDate: '2024-01-08'
  },
  {
    offerId: 'OFF-005',
    rfqId: 'RFQ-005',
    tradeType: 'Buy',
    status: 'pending',
    progress: 20,
    recDirection: 'Forward',
    energy: 'Solar',
    market: 'M-RETS',
    settledDate: '2024-01-25'
  }
]

export const getMetrics = (activeTab: string) => {
  const baseMetrics = {
    buy: {
      totalSettlements: 8,
      completionRate: 62,
      pendingActions: 3
    },
    sell: {
      totalSettlements: 12,
      completionRate: 75,
      pendingActions: 2
    },
    settle: {
      totalSettlements: 15,
      completionRate: 53,
      pendingActions: 3
    }
  }

  return baseMetrics[activeTab as keyof typeof baseMetrics] || baseMetrics.settle
}

// Onboarding Form Data Interface
export interface OnboardingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  companyName: string
  jobTitle: string
  industry: string
  companySize: string
  address: string
  businessLocatedInUS: string
  businessLocation: string
  businessLegalName: string
  dbaName: string
  businessWebsite: string
  businessEIN: string
  businessEntityType: string
  businessIndustry: string
  businessDescription: string
  businessStreetAddress: string
  businessCity: string
  businessState: string
  businessPostalCode: string
  owner1Name: string
  owner1Percentage: string
  owner1Email: string
  owner2Name: string
  owner2Percentage: string
  owner2Email: string
  controlPersonFirstName: string
  controlPersonLastName: string
  controlPersonEmail: string
  controlPersonJobTitle: string
  controlPersonDateStarted: string
  authorizedSignerFirstName: string
  authorizedSignerLastName: string
  authorizedSignerEmail: string
  authorizedSignerJobTitle: string
  authorizedSignerDateStarted: string
  proofOfOperatingAddressFile: File | null
  bankAccountWiringInstructionsFile: File | null
  articlesOfIncorporationFile: File | null
  signedProofOfOwnershipDocumentFile: File | null
  primarySourceOfFund: string
  sourceOfFundDescription: string
  estimatedAnnualRevenue: string
  businessActivities: string[]
  expectedMonthlyTransactionAmount: string
  customerAccountUsage: string
  amlKybProcedures: string
  referralSource: string
  interests: string[]
  additionalNotes: string
  acceptStripeTerms: boolean
  completedSteps: number[]
  lastSaved: string
  [key: string]: any
}

// Calculate onboarding progress based on form data
export const calculateOnboardingProgress = (formData: OnboardingFormData): number => {
  if (!formData) return 0

  // Define step fields mapping to form steps
  const stepFields = [
    ['firstName', 'lastName', 'email'], // Step 1: Personal Information
    ['companyName', 'jobTitle', 'industry', 'companySize', 'address'], // Step 2: Company Information
    ['businessLocatedInUS', 'businessLocation', 'businessLegalName', 'dbaName', 'businessWebsite', 'businessEIN', 'businessEntityType', 'businessIndustry', 'businessDescription', 'businessStreetAddress', 'businessCity', 'businessState', 'businessPostalCode'], // Step 3: Business Information
    ['owner1Name', 'owner1Percentage', 'owner1Email', 'controlPersonFirstName', 'controlPersonLastName', 'controlPersonEmail', 'controlPersonJobTitle', 'controlPersonDateStarted', 'authorizedSignerFirstName', 'authorizedSignerLastName', 'authorizedSignerEmail', 'authorizedSignerJobTitle', 'authorizedSignerDateStarted'], // Step 4: Ownership and Management
    ['proofOfOperatingAddressFile', 'bankAccountWiringInstructionsFile', 'articlesOfIncorporationFile', 'signedProofOfOwnershipDocumentFile'], // Step 5: Business Documentation
    ['primarySourceOfFund', 'sourceOfFundDescription', 'estimatedAnnualRevenue'], // Step 6: Source of Fund
    ['businessActivities', 'expectedMonthlyTransactionAmount', 'customerAccountUsage', 'amlKybProcedures'], // Step 7: Compliance and Business Activity
    ['referralSource', 'interests'], // Step 8: Additional Information
    ['acceptStripeTerms'] // Step 9: Network Access Requirement
  ]

  let totalProgress = 0
  const totalSteps = stepFields.length

  stepFields.forEach((fields, stepIndex) => {
    const stepNumber = stepIndex + 1
    const isStepCompleted = formData.completedSteps?.includes(stepNumber) || false

    if (isStepCompleted) {
      totalProgress += 100
    } else {
      const completedFields = fields.filter(field => {
        const value = formData[field]
        if (Array.isArray(value)) {
          return value.length > 0
        }
        if (value === null || value === undefined) {
          return false
        }
        if (typeof value === 'boolean') {
          return value === true
        }
        if (value instanceof File) {
          return value.name && value.name.trim() !== ''
        }
        return value.toString().trim() !== ''
      }).length

      const stepProgress = fields.length > 0 ? (completedFields / fields.length) * 100 : 0
      totalProgress += stepProgress
    }
  })

  const result = Math.min(100, Math.round(totalProgress / totalSteps))
  console.log('calculateOnboardingProgress:', { totalProgress, totalSteps, result, formDataKeys: Object.keys(formData) })
  return result
}

// Calculate progress for a specific step
export const calculateStepProgress = (formData: OnboardingFormData, stepNumber: number): number => {
  if (!formData || stepNumber < 1 || stepNumber > 9) return 0

  // Define step fields mapping to form steps
  const stepFields = [
    ['firstName', 'lastName', 'email'], // Step 1: Personal Information
    ['companyName', 'jobTitle', 'industry', 'companySize', 'address'], // Step 2: Company Information
    ['businessLocatedInUS', 'businessLocation', 'businessLegalName', 'dbaName', 'businessWebsite', 'businessEIN', 'businessEntityType', 'businessIndustry', 'businessDescription', 'businessStreetAddress', 'businessCity', 'businessState', 'businessPostalCode'], // Step 3: Business Information
    ['owner1Name', 'owner1Percentage', 'owner1Email', 'controlPersonFirstName', 'controlPersonLastName', 'controlPersonEmail', 'controlPersonJobTitle', 'controlPersonDateStarted', 'authorizedSignerFirstName', 'authorizedSignerLastName', 'authorizedSignerEmail', 'authorizedSignerJobTitle', 'authorizedSignerDateStarted'], // Step 4: Ownership and Management
    ['proofOfOperatingAddressFile', 'bankAccountWiringInstructionsFile', 'articlesOfIncorporationFile', 'signedProofOfOwnershipDocumentFile'], // Step 5: Business Documentation
    ['primarySourceOfFund', 'sourceOfFundDescription', 'estimatedAnnualRevenue'], // Step 6: Source of Fund
    ['businessActivities', 'expectedMonthlyTransactionAmount', 'customerAccountUsage', 'amlKybProcedures'], // Step 7: Compliance and Business Activity
    ['referralSource', 'interests'], // Step 8: Additional Information
    ['acceptStripeTerms'] // Step 9: Network Access Requirement
  ]

  const stepIndex = stepNumber - 1
  const fields = stepFields[stepIndex] || []
  
  if (fields.length === 0) return 0

  const completedFields = fields.filter(field => {
    const value = formData[field]
    if (Array.isArray(value)) {
      return value.length > 0
    }
    if (value === null || value === undefined) {
      return false
    }
    if (typeof value === 'boolean') {
      return value === true
    }
    if (value instanceof File) {
      return value.name && value.name.trim() !== ''
    }
    return value.toString().trim() !== ''
  }).length

  const result = Math.round((completedFields / fields.length) * 100)
  console.log('calculateStepProgress:', { stepNumber, completedFields, totalFields: fields.length, result, fields })
  return result
}


