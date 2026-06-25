import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { type INewBarberShopDtoIn } from '../../dto'
import { AuthGuard } from '../../guards'
import { useCreateNewShopHook } from '../../hooks'
import { MapPickerModal } from '../../components/map-picker-modal/map-picker-modal.component'

export interface ICreateNewShopProps {
  default_props?: boolean
  default_method?: () => void
}

interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

const countries: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', dialCode: '+225' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230' },
]

const HOURS = [
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '00',
]
const MINUTES = ['00', '15', '30', '45']

const generateTimeSlots = (): string[] => {
  const slots: string[] = []
  for (const h of HOURS) {
    for (const m of MINUTES) {
      slots.push(`${h}:${m}`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export const CreateNewShop: React.FC<ICreateNewShopProps> = () => {
  const navigate = useNavigate()
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) // Nigeria by default
  const [formDatas, setFormDatas] = useState<INewBarberShopDtoIn>({
    name: '',
    address: '',
    phone: '',
    latitude: undefined,
    longitude: undefined,
    email: '',
    hours: '',
    closingTime: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [openingTime, setOpeningTime] = useState('08:00')
  const [closingTime, setClosingTime] = useState('19:00')
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: doCreateNewShop } = useCreateNewShopHook()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setFormDatas({ ...formDatas, profileImage: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormDatas({ ...formDatas, profileImage: undefined })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Créer FormData pour l'envoi du fichier
    const formDataToSend = new FormData()
    formDataToSend.append('name', formDatas.name)
    formDataToSend.append('address', formDatas.address)
    formDataToSend.append('phone', formDatas.phone)
    formDataToSend.append('hours', `${openingTime} — ${closingTime}`)
    formDataToSend.append('closingTime', closingTime)

    if (formDatas.email) {
      formDataToSend.append('email', formDatas.email)
    }

    if (formDatas.latitude) {
      formDataToSend.append('latitude', formDatas.latitude.toString())
    }

    if (formDatas.longitude) {
      formDataToSend.append('longitude', formDatas.longitude.toString())
    }

    if (formDatas.profileImage) {
      formDataToSend.append('profileImage', formDatas.profileImage)
    }

    console.log('Form submitted with FormData:', formDataToSend)
    doCreateNewShop(formDataToSend, {
      onSuccess: (data) => {
        console.log('Shop created successfully:', data.data.shop)
        const connectedUser = JSON.parse(localStorage.getItem('user') ?? '{}')
        connectedUser.user.manager_barber_shop = data.data.shop
        localStorage.setItem('user', JSON.stringify(connectedUser))
        navigate('/')
      },
      onError: (error) => {
        console.error('Error creating shop:', error)
      },
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center p-5 font-sans">
        <div className="bg-gray-900 rounded-2xl p-10 w-full max-w-md shadow-2xl overflow-visible">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-semibold mb-3 tracking-tight">
              Créer le salon
            </h1>
            <p className="text-gray-400 text-base leading-relaxed m-0 max-w-sm mx-auto">
              Build, test, and launch full-stack web and mobile apps — all in one flow.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <div className="flex bg-gray-800 rounded-xl border border-gray-700 relative">
                {/* Country Selector Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="flex items-center px-4 border-r border-gray-700 bg-gray-850 hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xl mr-2">{selectedCountry.flag}</span>
                    <span className="text-gray-400 text-sm">{selectedCountry.dialCode}</span>
                    <svg
                      className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 z-[9999] mt-1 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country)
                            setShowCountryDropdown(false)
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-gray-700 transition-colors text-left"
                        >
                          <span className="text-xl mr-3">{country.flag}</span>
                          <div className="flex-1">
                            <div className="text-white text-sm font-medium">{country.name}</div>
                            <div className="text-gray-400 text-xs">{country.dialCode}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formDatas.phone}
                  onChange={(e) => setFormDatas({ ...formDatas, phone: e.target.value })}
                  className="flex-1 bg-transparent border-none p-4 text-white text-base outline-none"
                />
              </div>
            </div>

            {/* Barbershop name Input */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Nom du salon"
                value={formDatas.name}
                onChange={(e) => setFormDatas({ ...formDatas, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border"
              />
            </div>

            {/* Hours Input */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Horaires d'ouverture</label>
              <div className="flex items-center gap-2">
                <select
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none appearance-none cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <span className="text-gray-400 text-lg font-semibold">—</span>
                <select
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none appearance-none cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-5">
              <input
                type="email"
                placeholder="Email address"
                value={formDatas.email}
                onChange={(e) => setFormDatas({ ...formDatas, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border"
              />
            </div>

            {/* Address Input — opens map picker */}
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border text-left flex items-center justify-between hover:border-purple-500 transition-colors"
              >
                <span className={formDatas.address ? 'text-white' : 'text-gray-500'}>
                  {formDatas.address || 'Choisir une adresse sur la carte'}
                </span>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Map Picker Modal */}
            <MapPickerModal
              isOpen={isMapModalOpen}
              onClose={() => setIsMapModalOpen(false)}
              onConfirm={(location) => {
                setFormDatas({
                  ...formDatas,
                  address: location.address,
                  latitude: location.latitude,
                  longitude: location.longitude,
                })
              }}
              initialLat={formDatas.latitude}
              initialLng={formDatas.longitude}
            />

            {/* Latitude Input — read-only, auto-filled from map */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Latitude"
                value={formDatas.latitude?.toFixed(6) ?? ''}
                readOnly
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-400 text-base outline-none box-border cursor-default"
              />
            </div>

            {/* Longitude Input — read-only, auto-filled from map */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Longitude"
                value={formDatas.longitude?.toFixed(6) ?? ''}
                readOnly
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-400 text-base outline-none box-border cursor-default"
              />
            </div>

            {/* Profile Image Upload */}
            <div className="mb-5">
              <div
                className={`w-full bg-gray-800 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleImageClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-32 h-32 mx-auto rounded-lg object-cover mb-3"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage()
                      }}
                      className="absolute top-0 right-1/4 transform translate-x-12 -translate-y-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <p className="text-gray-400 text-sm">
                      Cliquez ou glissez pour remplacer l&rsquo;image
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Glissez-déposez une image ici</p>
                    <p className="text-gray-500 text-xs">ou cliquez pour sélectionner</p>
                    <p className="text-gray-600 text-xs mt-2">PNG, JPG, GIF jusqu&rsquo;à 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-800 border-none rounded-xl p-4 text-white text-base font-semibold cursor-pointer mb-6 transition-transform hover:-translate-y-0.5"
            >
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="mx-4">or continue with</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Login Link */}
          <div className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="bg-none border-none text-purple-500 text-sm cursor-pointer underline p-0"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
