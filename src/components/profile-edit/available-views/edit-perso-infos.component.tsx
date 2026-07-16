import type React from 'react'
import { useState } from 'react'

import type { ILoginUserResponse } from '../../../dto'
import { useUpdateUserHook } from '../../../hooks'
import { useAuthStore, useToastStore } from '../../../stores'

export interface IEditPersonInfosComponentProps {
  onCancel?: () => void
}

export const EditPersonInfosComponent: React.FC<IEditPersonInfosComponentProps> = () => {
  const { currentUser, setCurrentUser } = useAuthStore()

  const { mutate: doUpdateUser, isPending: isUpdatingUser } = useUpdateUserHook()
  const addToast = useToastStore((s) => s.addToast)

  // ── User fields ──
  const [firstName, setFirstName] = useState(currentUser?.user?.firstName ?? '')
  const [lastName, setLastName] = useState(currentUser?.user?.lastName ?? '')
  const [userEmail, setUserEmail] = useState(currentUser?.user?.email ?? '')
  const [userPhone, setUserPhone] = useState(currentUser?.user?.phone ?? '')
  const [userAddress, setUserAddress] = useState(currentUser?.user?.address ?? '')

  // ── Build patch payloads ──
  const buildUserPatch = () => {
    const patch: Record<string, string> = {}
    if (firstName !== (currentUser?.user?.firstName ?? '')) patch.firstName = firstName
    if (lastName !== (currentUser?.user?.lastName ?? '')) patch.lastName = lastName
    if (userEmail !== (currentUser?.user?.email ?? '')) patch.email = userEmail
    if (userPhone !== (currentUser?.user?.phone ?? '')) patch.phone = userPhone
    if (userAddress !== (currentUser?.user?.address ?? '')) patch.address = userAddress
    return Object.keys(patch).length > 0 ? patch : null
  }

  // ── Handlers par section ──
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    const userPatch = buildUserPatch()
    if (!userPatch || !currentUser?.user?.id) return

    doUpdateUser(
      { userId: currentUser.user.id, datas: userPatch },
      {
        onSuccess: (res) => {
          if (res?.data?.user && currentUser) {
            const updated: ILoginUserResponse = {
              ...currentUser,
              user: res.data.user,
            }
            setCurrentUser(updated)
            localStorage.setItem('user', JSON.stringify(updated))
            // Réinitialiser l'état local pour que buildUserPatch() retourne null
            setFirstName(res.data.user.firstName ?? '')
            setLastName(res.data.user.lastName ?? '')
            setUserEmail(res.data.user.email ?? '')
            setUserPhone(res.data.user.phone ?? '')
            setUserAddress(res.data.user.address ?? '')
          }
          addToast('Infos personnelles mises à jour avec succès !', 'success')
        },
        onError: (err) => {
          console.error('[ProfileEdit] User update failed:', err)
          addToast('Erreur lors de la mise à jour du profil', 'error')
        },
      },
    )
  }

  const userChanged = buildUserPatch() !== null

  return (
    <form onSubmit={handleSaveUser}>
      <fieldset className="border border-gray-200 rounded-xl p-4">
        <legend className="text-xs uppercase tracking-wider text-amber-700 font-semibold px-2">
          👤 Infos personnelles
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Prénom
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Votre prénom"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Nom
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Votre nom"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Email
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="email@exemple.com"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Téléphone
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="+33..."
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500 sm:col-span-2">
            Adresse
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Votre adresse"
            />
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={!userChanged || isUpdatingUser}
        className="mt-3 w-full py-2.5 rounded-lg bg-amber-600 text-white font-sans text-sm font-semibold hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isUpdatingUser ? (
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
          '💾   Enregistrer les infos personnelles'
        )}
      </button>
    </form>
  )
}
