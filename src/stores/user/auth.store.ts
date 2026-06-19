import { create } from 'zustand'

import type { ILoginUserResponse } from '../../dto'

type AuthStore = {
  currentUser: ILoginUserResponse | null
  setCurrentUser: (user: ILoginUserResponse | null) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  currentUser: null,

  setCurrentUser: (user: ILoginUserResponse | null) => set(() => ({ currentUser: user })),
}))
