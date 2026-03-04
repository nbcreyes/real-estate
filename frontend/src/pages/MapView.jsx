import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Link } from "react-router-dom"
import L from "leaflet"
import api from "../services/api"
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

export default function MapView() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: "", city: "" })

  const fetchProperties = async (currentFilters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("per_page", 50)
      if (currentFilters.type) params.set("type", currentFilters.type)
      if (currentFilters.city) params.set("city", currentFilters.city)
      const res = await api.get(`/properties?${params.toString()}`)
      setProperties(res.data.properties.filter(p => p.latitude && p.longitude))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(filters)
  }, [])

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    fetchProperties(updated)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <h1 className="font-semibold text-gray-900">Map View</h1>
        <select
          value={filters.type}
          onChange={e => handleFilterChange("type", e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Listings</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <input
          type="text"
          placeholder="Filter by city..."
          value={filters.city}
          onChange={e => handleFilterChange("city", e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-sm text-gray-500">{properties.length} properties shown</span>
      </div>

      {loading ? (
        <div className="flex-1 bg-gray-200 animate-pulse" />
      ) : (
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={11}
          className="flex-1 z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {properties.map(property => (
            <Marker key={property.id} position={[property.latitude, property.longitude]}>
              <Popup>
                <div className="w-48">
                  {property.images?.[0] && (
                    <img src={property.images[0].url} alt={property.title} className="w-full h-24 object-cover rounded mb-2" />
                  )}
                  <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
                  <p className="text-primary-600 font-bold text-sm mt-1">
                    ${property.price.toLocaleString()}{property.type === "rent" ? "/mo" : ""}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{property.city}, {property.state}</p>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    {property.bedrooms > 0 && <span>{property.bedrooms} beds</span>}
                    {property.bathrooms > 0 && <span>{property.bathrooms} baths</span>}
                  </div>
                  <Link
                    to={`/properties/${property.id}`}
                    className="block mt-2 text-center text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700"
                  >
                    View Property
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}