import { create } from 'zustand'

import type { IWaitingListNumbersDtoOut } from '../../dto'

type WaitingListNumberStore = {
  showNextNumberModal: boolean
  nextNumber: IWaitingListNumbersDtoOut | null
  setShowNextNumberModal: (show: boolean) => void
  setNextNumber: (nextNumber: IWaitingListNumbersDtoOut | null) => void
}

export const useWaitingListNumberStore = create<WaitingListNumberStore>()((set) => ({
  showNextNumberModal: false,
  nextNumber: null,

  setShowNextNumberModal: (show: boolean) => set(() => ({ showNextNumberModal: show })),
  setNextNumber: (nextNumber: IWaitingListNumbersDtoOut | null) => set(() => ({ nextNumber })),
}))
