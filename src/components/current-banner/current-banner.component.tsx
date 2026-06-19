import type React from 'react'
import { useLocation } from 'react-router-dom'

import { ConfirmTooltip } from '../base/confirm-tooltip.component'

export interface ICurrentBannerComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const CurrentBannerComponent: React.FC<ICurrentBannerComponentProps> = () => {
  const { pathname } = useLocation()

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 flex items-center gap-5 mb-5 relative animate-fadeUp">
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8a96e' fill-opacity='0.07'%3E%3Cpath d='M20 20h4v4h-4zM0 0h4v4H0zM0 20h4v4H0zM20 0h4v4h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="font-serif text-6xl text-amber-600 leading-none relative">07</div>
      <div className="flex-1 relative">
        <div className="text-xs text-white/50 uppercase tracking-wider">En chaise maintenant</div>
        <div className="text-lg font-semibold text-white my-1">Anonyme · Device #4F2A</div>
        <div className="text-xs text-white/50">Android · Scanné à 10:38 · il y a 6 min</div>
      </div>
      {pathname != '/history' && (
        <div className="flex flex-col gap-2 relative max-sm:flex-row max-sm:w-full">
          <ConfirmTooltip
            onConfirm={() => {}}
            message="Êtes-vous sûr de vouloir marquer ce client comme terminé ?"
          >
            <button className="px-4.5 py-2 rounded-lg bg-amber-600 text-gray-900 font-sans text-xs font-semibold hover:bg-amber-500 transform hover:-translate-y-0.5 transition-all duration-180 whitespace-nowrap">
              ✅ Terminé
            </button>
          </ConfirmTooltip>
          <ConfirmTooltip
            onConfirm={() => {}}
            message="Êtes-vous sûr de vouloir passer ce client ?"
          >
            <button className="px-4.5 py-2 rounded-lg bg-white/10 text-white border border-white/20 font-sans text-xs font-semibold hover:bg-white/18 transition-all duration-180 whitespace-nowrap">
              ⏭ Passer
            </button>
          </ConfirmTooltip>
        </div>
      )}
    </div>
  )
}
