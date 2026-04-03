import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string
  avatar: string | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateAvatar: (avatar: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEFAULT_AVATAR = '/avatar.jpg'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('dockpull_user')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  })

  const isAuthenticated = !!user

  useEffect(() => {
    if (user) {
      localStorage.setItem('dockpull_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('dockpull_user')
    }
  }, [user])

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === 'admin' && password === '123456') {
      setUser({
        username: 'admin',
        avatar: localStorage.getItem('dockpull_avatar') || DEFAULT_AVATAR
      })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const updateAvatar = (avatar: string) => {
    if (user) {
      const updatedUser = { ...user, avatar }
      setUser(updatedUser)
      localStorage.setItem('dockpull_avatar', avatar)
    }
  }

  useEffect(() => {
    const storedAvatar = localStorage.getItem('dockpull_avatar')
    if (storedAvatar && user) {
      setUser(prev => prev ? { ...prev, avatar: storedAvatar } : null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}