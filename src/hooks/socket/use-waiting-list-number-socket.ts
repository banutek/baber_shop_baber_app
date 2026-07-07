import { useEffect } from 'react'

import { connectSocket } from '../../lib/socket'
import { useShopStore } from '../../stores'
import type { IWaitingListNumbersDtoOut } from '../../dto'

/**
 * Hook pour rejoindre la room waiting-list-{waitingListId} et écouter les événements
 * de création, mise à jour et suppression de numbers dans la waiting list.
 */
export function useWaitingListNumberSocket() {
  const { currentWaitingList, setCurrentWaitingList } = useShopStore()

  useEffect(() => {
    const waitingListId = currentWaitingList?.id
    if (!waitingListId) return

    const socket = connectSocket()
    socket.emit('joinWaitingListNumber', waitingListId)

    const handleNewNumber = (data: IWaitingListNumbersDtoOut) => {
      console.log('[WS] newNumber received:', data)
      if (data.waitingListId === waitingListId && currentWaitingList) {
        // Ajouter le nouveau number à la liste existante sans doublon
        const exists = currentWaitingList.waiting_list_numbers?.some((n) => n.id === data.id)
        if (!exists) {
          setCurrentWaitingList({
            ...currentWaitingList,
            waiting_list_numbers: [...(currentWaitingList.waiting_list_numbers || []), data],
          })
        }
      }
    }

    const handleUpdateNumber = (data: IWaitingListNumbersDtoOut) => {
      console.log('[WS] updateNumber received:', data)
      if (data.waitingListId === waitingListId && currentWaitingList) {
        setCurrentWaitingList({
          ...currentWaitingList,
          waiting_list_numbers:
            currentWaitingList.waiting_list_numbers?.map((n) => (n.id === data.id ? data : n)) ||
            [],
        })
      }
    }

    const handleDeleteNumber = (data: IWaitingListNumbersDtoOut) => {
      console.log('[WS] deleteNumber received:', data)
      if (data.waitingListId === waitingListId && currentWaitingList) {
        setCurrentWaitingList({
          ...currentWaitingList,
          waiting_list_numbers:
            currentWaitingList.waiting_list_numbers?.filter((n) => n.id !== data.id) || [],
        })
      }
    }

    socket.on('newNumber', handleNewNumber)
    socket.on('updateNumber', handleUpdateNumber)
    socket.on('deleteNumber', handleDeleteNumber)

    return () => {
      socket.off('newNumber', handleNewNumber)
      socket.off('updateNumber', handleUpdateNumber)
      socket.off('deleteNumber', handleDeleteNumber)
      socket.emit('leaveWaitingListNumber', waitingListId)
    }
  }, [currentWaitingList?.id, setCurrentWaitingList])
}
