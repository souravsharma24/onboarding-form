// Centralized user management for consistent username across all components

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  initials: string
  companyName: string
  phone?: string
  address?: string
  bio?: string
}

// Default user data - can be loaded from localStorage or API
export const defaultUser: User = {
  id: 'OKAD22_8054',
  username: 'OKAD22_8054',
  displayName: 'Andrew Smith',
  email: 'andrew.smith@innovomarkets.com',
  initials: 'AS',
  companyName: 'GreenEnergy Traders Inc.',
  phone: '+1 (555) 123-4567',
  address: '123 Business Street, Suite 100, New York, NY 10001',
  bio: 'Experienced energy trader with expertise in renewable energy markets and sustainable finance solutions.'
}

// Get user data from localStorage or return default
export const getUser = (): User => {
  if (typeof window === 'undefined') return defaultUser
  
  try {
    const savedUser = localStorage.getItem('innovo_user_data')
    if (savedUser) {
      return JSON.parse(savedUser)
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
  
  return defaultUser
}

// Save user data to localStorage
export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('innovo_user_data', JSON.stringify(user))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

// Update user data
export const updateUser = (updates: Partial<User>): User => {
  const currentUser = getUser()
  const updatedUser = { ...currentUser, ...updates }
  saveUser(updatedUser)
  return updatedUser
}

// Get user initials from name
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}
