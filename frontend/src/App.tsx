import { useState } from 'react'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import StatsPage from './pages/StatsPage'

type Page = 'home' | 'map' | 'stats'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'map')   return <MapPage   onBack={() => setPage('home')} />
  if (page === 'stats') return <StatsPage onBack={() => setPage('home')} />
  return <Home onOpenMap={() => setPage('map')}
               onOpenStats={() => setPage('stats')} />
}