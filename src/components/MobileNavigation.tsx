'use client'

import { useState } from 'react'
import { Menu, X, Home, BarChart3, ShoppingCart, DollarSign, Settings, Target, FileText, UserPlus } from 'lucide-react'

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'onboarding', label: 'Onboarding Form', icon: UserPlus },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'action-center', label: 'Action Center', icon: Settings },
    { id: 'planning', label: 'Planning', icon: Target },
    { id: 'market-insights', label: 'Market Insights', icon: FileText }
  ]

  const marketplaceItems = [
    { id: 'buy', label: 'Buy' },
    { id: 'sell', label: 'Sell' },
    { id: 'settle', label: 'Settle' }
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">i</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">innovo</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'marketplace') {
                        // Handle marketplace submenu
                        return
                      }
                      onTabChange(item.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                  
                  {/* Marketplace Sub-items */}
                  {item.id === 'marketplace' && (
                    <div className="ml-8 mt-2 space-y-1">
                      {marketplaceItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            onTabChange(subItem.id)
                            setIsOpen(false)
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            activeTab === subItem.id
                              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 font-semibold'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

