'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, getUser, saveUser, updateUser } from '@/lib/user'

interface UserContextType {
  user: User | null
  updateUserData: (updates: Partial<User>) => void
  refreshUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const refreshUser = () => {
    setUser(getUser())
  }

  const updateUserData = (updates: Partial<User>) => {
    const updatedUser = updateUser(updates)
    setUser(updatedUser)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUserData, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
