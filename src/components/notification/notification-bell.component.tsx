import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { type INotificationDtoOut, NotificationStatus } from '../../dto'
import {
  useNotificationsHook,
  useShopNotificationsHook,
  useUpdateNotificationStatusHook,
} from '../../hooks'
import { useNotificationStore } from '../../stores'

export interface INotificationBellProps {
  /** ID du device pour lequel afficher les notifications (client) */
  deviceId?: string
  /** ID du shop pour lequel afficher les notifications (barber) */
  shopId?: string
}

export const NotificationBell: React.FC<INotificationBellProps> = ({ deviceId, shopId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { notifications, unreadCount, setNotifications, markAsRead } = useNotificationStore()
  const { data: deviceNotificationsData } = useNotificationsHook(deviceId)
  const { data: shopNotificationsData } = useShopNotificationsHook(shopId)
  const { mutate: doUpdateNotificationStatus } = useUpdateNotificationStatusHook()

  // Sync remote notifications into the store (device or shop source)
  useEffect(() => {
    const data =
      deviceNotificationsData?.data?.notifications ?? shopNotificationsData?.data?.notifications
    if (data) {
      setNotifications(data)
    }
  }, [deviceNotificationsData, shopNotificationsData, setNotifications])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleMarkAsRead = (notification: INotificationDtoOut) => {
    if (notification.status === NotificationStatus.PENDING) {
      doUpdateNotificationStatus({
        notificationId: notification.id,
        datas: { status: NotificationStatus.READ },
      })
      markAsRead(notification.id)
    }
  }

  const toggleDropdown = () => setIsOpen((prev) => !prev)

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60_000)
    if (diffMin < 1) return "À l'instant"
    if (diffMin < 60) return `Il y a ${diffMin} min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `Il y a ${diffH}h`
    return date.toLocaleDateString('fr-FR')
  }

  if (!deviceId && !shopId) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center text-base hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 relative"
        onClick={toggleDropdown}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-slideUp">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-amber-600 font-medium">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                Aucune notification pour le moment
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                    notif.status === NotificationStatus.PENDING ? 'bg-amber-50/30' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notif)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.status === NotificationStatus.PENDING ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">{notif.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
