import React from 'react'
import { useNavigate } from 'react-router-dom'

export interface IQueueRecapComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const QueueRecapComponent: React.FC<IQueueRecapComponentProps> = () => {
  const navigate = useNavigate()
  
 return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp">
      <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-gray-200">
        <div className="font-serif text-base text-gray-900">File d'attente</div>
        <div className="text-xs text-amber-700 font-semibold cursor-pointer uppercase tracking-wide" onClick={() => navigate('/waiting-list')}>Tout voir</div>
      </div>
      <div className="p-[18px]">
        <div className="flex items-center gap-3.5 bg-gray-50 rounded-lg p-3.5 mb-4">
          <div className="font-serif text-5xl text-amber-700 leading-none">07</div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Client actuel</div>
            <div className="text-base font-semibold text-gray-900 my-0.5">Anonyme · Device #4F2A</div>
            <div className="text-xs text-gray-400">Scanné il y a 3 min</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button className="flex-1 py-2.5 px-4 rounded-lg bg-gray-900 text-white font-sans text-sm font-semibold hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-180 shadow-lg">
            ✅ &nbsp;Marquer terminé
          </button>
          <button className="flex-1 py-2.5 px-4 rounded-lg bg-red-50 text-red-500 font-sans text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-180">
            ⏭ &nbsp;Passer au suivant
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
          <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">07</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Anonyme · Device #4F2A</div>
            <div className="text-xs text-gray-400">Android · Tiré à 10:14</div>
          </div>
          <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-green-50 text-green-600 ml-2">En chaise</span>
          <div className="text-xs text-gray-400 ml-auto">3 min</div>
        </div>
        <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">08</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Youssef Amrani</div>
            <div className="text-xs text-gray-400">iOS · Compte client</div>
          </div>
          <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-amber-50 text-amber-700 ml-2">Présent</span>
          <div className="text-xs text-gray-400 ml-auto">12 min</div>
        </div>
        <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">09</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Anonyme · Device #B91C</div>
            <div className="text-xs text-gray-400">Android · Tiré à 10:28</div>
          </div>
          <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-gray-200 text-gray-400 ml-2">En attente</span>
          <div className="text-xs text-gray-400 ml-auto">26 min</div>
        </div>
        <div className="flex items-center gap-3.5 py-3 px-[22px] hover:bg-gray-50 transition-colors duration-150 cursor-default">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">10</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Anonyme · Device #3D7F</div>
            <div className="text-xs text-gray-400">Web · Tiré à 10:35</div>
          </div>
          <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-gray-200 text-gray-400 ml-2">En attente</span>
          <div className="text-xs text-gray-400 ml-auto">33 min</div>
        </div>
      </div>
    </div>
  )
}

