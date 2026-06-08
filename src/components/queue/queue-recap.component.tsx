import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShopStore } from '../../stores'
import { useCreateNewWaitingListHook, useGetWaitingListByShopHook, useUpdateWaitingListStatusHook } from '../../hooks'
import { ShopOpenStatus, WaitingListStatusEnum, type INewWaitingListDtoIn, type IWaitingListNumbersDtoOut } from '../../dto'

export interface IQueueRecapComponentProps {
  default_props?: boolean
  default_method?: () => void
  onOpenNextNumberModal?: (numbers: IWaitingListNumbersDtoOut) => void
}

export const QueueRecapComponent: React.FC<IQueueRecapComponentProps> = ({ onOpenNextNumberModal }) => {
  const navigate = useNavigate()
  
  const { currentShop, setCurrentShop, currentWaitingList, setCurrentWaitingList } = useShopStore()
  const isCurrentNumberGreaterThanZero = currentWaitingList?.current_number > 0

  const { mutate: doCreateNewWaitingList } = useCreateNewWaitingListHook()
  const { mutate: doUpdateWaitingListStatus } = useUpdateWaitingListStatusHook()
  const { data: waitingListData } = useGetWaitingListByShopHook(currentShop?.id)

  useEffect(() => {
    if (waitingListData?.data?.waitingList) {
      setCurrentWaitingList(waitingListData.data.waitingList)
    }
  },[waitingListData])

  const handleOpenWaitingList = () => {
    const currentList = currentShop.barber_shop_waiting_list.find((_) => new Date(_.createdAt).getDay() === new Date().getDay())
    console.log({currentList})
    if(currentList){
      const requestDatas = {
        listId: currentList.id,
        datas: {
          status: WaitingListStatusEnum.OPEN,
          openStatus: ShopOpenStatus.OPEN
        }
      }
      doUpdateWaitingListStatus(requestDatas, {
        onSuccess: (data) => {
          if (data.data?.waitingList) {
            setCurrentShop({
              ...currentShop,
              openStatus: ShopOpenStatus.OPEN
            })
            setCurrentWaitingList(data.data.waitingList)
          }
        },
        onError: (error) => {
          console.log('Waiting list not updated', error)
        }
      })
      return
    }
    const requestDatas: INewWaitingListDtoIn = {
      current_number:0,
      session_date:new Date(),
      status:WaitingListStatusEnum.OPEN,
      barberShopId:currentShop?.id
    }
    doCreateNewWaitingList(requestDatas,{ 
      onSuccess: (data) => {
        console.log('Waiting list opened', data.data?.waitingList)
        if (data.data?.waitingList) {
          setCurrentShop({
            ...currentShop,
            openStatus: ShopOpenStatus.OPEN
          })
          setCurrentWaitingList(data.data.waitingList)
        }
      },
      onError: (error) => {
        console.log('Waiting list not opened', error)
      }
    })
  }

  const getNextNumber = (): IWaitingListNumbersDtoOut | null => {
    if (!currentWaitingList?.waiting_list_numbers?.length) return null
    
    const sortedNumbers = [...currentWaitingList.waiting_list_numbers].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    
    return sortedNumbers[0] || null
  }

  const handleOpenService = () => {
    if(isCurrentNumberGreaterThanZero) {
      // TODO: Marquer le client comme terminé
    } else {
      const next = getNextNumber()
      if (next && onOpenNextNumberModal) {
        onOpenNextNumberModal(next)
      }
    }
  }

  console.log({currentWaitingList})
  
 return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp">
      <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-gray-200">
      <div>
          <div className="font-serif text-base text-gray-900">File d'attente</div>
          <div className="text-xs text-red-400 uppercase">Vous êtes fermé</div>
      </div>
        { currentShop.openStatus === ShopOpenStatus.OPEN ?
          <div className="text-xs text-amber-700 font-semibold cursor-pointer uppercase tracking-wide" onClick={() => navigate('/waiting-list')}>Tout voir</div>
          :
          <div className="text-xs text-green-700 font-bold cursor-pointer uppercase tracking-wide" onClick={handleOpenWaitingList}>Ouvrir la file d'attente</div>
        }
      </div>
      { currentShop.openStatus === ShopOpenStatus.OPEN &&
        <div className="p-[18px]">
          { isCurrentNumberGreaterThanZero ?
            <div className="flex items-center gap-3.5 bg-gray-50 rounded-lg p-3.5 mb-4">
              <div className="font-serif text-5xl text-amber-700 leading-none">07</div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-wide">Client actuel</div>
                <div className="text-base font-semibold text-gray-900 my-0.5">Anonyme · Device #4F2A</div>
                <div className="text-xs text-gray-400">Scanné il y a 3 min</div>
              </div>
            </div> :
            <div className="flex items-center gap-3.5 bg-gray-50 rounded-lg p-3.5 mb-4">
              <div className="font-serif text-5xl text-amber-700 leading-none">Pas encore en service</div>
            </div> 
          }
          <div className="flex gap-2.5">
            <button onClick={handleOpenService} className="flex-1 py-2.5 px-4 rounded-lg bg-gray-900 text-white font-sans text-sm font-semibold hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-180 shadow-lg">
              ✅ {isCurrentNumberGreaterThanZero ? 'Marquer terminé' : 'Débuter'}
            </button>
            { isCurrentNumberGreaterThanZero &&
              <button className="flex-1 py-2.5 px-4 rounded-lg bg-red-50 text-red-500 font-sans text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-180">
                ⏭ &nbsp;Passer au suivant
              </button>
            }
          </div>
        </div>
      }
      { currentShop.openStatus === ShopOpenStatus.OPEN && isCurrentNumberGreaterThanZero &&
        <div className="flex flex-col">
          <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">07</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Anonyme · Device #4F2A</div>
              <div className="text-xs text-gray-400">Android · Tiré à 10:14</div>
            </div>
            <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-green-50 text-green-600 ml-2">En chaise</span>
            <div className="text-xs text-gray-400 ml-auto">3 min</div>
          </div>
          <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">08</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Youssef Amrani</div>
              <div className="text-xs text-gray-400">iOS · Compte client</div>
            </div>
            <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-amber-50 text-amber-700 ml-2">Présent</span>
            <div className="text-xs text-gray-400 ml-auto">12 min</div>
          </div>
          <div className="flex items-center gap-3.5 py-3 px-[22px] border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-default">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">09</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Anonyme · Device #B91C</div>
              <div className="text-xs text-gray-400">Android · Tiré à 10:28</div>
            </div>
            <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-gray-200 text-gray-400 ml-2">En attente</span>
            <div className="text-xs text-gray-400 ml-auto">26 min</div>
          </div>
          <div className="flex items-center gap-3.5 py-3 px-[22px] hover:bg-gray-50 transition-colors duration-150 cursor-default">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">10</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Anonyme · Device #3D7F</div>
              <div className="text-xs text-gray-400">Web · Tiré à 10:35</div>
            </div>
            <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-gray-200 text-gray-400 ml-2">En attente</span>
            <div className="text-xs text-gray-400 ml-auto">33 min</div>
          </div>
        </div>
      }
    </div>
  )
}
