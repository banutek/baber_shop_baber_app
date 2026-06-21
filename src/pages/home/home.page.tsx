import type React from 'react'
import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

import {
  ActivitySectionComponent,
  ConfirmTooltip,
  ProfileCardComponent,
  QueueRecapComponent,
  StatsRowComponent,
  TopBarComponent,
} from '../../components'
import { type IWaitingListNumbersDtoOut, WaitingListNumberStatus } from '../../dto'
import { AuthGuard } from '../../guards'
import { type IUpdateListNumberStatusHookParams, useGetShopByManagerHook } from '../../hooks'
import { useUpdateListNumberStatusHook, useUpdateWaitingListInfosHook } from '../../hooks'
import { useShopStore } from '../../stores'

export interface IHomePageProps {
  default_props?: boolean
  default_method?: () => void
}

export const HomePage: React.FC<IHomePageProps> = () => {
  const { currentShop, currentWaitingList, setCurrentShop, setCurrentWaitingList } = useShopStore()
  const { data } = useGetShopByManagerHook()
  const { mutate: doUpdateListNumberStatus } = useUpdateListNumberStatusHook()
  const { mutate: doUpdateWaitingListInfos } = useUpdateWaitingListInfosHook()

  // Modal state for next number
  const [showNextNumberModal, setShowNextNumberModal] = useState(false)
  const [nextNumber, setNextNumber] = useState<IWaitingListNumbersDtoOut | null>(null)

  useEffect(() => {
    if (data) {
      setCurrentShop(data.data.shop)
    }
  }, [data, setCurrentShop])

  const handleOpenNextNumberModal = (number: IWaitingListNumbersDtoOut) => {
    setNextNumber(number)
    setShowNextNumberModal(true)
  }

  const handleUpdateCurrentNumberStatus = (statusToHave: WaitingListNumberStatus) => {
    const requestDatas = {
      numberId: nextNumber?.id,
      datas: {
        status: statusToHave,
      },
    }
    doUpdateListNumberStatus(requestDatas as IUpdateListNumberStatusHookParams, {
      onSuccess: (data) => {
        if (data?.data?.waitingListNumber) {
          if (statusToHave === WaitingListNumberStatus.IN_PROGRESS) {
            handleTakeNextNumber()
            // Identifier le numéro suivant et le passer en NEXT
            const candidates = currentWaitingList?.waiting_list_numbers?.filter(
              (item) =>
                [WaitingListNumberStatus.CREATED, WaitingListNumberStatus.PENDING].includes(
                  item.status,
                ) && item.id !== nextNumber?.id,
            )
            if (candidates && candidates.length > 0) {
              const sorted = [...candidates].sort((a, b) => Number(a.value) - Number(b.value))
              const nextInLine = sorted.find(
                (item) => Number(item.value) > Number(nextNumber?.value ?? 0),
              )
              if (nextInLine) {
                doUpdateListNumberStatus({
                  numberId: nextInLine.id,
                  datas: { status: WaitingListNumberStatus.NEXT },
                } as IUpdateListNumberStatusHookParams)
              }
            }
          }
          doCloseModal()
        }
      },
      onError: (error) => {
        console.log('List number status not updated', error)
      },
    })
  }

  const handleTakeNextNumber = () => {
    if (!nextNumber) return
    const requestDatas = {
      listId: nextNumber.waitingListId,
      datas: {
        current_number: Number(nextNumber.value),
      },
    }
    doUpdateWaitingListInfos(requestDatas, {
      onSuccess: (data) => {
        setShowNextNumberModal(false)
        setNextNumber(null)
        setCurrentWaitingList(data?.data?.waitingList)
      },
      onError: (error) => {
        console.log('Waiting list infos not updated', error)
      },
    })
  }

  const doCloseModal = () => {
    setShowNextNumberModal(false)
    setNextNumber(null)
  }

  const handleAbsent = () => {
    handleUpdateCurrentNumberStatus(WaitingListNumberStatus.MISSING)
    setShowNextNumberModal(false)
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-6 py-7">
          {/* Sidebar */}
          <aside className="md:col-span-4">
            <ProfileCardComponent />
            <StatsRowComponent />
          </aside>

          {/* Main Content */}
          <main className="md:col-span-8 flex flex-col gap-5">
            <QueueRecapComponent onOpenNextNumberModal={handleOpenNextNumberModal} />
            <ActivitySectionComponent />
          </main>
        </div>

        {/* Modal - Numéro Suivant (au niveau de HomePage pour être au premier plan) */}
        {showNextNumberModal && nextNumber && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-gray-900">Prochain numéro</h3>
                <button
                  onClick={doCloseModal}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Numéro */}
              <div className="text-center mb-6">
                <div className="font-serif text-6xl font-bold text-green-600 mb-2">
                  {nextNumber.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Numéro suivant</div>
              </div>

              {/* Code-barres */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-center">
                  <QRCodeSVG
                    value={nextNumber.barcode} // "QF-007-A3F9C12D4E5B6F7A"
                    size={350}
                    level="H"
                    marginSize={2}
                  />
                </div>
                <div className="text-center text-sm text-gray-600 font-mono mt-2">
                  {nextNumber.barcode}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3">
                <ConfirmTooltip
                  onConfirm={handleAbsent}
                  message="Êtes-vous sûr de vouloir marquer ce client comme absent ?"
                  className="flex-1"
                >
                  <button className="flex-1 py-3 px-4 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">
                    🚫 Absent
                  </button>
                </ConfirmTooltip>
                <ConfirmTooltip
                  onConfirm={() =>
                    handleUpdateCurrentNumberStatus(WaitingListNumberStatus.IN_PROGRESS)
                  }
                  message="Êtes-vous sûr de vouloir servir ce client ?"
                  className="flex-1"
                >
                  <button className="flex-1 py-3 px-4 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors">
                    ✅ Servir
                  </button>
                </ConfirmTooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
