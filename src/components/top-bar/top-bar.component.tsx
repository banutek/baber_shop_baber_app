import type React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface ITopBarComponentProps {
  default_props?: boolean
  default_method?: () => void
  title?: string
}

export const TopBarComponent: React.FC<ITopBarComponentProps> = ({ title }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-[100]">
      {pathname === '/' ? (
        <div className="font-serif text-xl text-gray-900 tracking-tight">
          Queue<span className="text-amber-600">Flow</span>
        </div>
      ) : (
        <>
          <button
            className="w-9 h-9 rounded-full bg-gray-50 text-gray-900 flex items-center justify-center text-base hover:bg-amber-50 transition-all duration-200 flex-shrink-0"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <div className="flex-1">
            <div className="font-serif text-base text-gray-900">{title}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              Salon Baraka · Aujourd&rsquo;hui, mercredi 3 juin
            </div>
          </div>
        </>
      )}
      <div className="flex gap-2 items-center">
        {pathname === '/' ? (
          <>
            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center text-base hover:bg-amber-50 hover:text-amber-700 transition-all duration-200">
                🔔
              </button>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600 border-2 border-white" />
            </div>
            <button className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center text-base hover:bg-amber-50 hover:text-amber-700 transition-all duration-200">
              ⚙️
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
            En direct
          </div>
        )}
      </div>
    </div>
  )
}
