import type React from 'react'

import { WaitingListNumberStatus } from '../../dto'
import { useShopStore } from '../../stores'
import { HistoryItemComponent } from './history-item.component'

export interface IHistoryListComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const HistoryListComponent: React.FC<IHistoryListComponentProps> = () => {
  const { currentWaitingList } = useShopStore()
  console.log({ currentWaitingList })
  const alreadyProcessedNumbers =
    currentWaitingList?.waiting_list_numbers?.filter((n) =>
      [WaitingListNumberStatus.MISSING, WaitingListNumberStatus.COMPLETED].includes(n.status),
    ) ?? []

  return (
    <>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 pl-0.5">
        {`  Historique · ${alreadyProcessedNumbers.length} personnes déjà passées`}
      </div>
      <div className="flex flex-col gap-0">
        {alreadyProcessedNumbers.map((number, index) => (
          <HistoryItemComponent
            key={index}
            icon={number?.status === WaitingListNumberStatus.MISSING ? '⏭' : '✅'}
            iconType={number?.status === WaitingListNumberStatus.MISSING ? 'red' : 'green'}
            text={`N°${number.value} ${number?.status === WaitingListNumberStatus.MISSING ? 'sauté' : 'terminé'} · ${number?.device?.client ? number.device.client : `Client #${number.deviceId}`}`}
            time={
              number?.updatedAt
                ? new Date(number.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''
            }
            duration={
              number?.completedAt
                ? Math.round(
                    (new Date(number.completedAt).getTime() -
                      new Date(number.inProgressAt!).getTime()) /
                      60000,
                  ) + ' min'
                : 'Sauté'
            }
            durationType={number?.status === WaitingListNumberStatus.MISSING ? 'red' : 'green'}
          />
        ))}
        {/* <HistoryItemComponent
          icon="⏳"
          iconType="amber"
          text="N°02 terminé · Anonyme #8B3F"
          time="09:18"
          duration="14 min"
        /> */}
      </div>
    </>
  )
}
