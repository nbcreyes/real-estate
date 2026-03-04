import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">EstateHub</Link>
          <div className="flex items-center gap-6">
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
        </div>
      </div>
    </nav>
  )
}