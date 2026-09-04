'use client'

import { useState, useEffect, useContext, createContext } from 'react'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return { session: null, isLoading: false, isAuthenticated: false }
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const value = {
    session,
    isLoading,
    isAuthenticated: !!session,
  }

  return AuthContext.Provider ? children : children
}
