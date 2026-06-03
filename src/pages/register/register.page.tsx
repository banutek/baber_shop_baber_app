import React, { useState, useEffect, useRef } from 'react'
import { useRegisterNewUserHook } from '../../hooks'  
import { RoleEnum, type INewUserDtoIn } from '../../dto'
import { GuestGuard } from '../../guards'

export interface IRegisterPageProps {
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

export const RegisterPage: React.FC<IRegisterPageProps> = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) // Nigeria by default
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { mutate: doRegisterNewUser } = useRegisterNewUserHook()

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    const requestDatas: INewUserDtoIn = {
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      role: RoleEnum.BARBER
    }
    doRegisterNewUser(requestDatas, {
      onSuccess: (data) => {
        console.log('User registered successfully:', data.data.user)
      },
      onError: (error) => {
        console.error('Error registering user:', error)
      }
    })
  }

  return (
    <GuestGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center p-5 font-sans">
        <div className="bg-gray-900 rounded-2xl p-10 w-full max-w-md shadow-2xl overflow-visible">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-semibold mb-3 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400 text-base leading-relaxed m-0 max-w-sm mx-auto">
              Build, test, and launch full-stack web and mobile apps — all in one flow.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Phone Number Input */}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="flex-1 bg-transparent border-none p-4 text-white text-base outline-none"
                />
              </div>
            </div>

                {/* First name Input */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Prénom"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border"
              />
            </div>
              
                {/* Last name Input */}
            <div className="mb-5">
                <input
                  type="text"
                  placeholder="Nom de famille"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border"
                />
            </div>

            {/* Email Input */}
            <div className="mb-5">
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border"
              />
            </div>
      
            {/* Address Input */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-base outline-none box-border"
              />
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <div className="relative bg-gray-800 rounded-xl border border-gray-700">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-transparent border-none p-4 pr-12 text-white text-base outline-none box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-none border-none text-gray-400 cursor-pointer text-xl p-0"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <div className="relative bg-gray-800 rounded-xl border border-gray-700">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-transparent border-none p-4 pr-12 text-white text-base outline-none box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-none border-none text-gray-400 cursor-pointer text-xl p-0"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex items-start text-gray-400 text-sm leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                  className="mr-3 mt-0.5 w-4 h-4 accent-purple-500"
                />
                <span>
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-purple-500 no-underline hover:underline">
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-500 no-underline hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
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

          {/* Social Login Buttons */}
          <div className="flex gap-3 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm cursor-pointer transition-colors hover:bg-gray-700">
              <span className="text-lg">🔍</span>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm cursor-pointer transition-colors hover:bg-gray-700">
              <span className="text-lg">📘</span>
              Facebook
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <button className="bg-none border-none text-purple-500 text-sm cursor-pointer underline p-0">
              Login
            </button>
          </div>
        </div>
      </div>
    </GuestGuard>
  )
}
