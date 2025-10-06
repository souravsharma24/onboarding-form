// Validation utility functions for form fields

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateField = (fieldId: string, value: any, fieldType: string): ValidationResult => {
  // Handle empty values
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: 'This field is required' }
  }

  const stringValue = value.toString().trim()

  switch (fieldType) {
    case 'email':
      return validateEmail(stringValue)
    
    case 'text':
      if (fieldId.includes('name') || fieldId.includes('Name')) {
        return validateName(stringValue)
      }
      if (fieldId.includes('company') || fieldId.includes('business') || fieldId.includes('legal')) {
        return validateCompanyName(stringValue)
      }
      return validateText(stringValue)
    
    case 'url':
      return validateUrl(stringValue)
    
    case 'textarea':
      return validateTextArea(stringValue)
    
    default:
      return { isValid: true }
  }
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  if (email.length < 5) {
    return { isValid: false, error: 'Email must be at least 5 characters long' }
  }
  
  return { isValid: true }
}

export const validateName = (name: string): ValidationResult => {
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' }
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' }
  }
  
  // Check if name contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  }
  
  return { isValid: true }
}

export const validateCompanyName = (name: string): ValidationResult => {
  if (name.length < 3) {
    return { isValid: false, error: 'Company name must be at least 3 characters long' }
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Company name must be less than 100 characters' }
  }
  
  // Company names can contain letters, numbers, spaces, and common business characters
  const companyRegex = /^[a-zA-Z0-9\s\-'&.,()]+$/
  if (!companyRegex.test(name)) {
    return { isValid: false, error: 'Company name contains invalid characters' }
  }
  
  return { isValid: true }
}

export const validateText = (text: string): ValidationResult => {
  if (text.length < 2) {
    return { isValid: false, error: 'Text must be at least 2 characters long' }
  }
  
  if (text.length > 200) {
    return { isValid: false, error: 'Text must be less than 200 characters' }
  }
  
  return { isValid: true }
}

export const validateUrl = (url: string): ValidationResult => {
  try {
    const urlObj = new URL(url)
    
    if (!urlObj.protocol || (!urlObj.protocol.includes('http'))) {
      return { isValid: false, error: 'URL must start with http:// or https://' }
    }
    
    if (url.length < 10) {
      return { isValid: false, error: 'URL must be at least 10 characters long' }
    }
    
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}

export const validateTextArea = (text: string): ValidationResult => {
  if (text.length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters long' }
  }
  
  if (text.length > 1000) {
    return { isValid: false, error: 'Description must be less than 1000 characters' }
  }
  
  return { isValid: true }
}

export const validateEIN = (ein: string): ValidationResult => {
  // Remove any non-digit characters
  const cleanEIN = ein.replace(/\D/g, '')
  
  if (cleanEIN.length !== 9) {
    return { isValid: false, error: 'EIN must be exactly 9 digits' }
  }
  
  return { isValid: true }
}

export const validatePhoneNumber = (phone: string): ValidationResult => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' }
  }
  
  if (cleanPhone.length > 15) {
    return { isValid: false, error: 'Phone number must be less than 15 digits' }
  }
  
  return { isValid: true }
}
