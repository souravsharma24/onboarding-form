import { NextRequest, NextResponse } from 'next/server'
import BridgeService, { CreateCustomerRequest } from '@/lib/bridge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const customerData: CreateCustomerRequest = body

    // Validate required fields
    if (!customerData.email || !customerData.firstName || !customerData.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      )
    }

    // Create customer in Bridge (will return mock data if disabled)
    const customer = await BridgeService.createCustomer(customerData)

    return NextResponse.json({
      success: true,
      data: customer
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('id')

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Get customer from Bridge (will return mock data if disabled)
    const customer = await BridgeService.getCustomer(customerId)

    return NextResponse.json({
      success: true,
      data: customer
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}
