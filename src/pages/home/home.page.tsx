import type React from 'react'
import { useEffect, useState } from 'react'

import {
  ProfileCardComponent,
  ProfileEditComponent,
  QueueRecapComponent,
  StatsRowComponent,
  TopBarComponent,
} from '../../components'
import { type IWaitingListNumbersDtoOut } from '../../dto'
import { AuthGuard } from '../../guards'
import { useGetShopByManagerHook, useWaitingListNumberSocket } from '../../hooks'
import { useShopStore, useWaitingListNumberStore } from '../../stores'

export interface IHomePageProps {
  default_props?: boolean
  default_method?: () => void
}

export const HomePage: React.FC<IHomePageProps> = () => {
  const { currentShop, setCurrentShop } = useShopStore()
  const { setShowNextNumberModal, setNextNumber } = useWaitingListNumberStore()
  const { data } = useGetShopByManagerHook()

  // Toggle entre la file d'attente et l'édition du profil
  const [showProfileEdit, setShowProfileEdit] = useState(false)

  // WebSocket temps réel — écoute les événements de numbers dans la waiting list
  useWaitingListNumberSocket()

  useEffect(() => {
    if (data) {
      setCurrentShop(data.data.shop)
    }
  }, [data, setCurrentShop])

  const handleOpenNextNumberModal = (number: IWaitingListNumbersDtoOut) => {
    setNextNumber(number)
    setShowNextNumberModal(true)
  }

  const handleEditProfile = () => {
    setShowProfileEdit(true)
  }

  const handleProfileCancel = () => {
    setShowProfileEdit(false)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 0.4s ease both;
          }
        `}</style>

        <TopBarComponent notificationShopId={currentShop?.id} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 sm:px-6 py-7">
          {/* Main Content */}
          <main className="md:col-span-8 flex flex-col gap-5">
            {showProfileEdit ? (
              <ProfileEditComponent onCancel={handleProfileCancel} />
            ) : (
              <QueueRecapComponent onOpenNextNumberModal={handleOpenNextNumberModal} />
            )}
          </main>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <ProfileCardComponent onEditProfile={handleEditProfile} />
            <StatsRowComponent />
          </aside>
        </div>
      </div>
    </AuthGuard>
  )
}
