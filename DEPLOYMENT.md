# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository: `souravsharma24/onboarding-form`

### 2. Configure Environment Variables
In your Vercel dashboard, go to **Settings > Environment Variables** and add:

```
NEXT_PUBLIC_BRIDGE_API_URL = https://api.bridge.example.com
NEXT_PUBLIC_BRIDGE_API_KEY = your-actual-bridge-api-key
NEXT_PUBLIC_DEBUG_MODE = false
```

### 3. Build Settings
Vercel will automatically detect Next.js and use these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Common Vercel Issues & Solutions

### Issue 1: Build Failures
**Solution**: The project now includes:
- ✅ Optimized TypeScript configuration
- ✅ Proper Next.js configuration
- ✅ Vercel-specific settings in `vercel.json`

### Issue 2: Environment Variables
**Solution**: 
- Set environment variables in Vercel dashboard
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Restart deployment after adding variables

### Issue 3: TypeScript Errors
**Solution**: 
- Updated `tsconfig.json` with Vercel-compatible settings
- Added `downlevelIteration: true`
- Set target to `es2017`

### Issue 4: Memory/Timeout Issues
**Solution**:
- Added `vercel.json` with optimized settings
- Set `maxDuration: 30` for functions
- Added proper build configuration

## Build Optimization

The project includes several optimizations for Vercel:

1. **Standalone Output**: Optimized for serverless deployment
2. **SWC Minification**: Faster builds and smaller bundles
3. **Compression**: Enabled for better performance
4. **Security Headers**: Added in `vercel.json`

## Monitoring

After deployment, monitor:
- Build logs in Vercel dashboard
- Function logs for API calls
- Performance metrics
- Error tracking

## Troubleshooting

If you encounter issues:

1. **Check Build Logs**: Look for specific error messages
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Clear Cache**: Try redeploying with "Clear Cache" option
4. **Check Dependencies**: Ensure all packages are compatible

## Support

For additional help:
- Check Vercel documentation
- Review build logs
- Contact Vercel support if needed
