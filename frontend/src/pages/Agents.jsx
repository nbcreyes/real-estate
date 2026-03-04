import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents")
        setAgents(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Agents</h1>
      <p className="text-gray-500 mb-8">Connect with our expert real estate agents.</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-400 text-lg">No agents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <Link key={agent.id} to={`/agents/${agent.id}`} className="block group">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0">
                    {agent.photo ? (
                      <img src={agent.photo} alt={agent.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-600 text-xl font-bold">
                        {agent.user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {agent.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{agent.agency}</p>
                  </div>
                </div>
                {agent.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{agent.bio}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{agent.listings_count} listings</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium text-gray-700">{agent.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}