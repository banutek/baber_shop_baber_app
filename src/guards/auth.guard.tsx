import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { ILoginUserResponse } from '../dto'
import { useAuthStore } from '../stores'

export interface IAuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const { setCurrentUser } = useAuthStore()
    const { pathname } = useLocation()
    const userStr = localStorage.getItem('user')
    const connectedUser:ILoginUserResponse = userStr ? JSON.parse(userStr) : null

    console.log({connectedUser, pathname})

  if(!connectedUser) {
    return <Navigate to="/login" />
  } else {
    if(!connectedUser.user.manager_barber_shop && pathname !== '/create-new-shop') {
      return <Navigate to="/create-new-shop" />
    } else {
      setCurrentUser(connectedUser)
    }
  }
  return children
}
