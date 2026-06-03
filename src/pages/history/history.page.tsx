import React from 'react'
import { CurrentBannerComponent,  HistoryListComponent, StatsRowComponent, TopBarComponent } from '../../components'
import { AuthGuard } from '../../guards'

export interface IHistoryPageProps {
  default_props?: boolean
  default_method?: () => void
}

export const HistoryPage: React.FC<IHistoryPageProps> = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeUp {
            animation: fadeUp 0.35s ease both;
          }
          .q-card:hover .q-skip-btn {
            opacity: 1;
          }
        `}</style>
        
        <TopBarComponent title="Historique" />
        
        <div className="max-w-4xl mx-auto px-5 py-6">
          <StatsRowComponent />
          <CurrentBannerComponent />
          <HistoryListComponent />
        </div>
      </div>
    </AuthGuard>
    )
}
