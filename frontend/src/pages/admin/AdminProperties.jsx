import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import DashboardLayout from "../../components/DashboardLayout"
import Button from "../../components/Button"

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const perPage = 10

  const fetchProperties = async (currentPage) => {
    setLoading(true)
    try {
      const res = await api.get(`/properties?page=${currentPage}&per_page=${perPage}&status=active`)
      setProperties(res.data.properties)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(page)
  }, [page])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return
    try {
      await api.delete(`/properties/${id}`)
      fetchProperties(page)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/properties/${id}`, { status })
      fetchProperties(page)
    } catch (err) {
      console.error(err)
    }
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <p className="text-sm text-gray-500">{total} total</p>
      </div>
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">City</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map(property => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                    <Link to={`/properties/${property.id}`} className="hover:text-primary-600">
                      {property.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{property.city}</td>
                  <td className="px-4 py-3 text-gray-600">${property.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{property.type}</td>
                  <td className="px-4 py-3">
                    <select
                      value={property.status}
                      onChange={e => handleStatusChange(property.id, e.target.value)}
                      className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}