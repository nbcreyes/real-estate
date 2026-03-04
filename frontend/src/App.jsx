import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<div className="text-2xl font-bold text-primary-600 p-8">Real Estate Platform</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}