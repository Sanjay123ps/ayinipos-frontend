import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ayini_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  // TODO: replace with POST /api/auth/login once the backend is wired up
  async function login(username, password) {
    if (!username || !password) {
      throw new Error('Enter your username and password')
    }
    const fakeUser = { name: 'Admin', username, role: 'admin' }
    localStorage.setItem('ayini_user', JSON.stringify(fakeUser))
    setUser(fakeUser)
    return fakeUser
  }

  function logout() {
    localStorage.removeItem('ayini_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
