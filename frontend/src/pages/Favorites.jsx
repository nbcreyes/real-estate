import { useState, useEffect } from "react"
import api from "../services/api"
import PropertyCard from "../components/PropertyCard"

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites")
      setFavorites(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleFavoriteToggle = (propertyId) => {
    setFavorites(prev => prev.filter(f => f.property_id !== propertyId))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-400 text-lg">No favorites yet</p>
          <p className="text-gray-400 text-sm mt-1">Browse properties and click the heart icon to save them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map(favorite => (
            <PropertyCard
              key={favorite.id}
              property={favorite.property}
              onFavoriteToggle={() => handleFavoriteToggle(favorite.property_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}