import React from 'react'
import { QueueCardComponent } from './queue-card.component'

export interface IQueueGridComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const QueueGridComponent: React.FC<IQueueGridComponentProps> = () => {
 return (
    <>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 pl-0.5">En attente · 4 personnes</div>
      <div className="flex flex-col gap-2.5 mb-7">
        <QueueCardComponent
          number="08"
          name="Youssef Amrani"
          meta={["Compte client", "iOS", "Tiré à 10:12"]}
          badge="⚡ Prochain"
          badgeType="amber"
          elapsed="Attend depuis 32 min"
          isActive={true}
        />
        <QueueCardComponent
          number="09"
          name="Anonyme · Device #B91C"
          meta={["Android", "Tiré à 10:28"]}
          badge="En attente"
          badgeType="muted"
          elapsed="Attend depuis 16 min"
        />
        <QueueCardComponent
          number="10"
          name="Anonyme · Device #3D7F"
          meta={["Web", "Tiré à 10:35"]}
          badge="En attente"
          badgeType="muted"
          elapsed="Attend depuis 9 min"
        />
        <QueueCardComponent
          number="11"
          name="Karim Idrissi"
          meta={["Compte client", "Android", "Tiré à 10:41"]}
          badge="🌟 Fidèle"
          badgeType="blue"
          elapsed="Attend depuis 3 min"
        />
      </div>
    </>
  )
}
