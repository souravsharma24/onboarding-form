import { NextRequest, NextResponse } from 'next/server'
import BridgeService from '@/lib/bridge'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const customerId = formData.get('customerId') as string
    const documents = {
      proofOfAddress: formData.get('proofOfAddress') as File | null,
      bankAccountWiringInstructions: formData.get('bankAccountWiringInstructions') as File | null,
      articlesOfIncorporation: formData.get('articlesOfIncorporation') as File | null,
      proofOfOwnership: formData.get('proofOfOwnership') as File | null
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Filter out null files
    const validDocuments = Object.fromEntries(
      Object.entries(documents).filter(([_, file]) => file !== null)
    )

    const result = await BridgeService.submitKYCDocuments(customerId, validDocuments)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error submitting KYC documents:', error)
    return NextResponse.json(
      { error: 'Failed to submit KYC documents' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const status = await BridgeService.getKYCStatus(customerId)

    return NextResponse.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error checking KYC status:', error)
    return NextResponse.json(
      { error: 'Failed to check KYC status' },
      { status: 500 }
    )
  }
}
