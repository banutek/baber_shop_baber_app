import { useEffect, useRef } from 'react'

import { ShopOpenStatus } from '../../dto'
import type { IBarberShopDtoOut } from '../../dto'
import { useUpdateShopStatusHook } from './use-update-shop-status.hook'

/**
 * Parse les heures d'ouverture (format "09:00 — 19:00" ou "09:00 - 19:00")
 * et retourne l'heure de fermeture en minutes depuis minuit.
 * Retourne null si le parsing échoue.
 */
const parseClosingTimeInMinutes = (hours: string): number | null => {
  // Accepte les séparateurs : tiret cadratin (—), demi-cadratin (–), trait d'union (-)
  const parts = hours.split(/\s*[—–\-]\s*/)
  if (parts.length < 2) return null

  const closing = parts[1].trim()
  const match = closing.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null

  const h = Number.parseInt(match[1], 10)
  const m = Number.parseInt(match[2], 10)
  if (h < 0 || h > 23 || m < 0 || m > 59) return null

  return h * 60 + m
}

export interface IUseAutoCloseShopOptions {
  shop: IBarberShopDtoOut | null
  /** Callback appelé après la fermeture automatique réussie */
  onAutoCloseSuccess?: () => void
  /** Callback appelé en cas d'erreur */
  onAutoCloseError?: (error: Error) => void
}

/**
 * Programme la fermeture automatique du salon à l'heure de fermeture définie
 * dans shop.hours. Si l'heure est déjà passée au montage, ne fait rien
 * (le backend est censé avoir déjà fermé).
 *
 * Nettoie le timeout au démontage du composant.
 */
export const useAutoCloseShopHook = ({
  shop,
  onAutoCloseSuccess,
  onAutoCloseError,
}: IUseAutoCloseShopOptions) => {
  const { mutate: doUpdateShopStatus } = useUpdateShopStatusHook()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Ne rien faire si pas de shop, pas d'horaires, ou déjà fermé
    if (!shop?.hours || shop.openStatus !== ShopOpenStatus.OPEN) {
      return
    }

    const closingMin = parseClosingTimeInMinutes(shop.hours)
    if (closingMin === null) return

    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()

    // Si l'heure de fermeture est déjà passée, on ne fait rien
    // (le backend est responsable de la fermeture dans ce cas)
    const delayMin = closingMin - nowMin
    if (delayMin <= 0) return

    const delayMs = delayMin * 60 * 1000

    timeoutRef.current = setTimeout(() => {
      doUpdateShopStatus(
        {
          shopId: shop.id,
          datas: { openStatus: ShopOpenStatus.CLOSED },
        },
        {
          onSuccess: () => {
            onAutoCloseSuccess?.()
          },
          onError: (error) => {
            console.error('[AutoCloseShop] Échec de la fermeture automatique :', error)
            onAutoCloseError?.(error)
          },
        },
      )
    }, delayMs)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [
    shop?.id,
    shop?.hours,
    shop?.openStatus,
    doUpdateShopStatus,
    onAutoCloseSuccess,
    onAutoCloseError,
  ])
}
