import type React from 'react'
import { useNavigate } from 'react-router-dom'

import { ShopOpenStatus } from '../../dto'
import { useAutoCloseShopHook, useUpdateShopStatusHook } from '../../hooks'
import { useAuthStore, useShopStore } from '../../stores'
import { prefixer } from '../../services'
import { useMemo } from 'react'
import { truncateAtNthComma } from '../../utils'

export interface IProfileComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const ProfileCardComponent: React.FC<IProfileComponentProps> = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()
  const { currentShop } = useShopStore()

  const { mutate: doUpdateShopStatus } = useUpdateShopStatusHook()
  const shortLocation = useMemo(
    () => currentShop?.address && truncateAtNthComma(currentShop?.address, 2),
    [currentShop],
  )

  // Fermeture automatique du salon à l'heure définie dans shop.hours
  useAutoCloseShopHook({
    shop: currentShop,
    onAutoCloseSuccess: () => {
      localStorage.removeItem('user')
      navigate('/login')
    },
    onAutoCloseError: (error) => {
      console.error('[ProfileCard] Auto-close failed:', error)
    },
  })

  const doLogout = () => {
    handleUpdateShopStatus(currentShop?.id as string)
  }

  const handleUpdateShopStatus = (shopId: string) => {
    const requestDatas = {
      shopId: shopId,
      datas: {
        openStatus: ShopOpenStatus.CLOSED,
      },
    }
    doUpdateShopStatus(requestDatas, {
      onSuccess: () => {
        localStorage.removeItem('user')
        navigate('/login')
      },
      onError: (error) => {
        console.log('Shop status not updated', error)
      },
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-7 text-center relative">
        <div className="absolute inset-0 opacity-6">
          <div
            className="w-full h-full bg-contain bg-center"
            style={{
              backgroundImage: `url(${prefixer.replace(/\/api\/v1\/?$/, '')}${currentShop?.profileImage})`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative">
          <div className="relative inline-block mb-3.5">
            <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center font-serif text-3xl text-white border-[3px] border-white/15 shadow-lg">
              {`${currentUser?.user?.firstName?.[0] || ''}${currentUser?.user?.lastName?.[0] || ''}`.toUpperCase()}
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-[3px] border-gray-900 animate-pulse" />
          </div>
          <div className="font-serif text-xl text-white mb-1">{`${currentUser?.user?.firstName} ${currentUser?.user?.lastName}`}</div>
          <div className="text-xs text-amber-500 uppercase tracking-wider font-medium">
            {`${currentUser?.user?.role} · ${currentShop?.name}`}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2.5 py-2.5 border-b border-gray-200 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            📍
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Salon</span>
            <span className="font-medium text-gray-900">{`${currentShop?.name} — ${shortLocation}`}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 border-b border-gray-200 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            📅
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Membre depuis</span>
            <span className="font-medium text-gray-900">Mars 2024</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 border-b border-gray-200 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            🕐
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Prise de service</span>
            <span className="font-medium text-gray-900">
              {currentShop?.hours || '09:00 — 19:00'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            📱
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Téléphone</span>
            <span className="font-medium text-gray-900">{currentShop?.phone}</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 rounded-lg border-2 border-amber-600 bg-transparent text-amber-700 font-sans text-sm font-semibold hover:bg-amber-50 transition-all duration-200 tracking-wide">
          ✏️ &nbsp; Modifier le profil
        </button>
        <button
          onClick={doLogout}
          className="w-full mt-2.5 py-2.5 rounded-lg bg-red-500 text-white font-sans text-sm font-semibold hover:bg-red-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          🚪 &nbsp; Se déconnecter
        </button>
      </div>
    </div>
  )
}
