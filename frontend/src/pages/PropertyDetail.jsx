import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"

export default function PropertyDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [inquiry, setInquiry] = useState({ message: "" })
  const [inquiryStatus, setInquiryStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`)
        setProperty(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const handleInquiry = async (e) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await api.post("/inquiries", {
        property_id: property.id,
        agent_id: property.agent_id,
        message: inquiry.message,
      })
      setInquiryStatus("success")
      setInquiry({ message: "" })
    } catch (err) {
      setInquiryStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <p className="text-gray-500">Property not found</p>
        <Link to="/properties" className="text-primary-600 text-sm mt-2 hover:underline">Back to listings</Link>
      </div>
    )
  }

  const images = property.images || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {lightbox && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl">&times;</button>
          <button
            className="absolute left-4 text-white text-3xl px-4"
            onClick={e => { e.stopPropagation(); setActiveImage(i => (i - 1 + images.length) % images.length) }}
          >&lsaquo;</button>
          <img
            src={images[activeImage]?.url}
            alt="Property"
            className="max-h-screen max-w-5xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-3xl px-4"
            onClick={e => { e.stopPropagation(); setActiveImage(i => (i + 1) % images.length) }}
          >&rsaquo;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div
          className="h-80 bg-gray-200 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => { setActiveImage(0); setLightbox(true) }}
        >
          {images[0] ? (
            <img src={images[0].url} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((img, i) => (
            <div
              key={img.id}
              className="h-36 bg-gray-200 rounded-xl overflow-hidden cursor-pointer relative"
              onClick={() => { setActiveImage(i + 1); setLightbox(true) }}
            >
              <img src={img.url} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              {i === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold">
                  +{images.length - 5} more
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${property.type === "sale" ? "bg-primary-100 text-primary-700" : "bg-green-100 text-green-700"}`}>
                For {property.type === "sale" ? "Sale" : "Rent"}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{property.title}</h1>
              <p className="text-gray-500 mt-1">{property.address}, {property.city}, {property.state}</p>
            </div>
            <p className="text-2xl font-bold text-primary-600">
              ${property.price.toLocaleString()}{property.type === "rent" ? "/mo" : ""}
            </p>
          </div>

          <div className="flex gap-6 py-4 border-y border-gray-100 my-6">
            {property.bedrooms > 0 && (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{property.bedrooms}</p>
                <p className="text-sm text-gray-500">Bedrooms</p>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{property.bathrooms}</p>
                <p className="text-sm text-gray-500">Bathrooms</p>
              </div>
            )}
            {property.area && (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{property.area.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Sq Ft</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 capitalize">{property.property_type}</p>
              <p className="text-sm text-gray-500">Type</p>
            </div>
          </div>

          {property.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About this property</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Agent</h3>
            {user ? (
              inquiryStatus === "success" ? (
                <div className="text-center py-4">
                  <p className="text-green-600 font-medium">Message sent!</p>
                  <p className="text-gray-500 text-sm mt-1">The agent will get back to you shortly.</p>
                  <Button variant="ghost" size="sm" className="mt-3" onClick={() => setInquiryStatus(null)}>Send another</Button>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="flex flex-col gap-3">
                  <textarea
                    rows={4}
                    placeholder="Hi, I am interested in this property..."
                    value={inquiry.message}
                    onChange={e => setInquiry({ message: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  {inquiryStatus === "error" && (
                    <p className="text-red-500 text-xs">Failed to send message. Please try again.</p>
                  )}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">Login to contact the agent</p>
                <Link to="/login"><Button className="w-full">Login</Button></Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Property Details</h3>
            <ul className="text-sm text-gray-600 space-y-2 mt-3">
              <li className="flex justify-between"><span className="text-gray-400">Status</span><span className="capitalize font-medium">{property.status}</span></li>
              <li className="flex justify-between"><span className="text-gray-400">Type</span><span className="capitalize font-medium">{property.property_type}</span></li>
              <li className="flex justify-between"><span className="text-gray-400">Listing</span><span className="capitalize font-medium">For {property.type}</span></li>
              {property.area && <li className="flex justify-between"><span className="text-gray-400">Area</span><span className="font-medium">{property.area.toLocaleString()} sqft</span></li>}
              <li className="flex justify-between"><span className="text-gray-400">City</span><span className="font-medium">{property.city}</span></li>
              <li className="flex justify-between"><span className="text-gray-400">State</span><span className="font-medium">{property.state}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}