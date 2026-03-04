import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import PropertyCard from "../components/PropertyCard"
import Button from "../components/Button"

export default function AgentDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [agent, setAgent] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [inquiryStatus, setInquiryStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const [agentRes, propertiesRes] = await Promise.all([
          api.get(`/agents/${id}`),
          api.get(`/properties?per_page=50`),
        ])
        setAgent(agentRes.data)
        setProperties(propertiesRes.data.properties.filter(p => p.agent_id === parseInt(id)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgent()
  }, [id])

  const handleInquiry = async (e) => {
    e.preventDefault()
    if (!user || properties.length === 0) return
    setSubmitting(true)
    try {
      await api.post("/inquiries", {
        property_id: properties[0].id,
        agent_id: parseInt(id),
        message,
      })
      setInquiryStatus("success")
      setMessage("")
    } catch (err) {
      setInquiryStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <p className="text-gray-500">Agent not found</p>
        <Link to="/agents" className="text-primary-600 text-sm mt-2 hover:underline">Back to agents</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0">
                {agent.photo ? (
                  <img src={agent.photo} alt={agent.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary-600 text-3xl font-bold">
                    {agent.user.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{agent.user.name}</h1>
                <p className="text-gray-500">{agent.agency}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {agent.rating.toFixed(1)} rating
                  </span>
                  <span>{agent.listings_count} listings</span>
                </div>
              </div>
            </div>
            {agent.bio && (
              <div className="mb-4">
                <h2 className="font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-600 leading-relaxed">{agent.bio}</p>
              </div>
            )}
            {agent.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Phone:</span>
                <span>{agent.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <span className="font-medium">Email:</span>
              <span>{agent.user.email}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Send a Message</h2>
          {!user ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">Login to contact this agent</p>
              <Link to="/login"><Button className="w-full">Login</Button></Link>
            </div>
          ) : properties.length === 0 ? (
            <p className="text-gray-500 text-sm">This agent has no active listings to inquire about.</p>
          ) : inquiryStatus === "success" ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium">Message sent!</p>
              <p className="text-gray-500 text-sm mt-1">The agent will get back to you shortly.</p>
              <Button variant="ghost" size="sm" className="mt-3" onClick={() => setInquiryStatus(null)}>
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleInquiry} className="flex flex-col gap-3">
              <textarea
                rows={5}
                placeholder="Hi, I am interested in one of your listings..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              {inquiryStatus === "error" && (
                <p className="text-red-500 text-xs">Failed to send. Please try again.</p>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Listings by {agent.user.name}
      </h2>
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400">No active listings from this agent</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}