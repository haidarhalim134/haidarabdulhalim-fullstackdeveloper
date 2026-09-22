import * as React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ProtectedRoute from './components/protectedRoute'
import { AuthProvider } from './context/authContext'

export default function App() {

  return (
    <AuthProvider>
      <div className="p-6">
        {/* <nav className="flex gap-4 mb-6">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/about" className="text-blue-500 hover:underline">About</Link>
        </nav> */}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<>aosdufoasdufio</>} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}