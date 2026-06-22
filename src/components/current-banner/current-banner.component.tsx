import type React from 'react'
import { useLocation } from 'react-router-dom'

import { type IWaitingListNumbersDtoOut, WaitingListNumberStatus } from '../../dto'
import { type IUpdateListNumberStatusHookParams, useUpdateListNumberStatusHook } from '../../hooks'
import { useElapsedMinutes } from '../../hooks/use-elapsed-minutes.hook'
import { useShopStore, useWaitingListNumberStore } from '../../stores'
import { ConfirmTooltip } from '../base/confirm-tooltip.component'

export interface ICurrentBannerComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const CurrentBannerComponent: React.FC<ICurrentBannerComponentProps> = () => {
  const { CREATED, PENDING, NEXT, IN_PROGRESS, COMPLETED, MISSING } = WaitingListNumberStatus
  const { setShowNextNumberModal, setNextNumber } = useWaitingListNumberStore()
  const { pathname } = useLocation()
  const { currentWaitingList } = useShopStore()

  const { mutate: doUpdateListNumberStatus } = useUpdateListNumberStatusHook()
  const currentNumber = currentWaitingList?.waiting_list_numbers?.find(
    (_) => Number(_.value) === currentWaitingList?.current_number,
  )
  const isCurrentNumberGreaterThanZero = (currentWaitingList?.current_number ?? 0) > 0
  const firstNumberStatus = currentWaitingList?.waiting_list_numbers
    ? currentWaitingList.waiting_list_numbers[0]?.status
    : undefined
  const currentDevice = currentNumber?.deviceId
  const currentNumberElapsedMin = useElapsedMinutes(currentNumber?.createdAt)

  const handleOpenNextNumberModal = (number: IWaitingListNumbersDtoOut) => {
    setNextNumber(number)
    setShowNextNumberModal(true)
  }

  const handleOpenService = (currentStatusToHave: WaitingListNumberStatus) => {
    if (!currentNumber && firstNumberStatus !== CREATED) return
    // TODO: Marquer le client comme terminé
    if (currentNumber?.status !== IN_PROGRESS || !isCurrentNumberGreaterThanZero) {
      const next = getNextNumber(currentWaitingList?.current_number)
      if (next !== -1) {
        handleOpenNextNumberModal(next)
      }
      return
    }
    let requestDatas: IUpdateListNumberStatusHookParams
    if (currentNumber?.status == IN_PROGRESS && currentStatusToHave === COMPLETED) {
      requestDatas = {
        numberId: currentNumber.id,
        datas: {
          status: COMPLETED,
        },
      }
    } else {
      requestDatas = {
        numberId: currentNumber.id,
        datas: {
          status: currentStatusToHave,
        },
      }
    }
    doUpdateListNumberStatus(requestDatas, {
      onSuccess: (data) => {
        if (data.data.waitingListNumber) {
          currentNumber.status = currentStatusToHave
        }
        const next = getNextNumber(currentWaitingList?.current_number)
        if (next !== -1) {
          handleOpenNextNumberModal(next)
        }
      },
      onError: (error) => {
        console.log('List number status not updated', error)
      },
    })
  }

  const getNextNumber = (currentValue?: number): IWaitingListNumbersDtoOut | -1 => {
    const numbers = currentWaitingList?.waiting_list_numbers?.filter((item) =>
      [CREATED, PENDING, NEXT].includes(item.status),
    )
    if (!numbers?.length) return -1

    const sortedNumbers = [...numbers].sort((a, b) => Number(a.value) - Number(b.value))
    const effectiveCurrentValue = currentValue ?? Number(currentWaitingList?.current_number ?? 0)

    if (effectiveCurrentValue <= 0) {
      return sortedNumbers[0] || -1
    }

    const currentIndex = sortedNumbers.findIndex(
      (item) => Number(item.value) === effectiveCurrentValue,
    )
    if (currentIndex < 0) {
      return sortedNumbers.find((item) => Number(item.value) > effectiveCurrentValue) || -1
    }

    return sortedNumbers[currentIndex + 1] || -1
  }

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
      <div className="font-serif text-6xl text-amber-600 leading-none relative">
        {currentNumber?.value ?? 'Aucun'}
      </div>
      <div className="flex-1 relative">
        {currentNumber?.status === COMPLETED ? (
          <div className="text-xs text-green-400 font-bold uppercase tracking-wide">
            Client servis
          </div>
        ) : (
          <div className="text-xs text-white/50 uppercase tracking-wider">En chaise maintenant</div>
        )}

        {/* <div className="text-xs text-white/50">Android · Scanné à 10:38 · il y a 6 min</div> */}
        {currentNumber && (
          <>
            <div className="text-lg font-semibold text-white my-1">{`Client #${currentDevice}`}</div>
            <div className="text-xs text-white/50">{`${currentNumber?.device?.platform} · il y'a ${currentNumberElapsedMin} min`}</div>
          </>
        )}
      </div>
      {pathname != '/history' && (
        <div className="flex flex-col gap-2 relative max-sm:flex-row max-sm:w-full">
          {(currentNumber?.status == IN_PROGRESS || firstNumberStatus == CREATED) && (
            <ConfirmTooltip
              onConfirm={() =>
                handleOpenService(firstNumberStatus == CREATED ? IN_PROGRESS : COMPLETED)
              }
              message="Êtes-vous sûr de vouloir marquer ce client comme terminé ?"
            >
              <button className="px-4.5 py-2 rounded-lg bg-amber-600 text-gray-900 font-sans text-xs font-semibold hover:bg-amber-500 transform hover:-translate-y-0.5 transition-all duration-180 whitespace-nowrap">
                ✅ Terminé
              </button>
            </ConfirmTooltip>
          )}
          {currentNumber?.status !== IN_PROGRESS && (
            <ConfirmTooltip
              onConfirm={() => handleOpenService(MISSING)}
              message="Êtes-vous sûr de vouloir passer ce client ?"
            >
              <button className="px-4.5 py-2 rounded-lg bg-white/10 text-white border border-white/20 font-sans text-xs font-semibold hover:bg-white/18 transition-all duration-180 whitespace-nowrap">
                ⏭ Passer au suivant
              </button>
            </ConfirmTooltip>
          )}
        </div>
      )}
    </div>
  )
}
