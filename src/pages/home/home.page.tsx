import type React from 'react'
import { useEffect } from 'react'

import {
  ProfileCardComponent,
  QueueRecapComponent,
  StatsRowComponent,
  TopBarComponent,
} from '../../components'
import { type IWaitingListNumbersDtoOut } from '../../dto'
import { AuthGuard } from '../../guards'
import { useGetShopByManagerHook } from '../../hooks'
import { useShopStore, useWaitingListNumberStore } from '../../stores'

export interface IHomePageProps {
  default_props?: boolean
  default_method?: () => void
}

export const HomePage: React.FC<IHomePageProps> = () => {
  const { currentShop, setCurrentShop } = useShopStore()
  const { setShowNextNumberModal, setNextNumber } = useWaitingListNumberStore()
  const { data } = useGetShopByManagerHook()
  // const { mutate: doUpdateListNumberStatus } = useUpdateListNumberStatusHook()
  // const { mutate: doUpdateWaitingListInfos } = useUpdateWaitingListInfosHook()

  // Modal state for next number
  // const [showNextNumberModal, setShowNextNumberModal] = useState(false)
  // const [nextNumber, setNextNumber] = useState<IWaitingListNumbersDtoOut | null>(null)

  useEffect(() => {
    if (data) {
      setCurrentShop(data.data.shop)
    }
  }, [data, setCurrentShop])

  const handleOpenNextNumberModal = (number: IWaitingListNumbersDtoOut) => {
    setNextNumber(number)
    setShowNextNumberModal(true)
  }

  // const handleUpdateCurrentNumberStatus = (statusToHave: WaitingListNumberStatus) => {
  //   const requestDatas = {
  //     numberId: nextNumber?.id,
  //     datas: {
  //       status: statusToHave,
  //     },
  //   }
  //   doUpdateListNumberStatus(requestDatas as IUpdateListNumberStatusHookParams, {
  //     onSuccess: (data) => {
  //       if (data?.data?.waitingListNumber) {
  //         if (statusToHave === WaitingListNumberStatus.IN_PROGRESS) {
  //           handleTakeNextNumber()
  //           // Identifier le numéro suivant et le passer en NEXT
  //           const candidates = currentWaitingList?.waiting_list_numbers?.filter(
  //             (item) =>
  //               [WaitingListNumberStatus.CREATED, WaitingListNumberStatus.PENDING].includes(
  //                 item.status,
  //               ) && item.id !== nextNumber?.id,
  //           )
  //           if (candidates && candidates.length > 0) {
  //             const sorted = [...candidates].sort((a, b) => Number(a.value) - Number(b.value))
  //             const nextInLine = sorted.find(
  //               (item) => Number(item.value) > Number(nextNumber?.value ?? 0),
  //             )
  //             if (nextInLine) {
  //               doUpdateListNumberStatus({
  //                 numberId: nextInLine.id,
  //                 datas: { status: WaitingListNumberStatus.NEXT },
  //               } as IUpdateListNumberStatusHookParams)
  //             }
  //           }
  //         }
  //         doCloseModal()
  //       }
  //     },
  //     onError: (error) => {
  //       console.log('List number status not updated', error)
  //     },
  //   })
  // }

  // const handleTakeNextNumber = () => {
  //   if (!nextNumber) return
  //   const requestDatas = {
  //     listId: nextNumber.waitingListId,
  //     datas: {
  //       current_number: Number(nextNumber.value),
  //     },
  //   }
  //   doUpdateWaitingListInfos(requestDatas, {
  //     onSuccess: (data) => {
  //       setShowNextNumberModal(false)
  //       setNextNumber(null)
  //       setCurrentWaitingList(data?.data?.waitingList)
  //     },
  //     onError: (error) => {
  //       console.log('Waiting list infos not updated', error)
  //     },
  //   })
  // }

  // const doCloseModal = () => {
  //   setShowNextNumberModal(false)
  //   setNextNumber(null)
  // }

  // const handleAbsent = () => {
  //   handleUpdateCurrentNumberStatus(WaitingListNumberStatus.MISSING)
  //   setShowNextNumberModal(false)
  // }

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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-6 py-7">
          {/* Sidebar */}
          <aside className="md:col-span-4">
            <ProfileCardComponent />
            <StatsRowComponent />
          </aside>

          {/* Main Content */}
          <main className="md:col-span-8 flex flex-col gap-5">
            <QueueRecapComponent onOpenNextNumberModal={handleOpenNextNumberModal} />
            {/* <ActivitySectionComponent /> */}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
