import React from 'react'

export interface IProfileComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const ProfileCardComponent: React.FC<IProfileComponentProps> = () => {
return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-7 text-center relative">
        <div className="absolute inset-0 opacity-6">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="relative">
          <div className="relative inline-block mb-3.5">
            <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center font-serif text-3xl text-white border-[3px] border-white/15 shadow-lg">
              A
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-[3px] border-gray-900 animate-pulse"></div>
          </div>
          <div className="font-serif text-xl text-white mb-1">Ahmed Benali</div>
          <div className="text-xs text-amber-500 uppercase tracking-wider font-medium">
            Coiffeur · Salon Baraka
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2.5 py-2.5 border-b border-gray-200 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            📍
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Salon</span>
            <span className="font-medium text-gray-900">Salon Baraka — Casablanca</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 border-b border-gray-200 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            📅
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Membre depuis</span>
            <span className="font-medium text-gray-900">Mars 2024</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 border-b border-gray-200 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            🕐
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Prise de service</span>
            <span className="font-medium text-gray-900">09:00 — 19:00</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
            📱
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Téléphone</span>
            <span className="font-medium text-gray-900">+212 6 00 11 22 33</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 rounded-lg border-2 border-amber-600 bg-transparent text-amber-700 font-sans text-sm font-semibold hover:bg-amber-50 transition-all duration-200 tracking-wide">
          ✏️ &nbsp; Modifier le profil
        </button>
      </div>
    </div>
  )
}