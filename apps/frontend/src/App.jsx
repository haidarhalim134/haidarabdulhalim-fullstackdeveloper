import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'

export default function App() {
  return (
    <div className="p-6">
      {/* <nav className="flex gap-4 mb-6">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link>
        <Link to="/about" className="text-blue-500 hover:underline">About</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}