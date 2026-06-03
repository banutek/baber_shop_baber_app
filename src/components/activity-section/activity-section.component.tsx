import React from 'react'
import { useNavigate } from 'react-router-dom'

export interface IActivitySectionComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const ActivitySectionComponent: React.FC<IActivitySectionComponentProps> = () => {
  const navigate = useNavigate()
  
return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp" style={{ animationDelay: '0.14s' }}>
      <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-gray-200">
        <div className="font-serif text-base text-gray-900">Activité récente</div>
        <div className="text-xs text-amber-700 font-semibold cursor-pointer uppercase tracking-wide" onClick={() => navigate('/history')}>Historique</div>
      </div>
      <div className="py-2">
        <div className="flex items-center gap-3 py-3 px-[22px]">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
          <div className="text-xs text-gray-500 leading-relaxed flex-1">
            <strong className="text-gray-900 font-semibold">N°06</strong> terminé · Client servi en 21 min
          </div>
          <div className="text-xs text-gray-400 ml-auto whitespace-nowrap">10:41</div>
        </div>
        <div className="flex items-center gap-3 py-3 px-[22px]">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></div>
          <div className="text-xs text-gray-500 leading-relaxed flex-1">
            <strong className="text-gray-900 font-semibold">N°07</strong> a scanné le code-barres et est en chaise
          </div>
          <div className="text-xs text-gray-400 ml-auto whitespace-nowrap">10:38</div>
        </div>
        <div className="flex items-center gap-3 py-3 px-[22px]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
          <div className="text-xs text-gray-500 leading-relaxed flex-1">
            <strong className="text-gray-900 font-semibold">N°05</strong> sauté · Client absent, notification envoyée
          </div>
          <div className="text-xs text-gray-400 ml-auto whitespace-nowrap">10:17</div>
        </div>
        <div className="flex items-center gap-3 py-3 px-[22px]">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
          <div className="text-xs text-gray-500 leading-relaxed flex-1">
            <strong className="text-gray-900 font-semibold">Youssef A.</strong> a rejoint la file (compte client)
          </div>
          <div className="text-xs text-gray-400 ml-auto whitespace-nowrap">10:12</div>
        </div>
        <div className="flex items-center gap-3 py-3 px-[22px]">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
          <div className="text-xs text-gray-500 leading-relaxed flex-1">
            <strong className="text-gray-900 font-semibold">N°04</strong> terminé · Client servi en 16 min
          </div>
          <div className="text-xs text-gray-400 ml-auto whitespace-nowrap">09:58</div>
        </div>
      </div>
    </div>
  )
}
