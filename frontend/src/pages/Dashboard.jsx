import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import DashboardLayout from "../components/DashboardLayout"

function StatCard({ label, value, to }) {
  return (
    <Link to={to} className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <p className="text-3xl font-bold text-primary-600">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </Link>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ properties: 0, agents: 0, users: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propertiesRes, agentsRes] = await Promise.all([
          api.get("/properties?per_page=1"),
          api.get("/agents"),
        ])
        setStats({
          properties: propertiesRes.data.total,
          agents: agentsRes.data.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Overview</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Properties" value={stats.properties} to="/dashboard/properties" />
          <StatCard label="Total Agents" value={stats.agents} to="/dashboard/agents" />
          <StatCard label="Manage Users" value="View" to="/dashboard/users" />
        </div>
      )}
    </DashboardLayout>
  )
}