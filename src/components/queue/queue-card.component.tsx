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
      <div className={`w-1.5 flex-shrink-0 ${sideColor}`} />
      <div className="flex items-center gap-4 p-4 flex-1">
        <div
          className={`font-serif text-2xl ${isActive ? 'text-amber-700' : 'text-gray-400'} leading-none min-w-[42px]`}
        >
          {number}
        </div>
        <div
          className={`w-10 h-10 rounded-full ${getAvatarType()} flex items-center justify-center text-base flex-shrink-0 font-semibold`}
        >
          {getAvatarText()}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
            {meta.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>
                {index < meta.length - 1 && (
                  <div className="w-0.5 h-0.5 rounded-full bg-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-xs font-semibold py-1 px-2.5 rounded-full whitespace-nowrap ${badgeColorClass}`}
          >
            {badge}
          </span>
          <span className="text-xs text-gray-400">{currentNumberElapsedMin} min</span>
          <button className="skip-btn opacity-0 bg-red-50 text-red-500 border-none rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-opacity duration-180 whitespace-nowrap hover:bg-red-500 hover:text-white">
            Sauter
          </button>
        </div>
      </div>
    </div>
  )
}
