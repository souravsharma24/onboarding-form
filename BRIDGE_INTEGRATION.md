# Bridge API Integration Guide

This guide explains how to integrate your onboarding form with Bridge API for KYC (Know Your Customer) verification.

## 🚀 Quick Setup

### Step 1: Get Bridge API Key

1. **Create Account**: Go to [dashboard.bridge.xyz](https://dashboard.bridge.xyz) and create your free developer account
2. **Generate API Key**: Click on "API Keys" tab and generate a new API key
3. **Store Securely**: Bridge only shows your API key once, so copy and save it immediately

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Bridge API Configuration
NEXT_PUBLIC_BRIDGE_API_KEY=your_bridge_api_key_here
BRIDGE_API_KEY=your_bridge_api_key_here

# Environment
NODE_ENV=development
```

### Step 3: Test the Integration

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Form Submission**: Complete the onboarding form and submit it
3. **Check Bridge Dashboard**: Verify that the customer was created in your Bridge dashboard

## 📋 What's Included

### Files Added/Modified:

- ✅ `src/lib/bridge.ts` - Bridge API service with all KYC functions
- ✅ `src/hooks/useBridge.ts` - React hook for Bridge integration
- ✅ `src/app/api/bridge/customers/route.ts` - API route for customer management
- ✅ `src/app/api/bridge/kyc/route.ts` - API route for KYC document submission
- ✅ `src/components/PersistentOnboardingForm.tsx` - Updated with Bridge integration

### Bridge API Functions:

1. **Customer Management**:
   - `createCustomer()` - Create new customer in Bridge
   - `getCustomer()` - Retrieve customer information
   - `updateCustomer()` - Update customer details

2. **KYC Verification**:
   - `submitKYCDocuments()` - Submit required documents
   - `getKYCStatus()` - Check verification status

3. **Compliance**:
   - `submitComplianceInfo()` - Submit business activity information
   - `completeOnboarding()` - Complete the onboarding process

## 🔧 How It Works

### Form Submission Flow:

1. **User completes form** → Data is validated locally
2. **Create Bridge customer** → Personal and business information sent to Bridge
3. **Submit KYC documents** → File uploads sent to Bridge for verification
4. **Submit compliance info** → Business activities and AML procedures sent
5. **Complete onboarding** → Final step to activate customer account

### Error Handling:

- If Bridge API fails, the form still completes locally
- All errors are logged to console for debugging
- User sees success message regardless of Bridge status

## 🧪 Testing

### Sandbox Environment:

- Bridge automatically uses sandbox environment in development
- All API calls go to `https://api.sandbox.bridge.xyz`
- No real money or sensitive data is processed

### Production Environment:

- Set `NODE_ENV=production` to use live Bridge API
- API calls will go to `https://api.bridge.xyz`
- Ensure you have proper API keys for production

## 📚 Bridge API Documentation

For more details, visit the [Bridge API Documentation](https://apidocs.bridge.xyz/get-started/introduction/quick-start/get-set-up-with-bridge)

### Key Endpoints Used:

- `POST /customers` - Create customer
- `GET /customers/{id}` - Get customer
- `PUT /customers/{id}` - Update customer
- `POST /customers/{id}/kyc/documents` - Submit KYC documents
- `GET /customers/{id}/kyc/status` - Check KYC status
- `POST /customers/{id}/compliance` - Submit compliance info
- `POST /customers/{id}/onboarding/complete` - Complete onboarding

## 🔒 Security Notes

- API keys are stored in environment variables
- Never commit API keys to version control
- Use different keys for development and production
- Bridge API keys can be revoked from the dashboard if compromised

## 🆘 Troubleshooting

### Common Issues:

1. **"Bridge API key not found"**:
   - Check your `.env.local` file exists
   - Verify the API key is correctly set
   - Restart your development server

2. **"Failed to create customer"**:
   - Check your API key is valid
   - Verify you have the correct permissions
   - Check Bridge dashboard for error details

3. **"Failed to submit KYC documents"**:
   - Ensure files are properly selected
   - Check file size limits
   - Verify file formats are supported

### Debug Mode:

Add this to your `.env.local` for detailed logging:

```bash
DEBUG=bridge:*
```

## 📞 Support

- **Bridge Support**: [Bridge Documentation](https://apidocs.bridge.xyz)
- **Bridge Dashboard**: [dashboard.bridge.xyz](https://dashboard.bridge.xyz)
- **API Status**: Check Bridge status page for any service issues
