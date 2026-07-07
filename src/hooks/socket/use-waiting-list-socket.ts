import { useEffect } from 'react'

import { connectSocket } from '../../lib/socket'
import { useShopStore } from '../../stores'
import type { IWaitingListDtoOut } from '../../dto'

/**
 * Hook pour rejoindre la room barber-shop-{shopId} et écouter les événements
 * de création, mise à jour et suppression de waiting lists.
 */
export function useWaitingListSocket() {
  const { currentShop, setCurrentWaitingList } = useShopStore()

  useEffect(() => {
    const shopId = currentShop?.id
    if (!shopId) return

    const socket = connectSocket()
    socket.emit('joinWaitingList', shopId)

    const handleNewList = (data: IWaitingListDtoOut) => {
      console.log('[WS] newList received:', data)
      // Si le shop match, mettre à jour la waiting list courante
      if (data.barberShopId === shopId) {
        setCurrentWaitingList(data)
      }
    }

    const handleUpdateList = (data: IWaitingListDtoOut) => {
      console.log('[WS] updateList received:', data)
      if (data.barberShopId === shopId) {
        setCurrentWaitingList(data)
      }
    }

    const handleDeleteList = (data: IWaitingListDtoOut) => {
      console.log('[WS] deleteList received:', data)
      if (data.barberShopId === shopId) {
        setCurrentWaitingList(null)
      }
    }

    socket.on('newList', handleNewList)
    socket.on('updateList', handleUpdateList)
    socket.on('deleteList', handleDeleteList)

    return () => {
      socket.off('newList', handleNewList)
      socket.off('updateList', handleUpdateList)
      socket.off('deleteList', handleDeleteList)
      socket.emit('leaveWaitingList', shopId)
    }
  }, [currentShop?.id, setCurrentWaitingList])
}
