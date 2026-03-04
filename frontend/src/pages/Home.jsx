import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useEffect } from "react"
import api from "../services/api"
import PropertyCard from "../components/PropertyCard"
import Button from "../components/Button"
import Input from "../components/Input"

export default function Home() {
  const [search, setSearch] = useState("")
  const [listingType, setListingType] = useState("")
  const [featured, setFeatured] = useState([])
  const [stats, setStats] = useState({ total: 0, cities: 0, agents: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, agentsRes] = await Promise.all([
          api.get("/properties?per_page=3"),
          api.get("/agents"),
        ])
        setFeatured(propertiesRes.data.properties)
        const cities = new Set(propertiesRes.data.properties.map(p => p.city)).size
        setStats({
          total: propertiesRes.data.total,
          cities,
          agents: agentsRes.data.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("city", search)
    if (listingType) params.set("type", listingType)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home</h1>
          <p className="text-primary-100 text-lg mb-10">Browse thousands of properties for sale and rent across the country.</p>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-xl">
            <input
              type="text"
              placeholder="Search by city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <select
              value={listingType}
              onChange={e => setListingType(e.target.value)}
              className="px-4 py-2 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">Buy or Rent</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <Button type="submit" size="lg">Search</Button>
          </form>
        </div>
      </section>

      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary-600">{stats.total}+</p>
            <p className="text-gray-500 text-sm mt-1">Active Listings</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary-600">{stats.cities}+</p>
            <p className="text-gray-500 text-sm mt-1">Cities Covered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary-600">{stats.agents}+</p>
            <p className="text-gray-500 text-sm mt-1">Expert Agents</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
          <Link to="/properties" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Home?</h2>
          <p className="text-primary-100 mb-8">Browse our full listings or connect with one of our expert agents today.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/properties"><Button variant="secondary" size="lg">Browse Properties</Button></Link>
            <Link to="/agents"><Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">Meet Our Agents</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}