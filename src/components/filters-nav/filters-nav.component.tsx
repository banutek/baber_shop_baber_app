import type React from 'react'

export interface IFiltersNavComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const FiltersNavComponent: React.FC<IFiltersNavComponentProps> = () => {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-900 bg-gray-900 text-white text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180">
        Tous (17)
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        En attente (4)
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        En chaise (1)
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Terminés (12)
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Sautés (1)
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Clients (2)
      </div>
      <div className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-180 hover:border-amber-600 hover:text-amber-700">
        Anonymes (15)
      </div>
    </div>
  )
}
