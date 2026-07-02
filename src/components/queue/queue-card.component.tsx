import React from 'react'

import { useElapsedMinutes } from '../../hooks/use-elapsed-minutes.hook'

export interface IQueueCardComponentProps {
  default_props?: boolean
  default_method?: () => void
  number: string
  name: string
  meta: string[]
  badge: string
  sideColor: string
  elapsed: Date | string
  isActive?: boolean
  badgeColorClass: string
}

export const QueueCardComponent: React.FC<IQueueCardComponentProps> = ({
  number,
  name,
  meta,
  badge,
  sideColor,
  elapsed,
  isActive,
  badgeColorClass,
}) => {
  const currentNumberElapsedMin = useElapsedMinutes(elapsed)
  // const getSideColor = () => {
  //   if (badgeType === 'amber') return 'bg-amber-600'
  //   if (badgeType === 'green') return 'bg-green-500'
  //   if (badgeType === 'red') return 'bg-red-500'
  //   return 'bg-gray-200'
  // }

  const getAvatarType = () => {
    if (name.includes('Youssef') || name.includes('Karim')) return 'bg-blue-50 text-blue-600'
    return 'bg-gray-200 text-gray-400'
  }

  const getAvatarText = () => {
    if (name.includes('Youssef')) return 'Y'
    if (name.includes('Karim')) return 'K'
    return '?'
  }

  // const getBadgeColor = () => {
  //   if (badgeType === 'amber') return 'bg-amber-50 text-amber-700'
  //   if (badgeType === 'green') return 'bg-green-50 text-green-600'
  //   if (badgeType === 'blue') return 'bg-blue-50 text-blue-600'
  //   return 'bg-gray-200 text-gray-400'
  // }

  return (
    <div className="queue-card bg-white rounded-2xl shadow-lg overflow-hidden flex items-stretch transform hover:-translate-y-0.5 transition-all duration-180 hover:shadow-xl cursor-default animate-fadeUp">
      <div className={`w-1 sm:w-1.5 flex-shrink-0 ${sideColor}`} />
      <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-y-0 gap-x-2 sm:gap-x-4 pt-2 pb-1.5 px-2.5 sm:p-4 flex-1 min-w-0">
        {/* Ligne 1 : numéro + avatar + nom + badge (mobile) */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div
            className={`font-serif text-lg sm:text-2xl ${isActive ? 'text-amber-700' : 'text-gray-400'} leading-none min-w-[28px] sm:min-w-[42px]`}
          >
            {number}
          </div>
          <div
            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full ${getAvatarType()} flex items-center justify-center text-xs sm:text-base flex-shrink-0 font-semibold`}
          >
            {getAvatarText()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{name}</div>
          </div>
          <span
            className={`text-[10px] sm:text-xs font-semibold py-0.5 sm:py-1 px-1.5 sm:px-2.5 rounded-full whitespace-nowrap sm:hidden ${badgeColorClass}`}
          >
            {badge}
          </span>
        </div>

        {/* Ligne 2 : meta + badge (desktop) + temps + bouton */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <div className="flex-1 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 min-w-0">
            {meta.map((item, index) => (
              <React.Fragment key={index}>
                <span className="whitespace-nowrap">{item}</span>
                {index < meta.length - 1 && (
                  <div className="w-0.5 h-0.5 rounded-full bg-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          <span
            className={`text-[10px] sm:text-xs font-semibold py-0.5 sm:py-1 px-1.5 sm:px-2.5 rounded-full whitespace-nowrap hidden sm:inline ${badgeColorClass}`}
          >
            {badge}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {currentNumberElapsedMin} min
          </span>
          <button className="skip-btn opacity-0 bg-red-50 text-red-500 border-none rounded-lg px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold cursor-pointer transition-opacity duration-180 whitespace-nowrap hover:bg-red-500 hover:text-white flex-shrink-0">
            Sauter
          </button>
        </div>
      </div>
    </div>
  )
}
