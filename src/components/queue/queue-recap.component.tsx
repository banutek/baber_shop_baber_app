import type React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  type INewWaitingListDtoIn,
  type IWaitingListNumbersDtoOut,
  ShopOpenStatus,
  WaitingListNumberStatus,
  WaitingListStatusEnum,
} from '../../dto'
import { statusListNumberConfig } from '../../dto/maps'
import {
  type IUpdateListNumberStatusHookParams,
  useCreateNewWaitingListHook,
  useGetWaitingListByShopHook,
  useUpdateListNumberStatusHook,
  useUpdateShopStatusHook,
  useUpdateWaitingListStatusHook,
} from '../../hooks'
import { useShopStore } from '../../stores'
import { ConfirmTooltip } from '../base/confirm-tooltip.component'

export interface IQueueRecapComponentProps {
  default_props?: boolean
  default_method?: () => void
  onOpenNextNumberModal?: (numbers: IWaitingListNumbersDtoOut) => void
}

export const QueueRecapComponent: React.FC<IQueueRecapComponentProps> = ({
  onOpenNextNumberModal,
}) => {
  const navigate = useNavigate()
  const { CREATED, PENDING, NEXT, IN_PROGRESS, COMPLETED, MISSING } = WaitingListNumberStatus

  const { currentShop, setCurrentShop, currentWaitingList, setCurrentWaitingList } = useShopStore()
  const isCurrentNumberGreaterThanZero = (currentWaitingList?.current_number ?? 0) > 0
  const currentNumber = currentWaitingList?.waiting_list_numbers?.find(
    (_) => Number(_.value) === currentWaitingList?.current_number,
  )
  const currentDevice = currentNumber?.deviceId
  const firstNumberStatus = currentWaitingList?.waiting_list_numbers
    ? currentWaitingList.waiting_list_numbers[0]?.status
    : undefined

  const { mutate: doCreateNewWaitingList } = useCreateNewWaitingListHook()
  const { mutate: doUpdateWaitingListStatus } = useUpdateWaitingListStatusHook()
  const { mutate: doUpdateShopStatus } = useUpdateShopStatusHook()
  const { data: waitingListData } = useGetWaitingListByShopHook(currentShop?.id as string)
  const { mutate: doUpdateListNumberStatus } = useUpdateListNumberStatusHook()

  useEffect(() => {
    if (waitingListData?.data?.waitingList) {
      setCurrentWaitingList(waitingListData.data.waitingList)
    }
  }, [waitingListData, setCurrentWaitingList])

  const handleOpenWaitingList = () => {
    if (!currentShop?.id) return
    const currentList = currentShop.barber_shop_waiting_list.find(
      (_) => new Date(_.createdAt).getDay() === new Date().getDay(),
    )
    if (currentList) {
      const requestDatas = {
        listId: currentList.id,
        datas: {
          status: WaitingListStatusEnum.OPEN,
        },
      }
      doUpdateWaitingListStatus(requestDatas, {
        onSuccess: (data) => {
          if (data.data?.waitingList) {
            handleUpdateShopStatus(currentShop.id)
            setCurrentWaitingList(data.data.waitingList)
          }
        },
        onError: (error) => {
          console.log('Waiting list not updated', error)
        },
      })
      return
    }
    const requestDatas: INewWaitingListDtoIn = {
      current_number: 0,
      session_date: new Date(),
      status: WaitingListStatusEnum.OPEN,
      barberShopId: currentShop.id,
    }
    doCreateNewWaitingList(requestDatas, {
      onSuccess: (data) => {
        if (data.data?.waitingList) {
          handleUpdateShopStatus(currentShop.id)
          setCurrentWaitingList(data.data.waitingList)
        }
      },
      onError: (error) => {
        console.log('Waiting list not opened', error)
      },
    })
  }

  const handleUpdateShopStatus = (shopId: string) => {
    const requestDatas = {
      shopId: shopId,
      datas: {
        openStatus: ShopOpenStatus.OPEN,
      },
    }
    doUpdateShopStatus(requestDatas, {
      onSuccess: (data) => {
        if (data.data?.shop) {
          setCurrentShop(data.data.shop)
        }
      },
      onError: (error) => {
        console.log('Shop status not updated', error)
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

  const handleOpenService = (currentStatusToHave: WaitingListNumberStatus) => {
    if (!currentNumber && firstNumberStatus !== CREATED) return
    // TODO: Marquer le client comme terminé
    if (currentNumber?.status !== IN_PROGRESS || !isCurrentNumberGreaterThanZero) {
      const next = getNextNumber(currentWaitingList?.current_number)
      if (next !== -1 && onOpenNextNumberModal) {
        onOpenNextNumberModal(next)
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
        if (next !== -1 && onOpenNextNumberModal) {
          onOpenNextNumberModal(next)
        }
      },
      onError: (error) => {
        console.log('List number status not updated', error)
      },
    })
  }

  console.log({ currentWaitingList })

  return (
    <div className="bg-white rounded-2xl shadow-lg animate-slideUp">
      <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-gray-200">
        <div>
          <div className="font-serif text-base text-gray-900">File d&rsquo;attente</div>
          <div className="text-xs text-red-400 uppercase">
            {currentShop?.openStatus === ShopOpenStatus.OPEN ? '' : 'Vous êtes fermé'}
          </div>
        </div>
        {currentShop?.openStatus === ShopOpenStatus.OPEN ? (
          <div
            className="text-xs text-amber-700 font-semibold cursor-pointer uppercase tracking-wide"
            onClick={() => navigate('/waiting-list')}
          >
            Tout voir
          </div>
        ) : (
          <ConfirmTooltip
            onConfirm={handleOpenWaitingList}
            message="Êtes-vous sûr de vouloir ouvrir la file d&rsquo;attente ?"
          >
            <div className="text-xs text-green-700 font-bold cursor-pointer uppercase tracking-wide">
              Ouvrir la file d&rsquo;attente
            </div>
          </ConfirmTooltip>
        )}
      </div>
      {currentShop?.openStatus === ShopOpenStatus.OPEN && (
        <div className="p-[18px]">
          {isCurrentNumberGreaterThanZero ? (
            <div className="flex items-center gap-3.5 bg-gray-50 rounded-lg p-3.5 mb-4">
              <div className="font-serif text-5xl text-amber-700 leading-none">
                {currentWaitingList?.current_number}
              </div>
              <div className="flex-1">
                {currentNumber?.status == IN_PROGRESS ? (
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Client actuel</div>
                ) : currentNumber?.status == COMPLETED ? (
                  <div className="text-xs text-green-400 font-bold uppercase tracking-wide">
                    Client servit
                  </div>
                ) : (
                  <div className="text-xs text-red-400 font-bold uppercase tracking-wide">
                    Client sauté
                  </div>
                )}
                <div className="text-base font-semibold text-gray-900 my-0.5">{`Client #${currentDevice}`}</div>
                <div className="text-xs text-gray-400">Scanné il y a 3 min</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3.5 bg-gray-50 rounded-lg p-3.5 mb-4">
              <div className="font-serif text-5xl text-amber-700 leading-none">
                {currentWaitingList?.waiting_list_numbers?.length === 0
                  ? 'Pas encore en service'
                  : 'Aucun client en chaise pour le moment'}
              </div>
            </div>
          )}
          <div className="flex gap-2.5">
            {(currentNumber?.status == IN_PROGRESS || firstNumberStatus == CREATED) && (
              <ConfirmTooltip
                className="flex-1"
                onConfirm={() =>
                  handleOpenService(firstNumberStatus == CREATED ? IN_PROGRESS : COMPLETED)
                }
                message={
                  isCurrentNumberGreaterThanZero
                    ? 'Êtes-vous sûr de vouloir marquer ce client comme terminé ?'
                    : 'Êtes-vous sûr de vouloir débuter le service ?'
                }
                disabled={currentWaitingList?.waiting_list_numbers?.length === 0}
              >
                <button
                  disabled={currentWaitingList?.waiting_list_numbers?.length === 0}
                  className="w-full py-2.5 px-4 rounded-lg bg-gray-900 text-white font-sans text-sm font-semibold hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-180 shadow-lg disabled:bg-dark-card disabled:text-white/30 disabled:cursor-not-allowed disabled:hover:bg-dark-card"
                >
                  ✅ {isCurrentNumberGreaterThanZero ? 'Marquer terminé' : 'Débuter'}
                </button>
              </ConfirmTooltip>
            )}
            {isCurrentNumberGreaterThanZero && (
              <ConfirmTooltip
                className="flex-1"
                onConfirm={() => handleOpenService(MISSING)}
                message="Êtes-vous sûr de vouloir passer ce client ? Il sera marqué comme absent."
              >
                <button className="w-full py-2.5 px-4 rounded-lg bg-red-50 text-red-500 font-sans text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-180">
                  ⏭ &nbsp;Passer au suivant
                </button>
              </ConfirmTooltip>
            )}
          </div>
        </div>
      )}
      {(currentWaitingList?.waiting_list_numbers?.length ?? 0) > 0 && (
        <div className="flex flex-col">
          {/* <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">07</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Anonyme · Device #4F2A</div>
              <div className="text-xs text-gray-400">Android · Tiré à 10:14</div>
            </div>
            <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-green-50 text-green-600 ml-2">En chaise</span>
            <div className="text-xs text-gray-400 ml-auto">3 min</div>
          </div> */}
          {/* <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">08</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Youssef Amrani</div>
              <div className="text-xs text-gray-400">iOS · Compte client</div>
            </div>
            <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-amber-50 text-amber-700 ml-2">Présent</span>
            <div className="text-xs text-gray-400 ml-auto">12 min</div>
          </div> */}
          {currentWaitingList?.waiting_list_numbers?.map((number, index) => (
            <div
              key={index}
              className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-full ${statusListNumberConfig[number.status]?.badgeColor} flex items-center justify-center text-sm font-semibold flex-shrink-0`}
              >
                {number.value}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Client #{number.deviceId}</div>
                <div className="text-xs text-gray-400">
                  {number?.device?.platform} · Tiré à{' '}
                  {new Date(number.createdAt).toLocaleTimeString('fr-FR')}
                </div>
              </div>
              <span
                className={`text-xs font-semibold py-0.5 px-2.5 rounded-full ${statusListNumberConfig[number?.status]?.className} ml-2`}
              >
                {statusListNumberConfig[number?.status]?.label}
              </span>
              <div className="text-xs text-gray-400 ml-auto">{number.value} min</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
