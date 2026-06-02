import React from 'react'

export interface ILoginPageProps {
  default_props?: boolean
  default_method?: () => void
}

export const LoginPage: React.FC<ILoginPageProps> = () => {
  return (
    <div>
      hello world from Login page
    </div>
  )
}
