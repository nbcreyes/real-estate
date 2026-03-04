import { Link } from "react-router-dom"
import { useState } from "react"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(false)

  const primaryImage = property.images?.find(img => img.is_primary) || property.images?.[0]

  const handleFavorite = async (e) => {
    e.preventDefault()
    if (!user) return
    try {
      if (favorited) {
        await api.delete(`/favorites/${property.id}`)
      } else {
        await api.post(`/favorites/${property.id}`)
      }
      setFavorited(!favorited)
      onFavoriteToggle?.()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Link to={`/properties/${property.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 bg-gray-200">
          {primaryImage ? (
            <img src={primaryImage.url} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
          )}
          <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full ${property.type === "sale" ? "bg-primary-600 text-white" : "bg-green-600 text-white"}`}>
            For {property.type === "sale" ? "Sale" : "Rent"}
          </span>
          {user && (
            <button onClick={handleFavorite} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
              <span className={favorited ? "text-red-500" : "text-gray-400"}>♥</span>
            </button>
          )}
        </div>
        <div className="p-4">
          <p className="text-lg font-bold text-primary-600">
            ${property.price.toLocaleString()}{property.type === "rent" ? "/mo" : ""}
          </p>
          <h3 className="font-semibold text-gray-900 mt-1 truncate">{property.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{property.city}, {property.state}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            {property.bedrooms > 0 && <span>{property.bedrooms} beds</span>}
            {property.bathrooms > 0 && <span>{property.bathrooms} baths</span>}
            {property.area && <span>{property.area.toLocaleString()} sqft</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}