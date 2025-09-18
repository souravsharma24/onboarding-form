# Onboarding Form with Bridge API Integration

A modern, responsive onboarding form built with Next.js, TypeScript, and Tailwind CSS, featuring local storage persistence and Bridge API integration.

## 🚀 Features

### Core Functionality
- **Multi-step Onboarding Form**: 4-step form with personal, company, business, and additional information
- **Local Storage Persistence**: Auto-saves form data locally with TTL support
- **Bridge API Integration**: Seamless data submission to Bridge API with retry logic
- **Invite Code Validation**: Real-time validation with API fallback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### User Experience
- **Auto-save**: Form data is automatically saved as users type
- **Progress Tracking**: Visual progress indicators and step completion
- **Error Handling**: Comprehensive error messages and recovery options
- **Loading States**: Visual feedback during API calls
- **Smooth Animations**: Framer Motion animations for better UX

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Local Storage Service**: Enhanced storage with validation and TTL
- **Bridge API Service**: Robust API integration with retry logic

## 📋 Form Sections

### 1. Personal Information
- First Name & Last Name
- Email Address (with validation)
- Phone Number (with validation)
- Date of Birth

### 2. Company Information
- Company Name
- Job Title
- Industry (dropdown selection)
- Company Size (dropdown selection)
- Company Address

### 3. Business Information
- Business Type (dropdown selection)
- Annual Revenue (dropdown selection)
- Tax ID / EIN
- Company Website (optional)

### 4. Additional Information
- Referral Source (dropdown selection)
- Areas of Interest (multi-select checkboxes)
- Additional Notes (optional)

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Custom Bridge API service

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/souravsharma24/onboarding-form.git
   cd onboarding-form
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BRIDGE_API_URL=https://api.bridge.example.com
   NEXT_PUBLIC_BRIDGE_API_KEY=your-bridge-api-key-here
   NEXT_PUBLIC_DEBUG_MODE=false
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Bridge API Configuration

The application expects the following API endpoints:

- `POST /api/v1/users/onboard` - Submit user onboarding data
- `POST /api/v1/invites/validate` - Validate invite codes

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BRIDGE_API_URL` | Bridge API base URL | `https://api.bridge.example.com` |
| `NEXT_PUBLIC_BRIDGE_API_KEY` | Bridge API key | `demo-api-key` |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logging | `false` |

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── onboarding/        # Onboarding pages
│   ├── onboardingform/    # Form pages
│   └── profile/           # Profile pages
├── components/            # React components
│   ├── OnboardingForm.tsx # Main form component
│   ├── PersistentOnboardingForm.tsx # Form with persistence
│   ├── OnboardingFlow.tsx # Form flow management
│   ├── InviteCodeForm.tsx # Invite code validation
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── ...               # Other components
├── contexts/              # React contexts
│   ├── ThemeContext.tsx   # Theme management
│   └── UserContext.tsx    # User state management
└── lib/                   # Utility libraries
    ├── bridgeApi.ts       # Bridge API integration
    ├── localStorage.ts    # Enhanced local storage
    ├── config.ts          # Configuration management
    ├── data.ts            # Mock data
    └── user.ts            # User utilities
```

## 🔄 Data Flow

### Form Submission Process
1. **Local Save**: Form data is saved locally first
2. **Data Transformation**: Data is transformed to Bridge API format
3. **API Submission**: Data is sent to Bridge API with retry logic
4. **Success Handling**: On success, local data is cleared and user is redirected
5. **Error Handling**: On failure, error message is shown with retry option

### Local Storage Features
- **Auto-save**: Form data is automatically saved as users type
- **Data Validation**: Checksum validation for data integrity
- **TTL Support**: Automatic expiration of stored data (7 days for form data, 24 hours for invite codes)
- **Error Handling**: Graceful handling of storage errors
- **Backup/Restore**: Export and import functionality

## 🎨 UI Components

### Sidebar Navigation
- **Collapsible**: Can be collapsed to save space
- **Responsive**: Adapts to different screen sizes
- **Active States**: Visual indicators for current page
- **Smooth Transitions**: Animated collapse/expand

### Form Components
- **Step Navigation**: Visual progress indicators
- **Field Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during operations
- **Success/Error Messages**: Clear user feedback

## 🔒 Security Features

- **Data Validation**: Client-side and server-side validation
- **API Key Protection**: Environment variable storage
- **HTTPS**: All API calls use HTTPS
- **Data Encryption**: Optional encryption for sensitive data
- **Input Sanitization**: Proper input handling and sanitization

## 🧪 Testing

### Test Data
Valid test invite codes for development:
- `INNOVO2024`
- `WELCOME123`
- `DEMO2024`
- `TESTCODE`

### Mock Mode
The system includes fallback mechanisms for development:
- **Invite Codes**: Falls back to local validation if API is unavailable
- **API Calls**: Can be mocked for testing purposes

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full sidebar and form layout
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Mobile-first design with touch-friendly interfaces

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/souravsharma24/onboarding-form/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

## 🔮 Future Enhancements

- **Offline Support**: Queue API calls when offline
- **Data Sync**: Sync local data with server
- **Analytics**: Track form completion rates
- **A/B Testing**: Test different form flows
- **Multi-language**: Support for multiple languages
- **Advanced Validation**: More sophisticated form validation
- **File Upload**: Support for document uploads
- **Progress Persistence**: Save progress across sessions

## 📊 Performance

- **Lazy Loading**: Components load data only when needed
- **Debounced Saves**: Local storage saves are debounced
- **Retry Logic**: Exponential backoff prevents API flooding
- **Data Compression**: Optional compression for large data sets
- **Bundle Optimization**: Optimized build for production

## 🏗️ Architecture

The application follows a modular architecture:
- **Components**: Reusable UI components
- **Services**: API and storage services
- **Contexts**: Global state management
- **Utilities**: Helper functions and configurations
- **Types**: TypeScript type definitions

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**