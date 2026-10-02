import type React from 'react'

import { EditShopInfosComponent } from './available-views/edit-shop-infos.component'
import { EditPersonInfosComponent } from './available-views/edit-perso-infos.component'
import { ServicesProvidedComponent } from './available-views/services-provided.component'

export interface IProfileEditComponentProps {
  onCancel: () => void
}

export const ProfileEditComponent: React.FC<IProfileEditComponentProps> = ({ onCancel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-gray-900">✏️ Modifier le profil</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium cursor-pointer"
        >
          Annuler
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* ── Infos personnelles ── */}
        <EditPersonInfosComponent />

        {/* ── Infos du salon ── */}
        <EditShopInfosComponent />

        {/* ── Gestion des services ── */}
        <ServicesProvidedComponent />
      </div>
    </div>
  )
}
