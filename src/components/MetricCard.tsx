'use client'

import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'orange'
  className?: string
}

export default function MetricCard({ title, value, icon: Icon, color, className = '' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400',
    green: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-600 dark:text-success-400',
    orange: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-600 dark:text-warning-400'
  }

  return (
    <div className={`card ${className} animate-scale-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}


