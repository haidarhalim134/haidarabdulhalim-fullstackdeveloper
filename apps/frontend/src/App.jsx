import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return <h1 className="text-3xl font-bold text-blue-600">Home Page</h1>
}

function About() {
  return <h1 className="text-3xl font-bold text-green-600">About Page</h1>
}

export default function App() {
  return (
    <div className="p-6">
      <nav className="flex gap-4 mb-6">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link>
        <Link to="/about" className="text-blue-500 hover:underline">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}