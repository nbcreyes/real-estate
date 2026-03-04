import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const navItems = [
  { label: "Overview", path: "/dashboard" },
  { label: "Properties", path: "/dashboard/properties" },
  { label: "Agents", path: "/dashboard/agents" },
  { label: "Users", path: "/dashboard/users" },
]

export default function DashboardLayout({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 shrink-0">
        <div className="p-5 border-b border-gray-200">
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}