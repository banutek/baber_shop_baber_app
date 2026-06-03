import React from 'react'
import { ActivitySectionComponent, ProfileCardComponent, QueueRecapComponent, StatsRowComponent, TopBarComponent } from '../../components'
import { AuthGuard } from '../../guards'

export interface IHomePageProps {
  default_props?: boolean
  default_method?: () => void
}


export const HomePage: React.FC<IHomePageProps> = () => {
  
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
        
        <TopBarComponent />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-6 py-7">
          {/* Sidebar */}
          <aside className="md:col-span-4">
            <ProfileCardComponent />
            <StatsRowComponent />
          </aside>
          
          {/* Main Content */}
          <main className="md:col-span-8 flex flex-col gap-5">
            <QueueRecapComponent />
            <ActivitySectionComponent />
          </main>
        </div>
        
      </div>
    </AuthGuard>
  )
}
