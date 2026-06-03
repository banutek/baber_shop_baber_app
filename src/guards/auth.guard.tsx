import React from 'react'
import { Navigate } from 'react-router-dom'
import type { ILoginUserResponse } from '../dto'

export interface IAuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
    const connectedUser:ILoginUserResponse = JSON.parse(localStorage.getItem('user'))

    console.log(({connectedUser}))

  if(!connectedUser) {
    return <Navigate to="/login" />
  }
  return children
}
