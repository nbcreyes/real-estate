import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../services/api"
import Button from "../components/Button"
import Input from "../components/Input"

export default function CreateListing() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefilled = location.state || {}

  const [form, setForm] = useState({
    title: prefilled.title || "",
    description: prefilled.description || "",
    price: prefilled.price || "",
    type: prefilled.listing_type || "sale",
    property_type: prefilled.property_type || "apartment",
    bedrooms: prefilled.bedrooms || "",
    bathrooms: prefilled.bathrooms || "",
    area: prefilled.area || "",
    address: "",
    city: prefilled.city || "",
    state: prefilled.state || "",
    latitude: "",
    longitude: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.post("/properties", {
        ...form,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        area: parseFloat(form.area),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      })
      navigate(`/properties/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create listing. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Listing</h1>
      <p className="text-gray-500 mb-8">Fill in your property details to publish a new listing.</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Title"
            name="title"
            placeholder="e.g. Modern Downtown Apartment"
            value={form.title}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={5}
              placeholder="Describe the property..."
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            {!form.description && (
              <p className="text-xs text-primary-600 mt-1">
                Tip: Use the <a href="/ai-generator" className="underline">AI Generator</a> to write a professional description.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Listing Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Property Type</label>
              <select
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>

          <Input
            label="Price ($)"
            name="price"
            type="number"
            placeholder="e.g. 450000"
            value={form.price}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Bedrooms"
              name="bedrooms"
              type="number"
              placeholder="e.g. 3"
              value={form.bedrooms}
              onChange={handleChange}
            />
            <Input
              label="Bathrooms"
              name="bathrooms"
              type="number"
              placeholder="e.g. 2"
              value={form.bathrooms}
              onChange={handleChange}
            />
            <Input
              label="Area (sqft)"
              name="area"
              type="number"
              placeholder="e.g. 1200"
              value={form.area}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Address"
            name="address"
            placeholder="e.g. 123 Main St"
            value={form.address}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              placeholder="e.g. New York"
              value={form.city}
              onChange={handleChange}
            />
            <Input
              label="State"
              name="state"
              placeholder="e.g. NY"
              value={form.state}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude (optional)"
              name="latitude"
              type="number"
              step="any"
              placeholder="e.g. 40.7128"
              value={form.latitude}
              onChange={handleChange}
            />
            <Input
              label="Longitude (optional)"
              name="longitude"
              type="number"
              step="any"
              placeholder="e.g. -74.0060"
              value={form.longitude}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <Button type="submit" size="lg" className="flex-1" disabled={loading}>
              {loading ? "Publishing..." : "Publish Listing"}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}