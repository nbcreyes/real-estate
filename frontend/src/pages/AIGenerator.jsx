import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import Button from "../components/Button"
import Input from "../components/Input"

export default function AIGenerator() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    property_type: "apartment",
    listing_type: "sale",
    bedrooms: "",
    bathrooms: "",
    area: "",
    city: "",
    state: "",
    price: "",
    extra_details: "",
  })
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.post("/ai/generate-description", {
        ...form,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        area: parseFloat(form.area),
        price: parseFloat(form.price),
      })
      setDescription(res.data.description)
    } catch (err) {
      setError("Failed to generate description. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUseDescription = () => {
    navigate("/create-listing", { state: { description, ...form } })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Description Generator</h1>
      <p className="text-gray-500 mb-8">Fill in your property details and let AI write a professional listing description for you.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <Input
              label="Property Title"
              name="title"
              placeholder="e.g. Modern Downtown Apartment"
              value={form.title}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Listing Type</label>
                <select
                  name="listing_type"
                  value={form.listing_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Bedrooms"
                name="bedrooms"
                type="number"
                placeholder="e.g. 3"
                value={form.bedrooms}
                onChange={handleChange}
                required
              />
              <Input
                label="Bathrooms"
                name="bathrooms"
                type="number"
                placeholder="e.g. 2"
                value={form.bathrooms}
                onChange={handleChange}
                required
              />
              <Input
                label="Area (sqft)"
                name="area"
                type="number"
                placeholder="e.g. 1200"
                value={form.area}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                placeholder="e.g. New York"
                value={form.city}
                onChange={handleChange}
                required
              />
              <Input
                label="State"
                name="state"
                placeholder="e.g. NY"
                value={form.state}
                onChange={handleChange}
                required
              />
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Extra Details (optional)</label>
              <textarea
                name="extra_details"
                rows={3}
                placeholder="e.g. Rooftop access, gym, floor-to-ceiling windows..."
                value={form.extra_details}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Description"}
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          {description ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-900">Generated Description</h2>
              <textarea
                rows={8}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <p className="text-xs text-gray-400">You can edit the description above before using it.</p>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleUseDescription}>
                  Use This Description
                </Button>
                <Button variant="secondary" onClick={handleGenerate} disabled={loading}>
                  Regenerate
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center h-full text-center gap-3 min-h-64">
              <p className="text-gray-400">Your AI generated description will appear here.</p>
              <p className="text-gray-400 text-sm">Fill in the form and click Generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}