'use client'

import { useState } from 'react'
import { 
  Home, 
  BarChart3, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  Target, 
  FileText, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  ChevronLeft,
  UserPlus
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    marketplace: true,
    settings: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'onboarding', label: 'Onboarding Form', icon: UserPlus },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: ShoppingCart,
      subItems: [
        { id: 'buy', label: 'Buy' },
        { id: 'sell', label: 'Sell' },
        { id: 'settle', label: 'Settle' }
      ]
    },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'action-center', label: 'Action Center', icon: Settings },
    { id: 'planning', label: 'Planning', icon: Target },
    { id: 'market-insights', label: 'Market Insights', icon: FileText }
  ]

  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'logout', label: 'Logout Account', icon: LogOut }
  ]

  return (
    <div className={`bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    } hidden md:flex`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">i</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">innovo</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.subItems) {
                  toggleSection('marketplace')
                } else {
                  onTabChange(item.id)
                }
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                activeTab === item.id || (item.subItems && item.subItems.some(sub => activeTab === sub.id))
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`${isCollapsed ? 'w-4 h-4 -ml-2' : 'w-5 h-5'}`} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
              {item.subItems && !isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  expandedSections.marketplace ? 'rotate-180' : ''
                }`} />
              )}
            </button>
            
            {/* Sub-items */}
            {item.subItems && expandedSections.marketplace && !isCollapsed && (
              <div className="ml-8 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onTabChange(subItem.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      activeTab === subItem.id
                        ? 'bg-primary-100 text-primary-800 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
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

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Settings
          </div>
        )}
        <div className="space-y-1">
          {settingsItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
