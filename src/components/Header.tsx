'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, ChevronDown, Sun, Moon, User, Settings } from 'lucide-react'
import MobileNavigation from './MobileNavigation'
import UserSettings from './UserSettings'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user } = useUser()
  const { theme, toggleTheme } = useTheme()
  const [showUserSettings, setShowUserSettings] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) return null

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <MobileNavigation activeTab={activeTab} onTabChange={onTabChange} />
          {/* Innovo Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">i</span>
            </div>
            <span className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Innovo
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* User Settings Modal */}
      {showUserSettings && (
        <UserSettings onClose={() => setShowUserSettings(false)} />
      )}
    </header>
  )
}
