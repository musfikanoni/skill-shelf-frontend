import { Card } from '@/components/ui/card'
import React from 'react'


interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  borderColor: string
  bgIcon: string
}

export function StatCard({ icon, label, value, borderColor, bgIcon }: StatCardProps) {
  return (
    <Card className={`border-l-2 border-t border-b border-r shadow-md ${borderColor} p-6 bg-white`}>
      <div className="flex flex-col gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${bgIcon}`}>
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  )
}
