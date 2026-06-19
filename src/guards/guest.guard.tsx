import type React from 'react'
import { Navigate } from 'react-router-dom'

import type { ILoginUserResponse } from '../dto'

export interface IGuestGuardProps {
  children: React.ReactNode
}

export const GuestGuard: React.FC<IGuestGuardProps> = ({ children }) => {
  const connectedUser: ILoginUserResponse = JSON.parse(localStorage.getItem('user') as string)

  console.log({ connectedUser })

  if (connectedUser) {
    return <Navigate to="/" />
  }
  return children
}
