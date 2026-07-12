import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, login as apiLogin, logout as apiLogout } from '../services/api'

const AuthContext = createContext(null)

// The JWT payload (the middle, base64 section) is signed but not
// encrypted — decoding it client-side just reads back what the server
// already put there (sub/username/role), so the app can restore "who's
// logged in" on a page reload without a round trip. It is never used to
// authorize anything by itself; every real request still needs the full
// signed token, which the server verifies on every call.
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && Date.now() >= payload.exp * 1000) return null
    return { name: payload.username, username: payload.username, role: payload.role }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) setUser(decodeToken(token))
    setLoading(false)
  }, [])

  async function login(username, password) {
    if (!username || !password) {
      throw new Error('Enter your username and password')
    }
    const loggedInUser = await apiLogin(username, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  function logout() {
    apiLogout()
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
