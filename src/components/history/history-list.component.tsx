import React from 'react'
import { HistoryItemComponent } from './history-item.component'

export interface IHistoryListComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const HistoryListComponent: React.FC<IHistoryListComponentProps> = () => {
 return (
    <>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 pl-0.5">Historique · 13 passages</div>
      <div className="flex flex-col gap-0">
        <HistoryItemComponent
          icon="⏭"
          iconType="red"
          text="N°05 sauté · Anonyme #A31D absent à son tour"
          time="10:17"
          duration="Sauté"
          durationType="red"
        />
        <HistoryItemComponent
          icon="✅"
          iconType="green"
          text="N°06 terminé · Anonyme #4F2A"
          time="10:41"
          duration="21 min"
        />
        <HistoryItemComponent
          icon="✅"
          iconType="green"
          text="N°04 terminé · Yassine Ouhabi"
          time="09:58"
          duration="16 min"
        />
        <HistoryItemComponent
          icon="✅"
          iconType="green"
          text="N°03 terminé · Anonyme #CC12"
          time="09:40"
          duration="22 min"
        />
        <HistoryItemComponent
          icon="⏳"
          iconType="amber"
          text="N°02 terminé · Anonyme #8B3F"
          time="09:18"
          duration="14 min"
        />
      </div>
    </>
  )
}
