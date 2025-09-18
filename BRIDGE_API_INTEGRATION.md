# Bridge API Integration for Onboarding Form

This document describes the implementation of local storage and Bridge API integration for the onboarding form.

## Overview

The onboarding form now includes:
- **Local Storage**: Enhanced local storage with error handling, data validation, and TTL support
- **Bridge API Integration**: Full API integration for user data submission and invite code validation
- **Retry Mechanism**: Automatic retry logic for failed API calls
- **Loading States**: User-friendly loading indicators and error messages
- **Data Persistence**: Form data is automatically saved locally and restored on page reload

## Architecture

### Core Components

1. **Bridge API Service** (`src/lib/bridgeApi.ts`)
   - Handles all API communication with Bridge
   - Includes retry logic and error handling
   - Transforms form data to Bridge API format

2. **Local Storage Service** (`src/lib/localStorage.ts`)
   - Enhanced localStorage with metadata and validation
   - TTL support for automatic data expiration
   - Backup and restore functionality

3. **Configuration** (`src/lib/config.ts`)
   - Centralized configuration management
   - Environment variable support

4. **Updated Components**
   - `PersistentOnboardingForm.tsx`: Main form with API integration
   - `InviteCodeForm.tsx`: Invite code validation with API fallback

## Features

### Local Storage Features

- **Auto-save**: Form data is automatically saved as users type
- **Data Validation**: Checksum validation for data integrity
- **TTL Support**: Automatic expiration of stored data
- **Error Handling**: Graceful handling of storage errors
- **Backup/Restore**: Export and import functionality

### Bridge API Features

- **User Data Submission**: Complete form data sent to Bridge API
- **Invite Code Validation**: Real-time validation with fallback
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error messages and recovery
- **Loading States**: Visual feedback during API calls

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Bridge API Configuration
NEXT_PUBLIC_BRIDGE_API_URL=https://api.bridge.example.com
NEXT_PUBLIC_BRIDGE_API_KEY=your-bridge-api-key-here

# Optional: Enable debug mode for development
NEXT_PUBLIC_DEBUG_MODE=false
```

### API Configuration

The Bridge API service expects the following endpoints:

- `POST /api/v1/users/onboard` - Submit user onboarding data
- `POST /api/v1/invites/validate` - Validate invite codes

## Data Flow

### Form Submission Process

1. **Local Save**: Form data is saved locally first
2. **Data Transformation**: Data is transformed to Bridge API format
3. **API Submission**: Data is sent to Bridge API with retry logic
4. **Success Handling**: On success, local data is cleared and user is redirected
5. **Error Handling**: On failure, error message is shown with retry option

### Invite Code Validation

1. **API Validation**: Primary validation through Bridge API
2. **Fallback**: If API fails, falls back to local validation
3. **Caching**: Valid codes are cached locally with TTL

## API Data Format

### User Data Structure

```typescript
interface BridgeUserData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  
  // Company Information
  companyName: string
  jobTitle: string
  industry: string
  companySize: string
  address: string
  
  // Business Information
  businessType: string
  annualRevenue: string
  taxId: string
  website?: string
  
  // Additional Information
  referralSource: string
  interests: string[]
  additionalNotes?: string
  
  // Metadata
  inviteCode?: string
  submissionTimestamp: string
  source: string
}
```

### API Response Format

```typescript
interface BridgeApiResponse {
  success: boolean
  userId?: string
  message: string
  errors?: string[]
}
```

## Error Handling

### API Errors

- **Network Errors**: Automatic retry with exponential backoff
- **Validation Errors**: User-friendly error messages
- **Server Errors**: Graceful degradation with fallback options

### Storage Errors

- **Quota Exceeded**: Automatic cleanup of expired data
- **Corrupted Data**: Automatic removal and reset
- **Access Denied**: Graceful fallback to session storage

## Usage Examples

### Basic Form Usage

```typescript
import { PersistentOnboardingForm } from '@/components/PersistentOnboardingForm'

// The form automatically handles:
// - Local storage
// - API submission
// - Error handling
// - Loading states
```

### Manual API Usage

```typescript
import { bridgeApi, transformFormDataToBridgeFormat } from '@/lib/bridgeApi'

// Submit user data
const bridgeData = transformFormDataToBridgeFormat(formData)
const response = await bridgeApi.submitUserData(bridgeData)

// Validate invite code
const validation = await bridgeApi.validateInviteCode(code)
```

### Local Storage Usage

```typescript
import { saveOnboardingData, loadOnboardingData } from '@/lib/localStorage'

// Save data
const success = saveOnboardingData(formData)

// Load data
const data = loadOnboardingData()
```

## Testing

### Mock Mode

For development and testing, the system includes fallback mechanisms:

- **Invite Codes**: Falls back to local validation if API is unavailable
- **API Calls**: Can be mocked for testing purposes

### Test Data

Valid test invite codes:
- `INNOVO2024`
- `WELCOME123`
- `DEMO2024`
- `TESTCODE`

## Security Considerations

- **API Keys**: Stored in environment variables
- **Data Validation**: Client-side and server-side validation
- **HTTPS**: All API calls use HTTPS
- **Data Encryption**: Optional encryption for sensitive data

## Performance Optimizations

- **Debounced Saves**: Local storage saves are debounced to prevent excessive writes
- **Retry Logic**: Exponential backoff prevents API flooding
- **Data Compression**: Optional compression for large data sets
- **Lazy Loading**: Components load data only when needed

## Monitoring and Debugging

### Debug Mode

Enable debug mode to see detailed logging:

```env
NEXT_PUBLIC_DEBUG_MODE=true
```

### Storage Information

```typescript
import { LocalStorageService } from '@/lib/localStorage'

// Get storage usage
const info = LocalStorageService.getStorageInfo()
console.log('Storage used:', info.used, 'bytes')

// Create backup
const backup = LocalStorageService.backup()
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check environment variables
   - Verify API endpoint URL
   - Check network connectivity

2. **Local Storage Errors**
   - Check browser storage quota
   - Clear browser data if corrupted
   - Use incognito mode for testing

3. **Form Data Not Persisting**
   - Check localStorage permissions
   - Verify data format
   - Check TTL settings

### Debug Steps

1. Enable debug mode
2. Check browser console for errors
3. Verify API configuration
4. Test with mock data
5. Check network tab for API calls

## Future Enhancements

- **Offline Support**: Queue API calls when offline
- **Data Sync**: Sync local data with server
- **Analytics**: Track form completion rates
- **A/B Testing**: Test different form flows
- **Multi-language**: Support for multiple languages
