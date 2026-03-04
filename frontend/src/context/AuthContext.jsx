import { createContext, useContext, useState } from "react"
import api from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })
    const { access_token, user } = res.data
    localStorage.setItem("token", access_token)
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (name, email, password, role = "buyer") => {
    const res = await api.post("/auth/register", { name, email, password, role })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}