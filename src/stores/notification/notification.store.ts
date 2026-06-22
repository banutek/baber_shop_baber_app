import { create } from 'zustand'

import { type INotificationDtoOut, NotificationStatus } from '../../dto'

type NotificationStore = {
  notifications: INotificationDtoOut[]
  unreadCount: number
  setNotifications: (notifications: INotificationDtoOut[]) => void
  markAsRead: (notificationId: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications: INotificationDtoOut[]) =>
    set(() => ({
      notifications,
      unreadCount: notifications.filter((n) => n.status === NotificationStatus.PENDING).length,
    })),

  markAsRead: (notificationId: string) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, status: NotificationStatus.READ } : n,
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => n.status === NotificationStatus.PENDING).length,
      }
    }),

  clearNotifications: () => set(() => ({ notifications: [], unreadCount: 0 })),
}))
