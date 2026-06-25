import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon paths for bundlers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export interface MapLocation {
  address: string
  latitude: number
  longitude: number
}

interface MapPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (location: MapLocation) => void
  initialLat?: number
  initialLng?: number
}

/**
 * Reverse geocode using Nominatim — returns a human-readable address from lat/lng.
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=fr`
  const res = await fetch(url)
  const data = await res.json()
  return data?.display_name ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

interface Suggestion {
  lat: number
  lng: number
  displayName: string
}

/**
 * Forward geocode using Nominatim — returns a list of suggestions.
 */
async function searchAddressSuggestions(query: string): Promise<Suggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&accept-language=fr&limit=5`
  const res = await fetch(url)
  const data = await res.json()
  if (Array.isArray(data)) {
    return data.map((item: { lat: string; lon: string; display_name: string }) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
    }))
  }
  return []
}

/** Sub-component: handles map clicks */
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/** Sub-component: recenters the map when position changes */
function MapCenterUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  return null
}

const DEFAULT_CENTER: [number, number] = [30.4278, -9.5981] // Agadir, Morocco

export const MapPickerModal: React.FC<MapPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialLat,
  initialLng,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  const [address, setAddress] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize marker from props
  useEffect(() => {
    if (isOpen && initialLat && initialLng) {
      setMarkerPosition([initialLat, initialLng])
      setMapCenter([initialLat, initialLng])
    } else if (isOpen && !initialLat && !initialLng) {
      setMarkerPosition(null)
      setAddress('')
      setMapCenter(DEFAULT_CENTER)
      setSearchQuery('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [isOpen, initialLat, initialLng])

  // Debounced autocomplete: fetch suggestions as user types
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchAddressSuggestions(searchQuery.trim())
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setIsSearching(false)
    }, 400)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    setIsSearching(true)
    const addr = await reverseGeocode(lat, lng)
    setAddress(addr)
    setIsSearching(false)
  }, [])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.displayName)
    setMapCenter([suggestion.lat, suggestion.lng])
    setMarkerPosition([suggestion.lat, suggestion.lng])
    setAddress(suggestion.displayName)
    setShowSuggestions(false)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // If suggestions are showing and there's at least one, pick the first
      if (showSuggestions && suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setMapCenter([latitude, longitude])
        setMarkerPosition([latitude, longitude])
        setIsSearching(true)
        const addr = await reverseGeocode(latitude, longitude)
        setAddress(addr)
        setIsSearching(false)
        setIsLocating(false)
      },
      () => {
        alert("Impossible d'obtenir votre position. Vérifiez les permissions.")
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleConfirm = () => {
    if (markerPosition && address) {
      onConfirm({
        address,
        latitude: markerPosition[0],
        longitude: markerPosition[1],
      })
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70
      p-0 sm:p-4"
    >
      <div
        className="bg-gray-900 shadow-2xl overflow-hidden flex flex-col
        w-full h-full sm:w-[95%] sm:max-w-lg sm:h-auto sm:max-h-[92vh] sm:rounded-2xl
        md:max-w-xl lg:max-w-2xl min-w-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-700 shrink-0">
          <h2 className="text-white text-base sm:text-lg font-semibold truncate mr-2">
            Choisir l&rsquo;adresse
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl sm:text-2xl leading-none p-1 shrink-0"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Search bar with autocomplete */}
        <div className="px-3 py-2 sm:px-4 sm:py-3 relative shrink-0">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher une adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 sm:py-2 pr-8 text-white text-sm outline-none focus:border-purple-500 transition-colors"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Autocomplete suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-3 right-3 sm:left-4 sm:right-4 top-full mt-1 z-[10002] bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-40 sm:max-h-48 overflow-y-auto overflow-x-hidden"
            >
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-3 py-2.5 sm:py-2 hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0"
                >
                  <span className="text-white text-xs sm:text-sm line-clamp-2">
                    {s.displayName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map — fills available space */}
        <div className="flex-1 min-h-0 min-w-0 relative bg-gray-800 max-w-full">
          {isSearching && (
            <div className="absolute inset-0 z-[10001] bg-black/40 flex items-center justify-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                Recherche de l&rsquo;adresse...
              </div>
            </div>
          )}
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="w-full h-full"
            style={{ height: '100%', minHeight: '200px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler
              onClick={(lat, lng) => {
                handleMapClick(lat, lng)
              }}
            />
            <MapCenterUpdater center={mapCenter} />
            {markerPosition && <Marker position={markerPosition} />}
          </MapContainer>
        </div>

        {/* Current location button */}
        <div className="px-3 py-2 sm:px-4 sm:py-3 border-t border-gray-700 shrink-0">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-white text-xs sm:text-sm transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <span className="truncate">
              {isLocating ? 'Localisation...' : 'Utiliser ma position actuelle'}
            </span>
          </button>
        </div>

        {/* Selected address preview */}
        {address && (
          <div className="px-3 py-2 sm:px-4 sm:py-2 border-t border-gray-700 bg-gray-800/50 shrink-0">
            <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5">
              Adresse sélectionnée&nbsp;:
            </p>
            <p className="text-white text-xs sm:text-sm break-words line-clamp-3 sm:line-clamp-2">
              {address}
            </p>
            {markerPosition && (
              <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">
                {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-3 py-3 sm:px-4 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl py-2.5 sm:py-3 text-white text-xs sm:text-sm font-medium transition-colors order-2 sm:order-1"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!markerPosition || !address}
            className="w-full sm:flex-1 bg-gradient-to-r from-purple-500 to-purple-800 hover:from-purple-600 hover:to-purple-900 disabled:opacity-50 border-none rounded-xl py-2.5 sm:py-3 text-white text-xs sm:text-sm font-semibold transition-colors order-1 sm:order-2"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
