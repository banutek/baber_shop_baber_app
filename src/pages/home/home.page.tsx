import React from 'react'
import { useNavigate } from 'react-router-dom'

export interface IHomePageProps {
  default_props?: boolean
  default_method?: () => void
}

export const HomePage: React.FC<IHomePageProps> = () => {
  const navigate = useNavigate()
  return (
    <div>
      hello world from Home page
      <div onClick={() => navigate('/register')}>Go to register</div>
      <div onClick={() => navigate('/login')}>Go to login</div>
    </div>
  )
}
