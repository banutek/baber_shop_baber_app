import type React from 'react'
import { useEffect } from 'react'

import {
  CurrentBannerComponent,
  FiltersNavComponent,
  HistoryListComponent,
  QueueGridComponent,
  StatsRowComponent,
  TopBarComponent,
} from '../../components'
import { AuthGuard } from '../../guards'
import { useGetShopByManagerHook, useGetWaitingListByShopHook } from '../../hooks'
import { useShopStore } from '../../stores'

export interface IWaitingListProps {
  default_props?: boolean
  default_method?: () => void
}

export const WaitingListPage: React.FC<IWaitingListProps> = () => {
  const { setCurrentWaitingList, setCurrentShop, currentShop } = useShopStore()
  const { data } = useGetShopByManagerHook()
  const { data: waitingListData } = useGetWaitingListByShopHook(currentShop?.id as string)

  useEffect(() => {
    if (data) {
      setCurrentShop(data.data.shop)
    }
  }, [data, setCurrentShop])

  useEffect(() => {
    if (waitingListData?.data?.waitingList) {
      setCurrentWaitingList(waitingListData.data.waitingList)
    }
  }, [waitingListData, setCurrentWaitingList])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); } 
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeUp {
            animation: fadeUp 0.35s ease both;
          }
          .q-card:hover .q-skip-btn {
            opacity: 1;
          }
        `}</style>

        <TopBarComponent title="File d'attente complète" />

        <div className="max-w-4xl mx-auto px-5 py-6">
          <StatsRowComponent />
          <FiltersNavComponent />
          <CurrentBannerComponent />
          <QueueGridComponent />
          <HistoryListComponent />
        </div>
      </div>
    </AuthGuard>
  )
}
