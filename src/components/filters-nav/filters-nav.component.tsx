import type React from 'react'
import { useShopStore } from '../../stores'
import { WaitingListNumberStatus } from '../../dto'

export interface IFiltersNavComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const FiltersNavComponent: React.FC<IFiltersNavComponentProps> = () => {
  const { currentWaitingList } = useShopStore()
  const { CREATED, PENDING, NEXT, IN_PROGRESS, COMPLETED, MISSING } = WaitingListNumberStatus

  const waiting = currentWaitingList?.waiting_list_numbers.filter((_) =>
    [CREATED, PENDING, NEXT].includes(_.status),
  )
  const inProgress = currentWaitingList?.waiting_list_numbers.filter(
    (_) => _.status === IN_PROGRESS,
  )
  const completed = currentWaitingList?.waiting_list_numbers.filter((_) => _.status === COMPLETED)
  const jumped = currentWaitingList?.waiting_list_numbers.filter((_) => _.status === MISSING)
  const clients = currentWaitingList?.waiting_list_numbers.filter((_) => _.device?.client)
  const anonymous = currentWaitingList?.waiting_list_numbers.filter((_) => !_.device?.client)

  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-900 bg-gray-900 text-white text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180">
        Tous ({currentWaitingList?.waiting_list_numbers?.length})
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        En attente ({waiting?.length})
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        En chaise ({inProgress?.length})
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Terminés ({completed?.length})
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Sautés ({jumped?.length})
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Clients ({clients?.length ?? 0})
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Anonymes ({anonymous?.length ?? 0})
      </div>
    </div>
  )
}
