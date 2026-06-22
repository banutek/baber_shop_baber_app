import type React from 'react'

export interface IHistoryItemComponentProps {
  icon: string
  iconType: string
  text: string
  time: string
  duration?: number | string
  durationType?: string
}

export const HistoryItemComponent: React.FC<IHistoryItemComponentProps> = ({
  icon,
  iconType,
  text,
  time,
  duration,
  durationType,
}) => {
  const getIconBg = () => {
    if (iconType === 'green') return 'bg-green-50'
    if (iconType === 'red') return 'bg-red-50'
    if (iconType === 'amber') return 'bg-amber-50'
    return 'bg-gray-50'
  }

  const getDurationColor = () => {
    if (durationType === 'red') return 'bg-red-50 text-red-500'
    return 'bg-green-50 text-green-600'
  }

  console.log({ duration })

  return (
    <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-lg shadow-lg animate-fadeUp">
      <div
        className={`w-8 h-8 rounded-full ${getIconBg()} flex items-center justify-center text-sm flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-900 font-semibold">{text}</strong>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
      {duration && (
        <div className={`text-xs font-semibold py-0.5 px-2 rounded-full ${getDurationColor()}`}>
          {duration}
        </div>
      )}
    </div>
  )
}
