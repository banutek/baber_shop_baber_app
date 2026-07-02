import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  durationMs?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, durationMs?: number) => void
  removeToast: (id: string) => void
}

let nextId = 0

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],

  addToast: (message, type = 'info', durationMs = 5000) => {
    const id = `toast-${++nextId}`
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, durationMs }],
    }))

    if (durationMs > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, durationMs)
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))
