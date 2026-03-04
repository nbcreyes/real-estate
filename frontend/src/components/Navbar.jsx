import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">EstateHub</Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/properties" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Properties</Link>
            <Link to="/agents" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Agents</Link>
            <Link to="/map" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Map</Link>
            <Link to="/mortgage" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Calculator</Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/favorites" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Favorites</Link>
                {(user.role === "agent" || user.role === "admin") && (
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Dashboard</Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            <Link to="/properties" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Properties</Link>
            <Link to="/agents" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Agents</Link>
            <Link to="/map" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Map</Link>
            <Link to="/mortgage" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Calculator</Link>
            {user ? (
              <>
                <Link to="/favorites" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Favorites</Link>
                {(user.role === "agent" || user.role === "admin") && (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="px-3 py-2 text-sm text-left text-red-500 hover:bg-gray-50 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}