import type React from 'react'

import { WaitingListNumberStatus } from '../../dto'
import { statusListNumberConfig } from '../../dto/maps'
import { useShopStore } from '../../stores'
import { QueueCardComponent } from './queue-card.component'

export interface IQueueGridComponentProps {
  default_props?: boolean
  default_method?: () => void
  //  shop?: IBarberShopDtoOut
}

export const QueueGridComponent: React.FC<IQueueGridComponentProps> = () => {
  const { currentWaitingList } = useShopStore()
  const countWaitingNumbers = currentWaitingList?.waiting_list_numbers?.filter((n) =>
    [
      WaitingListNumberStatus.NEXT,
      WaitingListNumberStatus.CREATED,
      WaitingListNumberStatus.PENDING,
    ].includes(n.status),
  ).length

  return (
    <>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 pl-0.5">
        En attente · {countWaitingNumbers ?? 0} personnes
      </div>
      <div className="flex flex-col gap-2.5 mb-7">
        {currentWaitingList?.waiting_list_numbers?.map((number, index) => (
          <QueueCardComponent
            key={index}
            number={number.value}
            name={number?.device?.client ? number.device.client : `Client #${number.deviceId}`}
            meta={[
              number?.device?.platform,
              `Tiré à ${new Date(number?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            ]}
            badge={statusListNumberConfig[number?.status]?.label}
            sideColor={statusListNumberConfig[number?.status]?.sideColor}
            badgeColorClass={statusListNumberConfig[number?.status]?.className}
            elapsed={number.createdAt}
            isActive={true}
          />
        ))}
        {/* <QueueCardComponent
          number="08"
          name="Youssef Amrani"
          meta={['Compte client', 'iOS', 'Tiré à 10:12']}
          badge="⚡ Prochain"
          sideColor={statusListNumberConfig[WaitingListNumberStatus.NEXT]?.sideColor}
          badgeColorClass={statusListNumberConfig[number?.status]?.className}
          elapsed="Attend depuis 32 min"
          isActive={true}
        />
        <QueueCardComponent
          number="11"
          name="Karim Idrissi"
          meta={['Compte client', 'Android', 'Tiré à 10:41']}
          badge="🌟 Fidèle"
          sideColor={statusListNumberConfig[WaitingListNumberStatus.Loyal]?.sideColor}
          elapsed="Attend depuis 3 min"
        /> */}
      </div>
    </>
  )
}
