import { useState } from 'react'
import Home from './pages/Home'
import MapPage from './pages/MapPage'

// simple client-side routing without any library
// just track current page in state
export default function App() {
  const [page, setPage] = useState<'home' | 'map'>('home')

  if (page === 'map') return <MapPage onBack={() => setPage('home')} />
  return <Home onOpenMap={() => setPage('map')} />
}