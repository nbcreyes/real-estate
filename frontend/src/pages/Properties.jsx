import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../services/api"
import PropertyCard from "../components/PropertyCard"
import Button from "../components/Button"
import Input from "../components/Input"

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 9

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    property_type: "",
    min_price: "",
    max_price: "",
    bedrooms: "",
  })

  const fetchProperties = async (currentFilters, currentPage) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", currentPage)
      params.set("per_page", perPage)
      if (currentFilters.city) params.set("city", currentFilters.city)
      if (currentFilters.type) params.set("type", currentFilters.type)
      if (currentFilters.property_type) params.set("property_type", currentFilters.property_type)
      if (currentFilters.min_price) params.set("min_price", currentFilters.min_price)
      if (currentFilters.max_price) params.set("max_price", currentFilters.max_price)
      if (currentFilters.bedrooms) params.set("bedrooms", currentFilters.bedrooms)
      const res = await api.get(`/properties?${params.toString()}`)
      setProperties(res.data.properties)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(filters, page)
  }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProperties(filters, 1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    const reset = { city: "", type: "", property_type: "", min_price: "", max_price: "", bedrooms: "" }
    setFilters(reset)
    setPage(1)
    fetchProperties(reset, 1)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Properties</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Filters</h2>
            <Input
              label="City"
              placeholder="e.g. New York"
              value={filters.city}
              onChange={e => handleFilterChange("city", e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Listing Type</label>
              <select
                value={filters.type}
                onChange={e => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Property Type</label>
              <select
                value={filters.property_type}
                onChange={e => handleFilterChange("property_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={filters.min_price}
                onChange={e => handleFilterChange("min_price", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                placeholder="e.g. 1000000"
                value={filters.max_price}
                onChange={e => handleFilterChange("max_price", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Min Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={e => handleFilterChange("bedrooms", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Apply Filters</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={handleReset}>Reset</Button>
          </form>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{total} properties found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-400 text-lg">No properties found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}