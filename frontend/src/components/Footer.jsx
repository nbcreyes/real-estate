import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">EstateHub</h3>
            <p className="text-sm">Find your perfect property with the help of our expert agents.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Agents</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Map View</Link></li>
              <li><Link to="/mortgage" className="hover:text-white transition-colors">Mortgage Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} EstateHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}