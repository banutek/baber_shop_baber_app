import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginUserHook } from '../../hooks'
import { useAuthStore } from '../../stores'

export interface ILoginPageProps {
  default_props?: boolean
  default_method?: () => void
}

const BagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="7" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 7V5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="12" r="1" fill="currentColor"/>
    <circle cx="15" cy="12" r="1" fill="currentColor"/>
  </svg>
)

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2"/>
    <path fill="white" d="M15.12 12h-2.19v8H10.4v-8H8.64V9.33h1.76V7.75c0-2.36 1.02-3.75 3.8-3.75h2.32v2.67h-1.45c-1.08 0-1.16.39-1.16 1.11v1.55h2.58L15.12 12z"/>
  </svg>
)

export const LoginPage: React.FC<ILoginPageProps> = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setConnectedUser } = useAuthStore()
  const { mutate: doLoginUser } = useLoginUserHook()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login:', { email, password })
    if(email && password) {
      doLoginUser({ email, password }, {
        onSuccess: (data) => {
          console.log('Login successful')
          if(data?.data?.user) {
            const connected = {
              user: data.data.user,
              access_token: data.data.access_token
            }
            setConnectedUser(connected)
            localStorage.setItem('user', JSON.stringify(connected))
            navigate('/')
          }
        },
        onError: (error) => {
          console.log('Login failed', error)
        }
      })
    }
  }

  const handleGoogleLogin = () => {
    console.log('Google login')
  }

  const handleFacebookLogin = () => {
    console.log('Facebook login')
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl p-8 md:p-12 w-full max-w-md">
        <div className="mb-8">
          <BagIcon className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-white text-2xl font-semibold mb-2">Welcome Back!</h1>
        <p className="text-gray-400 text-sm mb-8">Build, test, and launch full-stack web and mobile apps</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 rounded-lg px-4 py-3.5 border border-transparent focus:border-gray-600 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 rounded-lg px-4 py-3.5 pr-12 border border-transparent focus:border-gray-600 focus:outline-none transition-colors text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
            >
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-full py-3.5 hover:bg-gray-100 transition-colors mt-2"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-white text-sm hover:text-gray-300 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-gray-500 text-sm">or continue with</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <FacebookIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm mb-4">Don&apos;t have an account?</p>
          <Link
            to="/register"
            className="block w-full bg-[#1a1a1a] text-white font-medium rounded-full py-3.5 hover:bg-[#252525] transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
