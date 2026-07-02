import type React from 'react'

import { useDailyStatsHook } from '../../hooks'

export interface IStatsRowComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const StatsRowComponent: React.FC<IStatsRowComponentProps> = () => {
  const { data: statsData } = useDailyStatsHook()
  const stats = statsData?.data

  const servedCount = stats?.servedCount ?? 0
  const waitingCount = stats?.waitingCount ?? 0
  const avgWaitMin = stats?.avgWaitMin ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 my-3 sm:my-4">
      <div className="bg-white rounded-lg p-2.5 sm:p-3.5 shadow-lg flex items-center gap-1.5 sm:gap-3 animate-fadeUp">
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
          ✅
        </div>
        <div className="min-w-0">
          <div className="font-serif text-lg sm:text-xl text-gray-900 leading-none">
            {servedCount}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 whitespace-nowrap">
            Servis
          </div>
        </div>
      </div>
      <div
        className="bg-white rounded-lg p-2.5 sm:p-3.5 shadow-lg flex items-center gap-1.5 sm:gap-3 animate-fadeUp"
        style={{ animationDelay: '0.05s' }}
      >
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
          ⏳
        </div>
        <div className="min-w-0">
          <div className="font-serif text-lg sm:text-xl text-gray-900 leading-none">
            {waitingCount}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 whitespace-nowrap">
            En attente
          </div>
        </div>
      </div>
      <div
        className="bg-white rounded-lg p-2.5 sm:p-3.5 shadow-lg flex items-center gap-1.5 sm:gap-3 animate-fadeUp"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
          ⏱
        </div>
        <div className="min-w-0">
          <div className="font-serif text-lg sm:text-xl text-gray-900 leading-none">
            {avgWaitMin}
            <span className="text-[10px] sm:text-xs">min</span>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 whitespace-nowrap">
            Temps moyen
          </div>
        </div>
      </div>
    </div>
  )
}
