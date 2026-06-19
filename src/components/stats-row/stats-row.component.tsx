import type React from 'react'

export interface IStatsRowComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const StatsRowComponent: React.FC<IStatsRowComponentProps> = () => {
  return (
    <div className="grid grid-cols-3 gap-3 my-4">
      <div className="bg-white rounded-lg p-3.5 shadow-lg flex items-center gap-3 animate-fadeUp">
        <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-lg">
          ✅
        </div>
        <div className="text-center">
          <div className="font-serif text-xl text-gray-900 leading-none">12</div>
          <div className="text-xs text-gray-400 mt-0.5">Servis</div>
        </div>
      </div>
      <div
        className="bg-white rounded-lg p-3.5 shadow-lg flex items-center gap-3 animate-fadeUp"
        style={{ animationDelay: '0.05s' }}
      >
        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
          ⏳
        </div>
        <div className="text-center">
          <div className="font-serif text-xl text-gray-900 leading-none">4</div>
          <div className="text-xs text-gray-400 mt-0.5">En attente</div>
        </div>
      </div>
      <div
        className="bg-white rounded-lg p-3.5 shadow-lg flex items-center gap-3 animate-fadeUp"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          ⏱
        </div>
        <div className="text-center">
          <div className="font-serif text-xl text-gray-900 leading-none">
            18<span className="text-xs">min</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Temps moyen</div>
        </div>
      </div>
    </div>
  )
}
