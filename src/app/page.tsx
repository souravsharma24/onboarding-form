'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, CheckCircle, Clock } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import MetricCard from '@/components/MetricCard'
import TabNavigation from '@/components/TabNavigation'
import DataTable from '@/components/DataTable'
import OnboardingManager from '@/components/OnboardingManager'
import { mockData, getMetrics } from '@/lib/data'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('settle')
  const [sidebarTab, setSidebarTab] = useState('settle')

  const tabs = ['buy', 'sell', 'settle']
  const metrics = getMetrics(activeTab)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarTab(tab) // Also update the sidebar tab to keep them in sync
  }

  const handleSidebarTabChange = (tab: string) => {
    setSidebarTab(tab)
    if (['buy', 'sell', 'settle'].includes(tab)) {
      setActiveTab(tab)
    } else if (tab === 'onboarding') {
      setActiveTab('onboarding')
    } else if (['home', 'portfolio', 'transactions', 'action-center', 'planning', 'market-insights'].includes(tab)) {
      setActiveTab(tab)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={sidebarTab} onTabChange={handleSidebarTabChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={sidebarTab} onTabChange={handleSidebarTabChange} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'onboarding' ? (
                <motion.div
                  key="onboarding"
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={pageTransition}
                >
                  <OnboardingManager
                    onBack={() => setActiveTab('home')}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={pageTransition}
                >
                  {/* Content based on active tab */}
                  {['buy', 'sell', 'settle'].includes(activeTab) ? (
                    <>
                      {/* Portfolio Section */}
                      <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Portfolio</h2>
                        
                        {/* Tab Navigation */}
                        <div className="mb-6">
                          <TabNavigation 
                            tabs={tabs} 
                            activeTab={activeTab} 
                            onTabChange={handleTabChange} 
                          />
                        </div>
                    
                    {/* Metrics Cards */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={pageTransition}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8"
                      >
                        <MetricCard
                          title="Total Settlements"
                          value={metrics.totalSettlements}
                          icon={DollarSign}
                          color="blue"
                        />
                        <MetricCard
                          title="Completion Rate"
                          value={`${metrics.completionRate}%`}
                          icon={CheckCircle}
                          color="green"
                        />
                        <MetricCard
                          title="Pending Actions"
                          value={metrics.pendingActions}
                          icon={Clock}
                          color="orange"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  {/* Data Table */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`table-${activeTab}`}
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      transition={pageTransition}
                    >
                      <DataTable data={mockData} />
                    </motion.div>
                  </AnimatePresence>
                    </>
                  ) : (
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                        {activeTab === 'home' && 'Dashboard'}
                        {activeTab === 'portfolio' && 'Portfolio Overview'}
                        {activeTab === 'transactions' && 'Transaction History'}
                        {activeTab === 'action-center' && 'Action Center'}
                        {activeTab === 'planning' && 'Planning & Strategy'}
                        {activeTab === 'market-insights' && 'Market Insights'}
                      </h2>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <p className="text-gray-600 dark:text-gray-400">
                          {activeTab === 'home' && 'Welcome to your dashboard. Here you can view your portfolio overview and key metrics.'}
                          {activeTab === 'portfolio' && 'View your complete portfolio holdings, performance metrics, and asset allocation.'}
                          {activeTab === 'transactions' && 'Track all your trading activities, settlements, and transaction history.'}
                          {activeTab === 'action-center' && 'Manage your account settings, notifications, and system preferences.'}
                          {activeTab === 'planning' && 'Plan your trading strategies and set up automated trading rules.'}
                          {activeTab === 'market-insights' && 'Access market analysis, trends, and trading opportunities.'}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
