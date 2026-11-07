import type React from 'react'
import { useState } from 'react'

import { EditShopInfosComponent } from './available-views/edit-shop-infos.component'
import { EditPersonInfosComponent } from './available-views/edit-perso-infos.component'
import { ServicesProvidedComponent } from './available-views/services-provided.component'
import { GalleryComponent } from './available-views/gallery.component'

export interface IProfileEditComponentProps {
  onCancel: () => void
}

export const ProfileEditComponent: React.FC<IProfileEditComponentProps> = ({ onCancel }) => {
  const [openSection, setOpenSection] = useState('personal')

  const sections = [
    {
      id: 'personal',
      icon: '👤',
      title: 'Informations personnelles',
      description: 'Identité et coordonnées',
      content: <EditPersonInfosComponent />,
    },
    {
      id: 'shop',
      icon: '💈',
      title: 'Informations du salon',
      description: 'Nom, adresse, téléphone et horaires',
      content: <EditShopInfosComponent />,
    },
    {
      id: 'services',
      icon: '✂️',
      title: 'Services proposés',
      description: 'Gérer les services disponibles',
      content: <ServicesProvidedComponent />,
    },
    {
      id: 'gallery',
      icon: '🖼️',
      title: 'Galerie du salon',
      description: 'Ajouter et organiser les photos',
      content: <GalleryComponent />,
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-gray-900">✏️ Modifier le profil</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium cursor-pointer"
        >
          Annuler
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section) => {
          const isOpen = openSection === section.id

          return (
            <section
              key={section.id}
              className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                isOpen
                  ? 'border-amber-300 shadow-sm ring-1 ring-amber-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? '' : section.id)}
                aria-expanded={isOpen}
                aria-controls={`profile-section-${section.id}`}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 sm:px-5"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg transition-colors ${
                    isOpen ? 'bg-amber-100' : 'bg-gray-100'
                  }`}
                  aria-hidden="true"
                >
                  {section.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">{section.title}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">{section.description}</span>
                </span>

                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-amber-50 text-amber-700' : ''
                  }`}
                  aria-hidden="true"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <div
                id={`profile-section-${section.id}`}
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-gray-100 px-3 pb-4 pt-3 sm:px-5 sm:pb-5">
                    {section.content}
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
