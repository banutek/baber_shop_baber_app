import type React from 'react'
import { useMemo, useState } from 'react'

import { useUpdateShopHook } from '../../../hooks'
import { useShopStore, useToastStore } from '../../../stores'

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

/**
 * Parse les heures au format "09:00 — 19:00" et retourne [opening, closing].
 * Si le parsing échoue, retourne les valeurs par défaut.
 */
const parseHours = (hours: string): [string, string] => {
  const parts = hours.split(/\s*[—–-]\s*/)
  if (parts.length >= 2) {
    const opening = parts[0].trim()
    const closing = parts[1].trim()
    if (/^\d{2}:\d{2}$/.test(opening) && /^\d{2}:\d{2}$/.test(closing)) {
      return [opening, closing]
    }
  }
  return ['08:00', '19:00']
}

export interface IEditShopInfosComponentProps {
  onCancel?: () => void
}

export const EditShopInfosComponent: React.FC<IEditShopInfosComponentProps> = () => {
  const { currentShop, setCurrentShop } = useShopStore()

  const { mutate: doUpdateShop, isPending: isUpdatingShop } = useUpdateShopHook()
  const addToast = useToastStore((s) => s.addToast)

  // Parse existing hours into opening/closing
  const [initialOpening, initialClosing] = useMemo(
    () => parseHours(currentShop?.hours ?? ''),
    [currentShop?.hours],
  )

  // ── Shop fields ──
  const [shopName, setShopName] = useState(currentShop?.name ?? '')
  const [shopAddress, setShopAddress] = useState(currentShop?.address ?? '')
  const [shopPhone, setShopPhone] = useState(currentShop?.phone ?? '')
  const [openingTime, setOpeningTime] = useState(initialOpening)
  const [closingTime, setClosingTime] = useState(currentShop?.closingTime || initialClosing)

  const buildShopPatch = () => {
    const patch: Record<string, string> = {}
    const hoursString = `${openingTime} — ${closingTime}`
    if (shopName !== (currentShop?.name ?? '')) patch.name = shopName
    if (shopAddress !== (currentShop?.address ?? '')) patch.address = shopAddress
    if (shopPhone !== (currentShop?.phone ?? '')) patch.phone = shopPhone
    if (hoursString !== (currentShop?.hours ?? '')) patch.hours = hoursString
    if (closingTime !== (currentShop?.closingTime ?? '')) patch.closingTime = closingTime
    return Object.keys(patch).length > 0 ? patch : null
  }

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault()
    const shopPatch = buildShopPatch()
    if (!shopPatch || !currentShop?.id) return

    doUpdateShop(
      { shopId: currentShop.id, datas: shopPatch },
      {
        onSuccess: (res) => {
          if (res?.data?.shop) {
            setCurrentShop(res.data.shop)
            // Réinitialiser l'état local pour que buildShopPatch() retourne null
            setShopName(res.data.shop.name ?? '')
            setShopAddress(res.data.shop.address ?? '')
            setShopPhone(res.data.shop.phone ?? '')
            const [newOpening, newClosing] = parseHours(res.data.shop.hours ?? '')
            setOpeningTime(newOpening)
            setClosingTime(res.data.shop.closingTime || newClosing)
          }
          addToast('Infos du salon mises à jour avec succès !', 'success')
        },
        onError: (err) => {
          console.error('[ProfileEdit] Shop update failed:', err)
          addToast('Erreur lors de la mise à jour du salon', 'error')
        },
      },
    )
  }

  const shopChanged = buildShopPatch() !== null

  return (
    <form onSubmit={handleSaveShop}>
      <fieldset className="border border-gray-200 rounded-xl p-4">
        <legend className="text-xs uppercase tracking-wider text-amber-700 font-semibold px-2">
          💈 Salon
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <label className="flex flex-col gap-1 text-xs text-gray-500 sm:col-span-2">
            Nom du salon
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Nom de votre salon"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500 sm:col-span-2">
            Adresse
            <input
              type="text"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Adresse complète"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Téléphone du salon
            <input
              type="tel"
              value={shopPhone}
              onChange={(e) => setShopPhone(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="+33..."
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Horaires d&apos;ouverture
            <div className="flex items-center gap-2">
              <select
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer bg-white"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <span className="text-gray-400 text-sm font-semibold flex-shrink-0">—</span>
              <select
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer bg-white"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={!shopChanged || isUpdatingShop}
        className="mt-3 w-full py-2.5 rounded-lg bg-amber-600 text-white font-sans text-sm font-semibold hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isUpdatingShop ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enregistrement...
          </>
        ) : (
          '💾   Enregistrer les infos du salon'
        )}
      </button>
    </form>
  )
}
