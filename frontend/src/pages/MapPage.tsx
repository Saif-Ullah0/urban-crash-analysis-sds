import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type RouteStats = {
  distance_km: number
  risk_score: number
  high_risk_segments: number
  coords: [number, number][]
}

type Routes = {
  safe: RouteStats
  shortest: RouteStats
  balanced: RouteStats
  error?: string
}

function RouteCard({ title, color, stats, recommended }: {
  title: string
  color: string
  stats: RouteStats
  recommended?: boolean
}) {
  return (
    <div style={{
      background: '#f8f9fa', borderRadius: 8,
      padding: '12px 14px', marginBottom: 10,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>
          {title}
        </span>
        {recommended && (
          <span style={{
            background: '#d4edda', color: '#155724',
            fontSize: 10, padding: '2px 8px',
            borderRadius: 10, fontWeight: 700,
          }}>
            Recommended
          </span>
        )}
      </div>
      {[
        ['Distance', `${stats.distance_km} km`],
        ['Risk Score', stats.risk_score],
        ['High Risk Segments', stats.high_risk_segments],
      ].map(([label, val]) => (
        <div key={label as string} style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, color: '#636e72', padding: '2px 0',
        }}>
          <span>{label}</span>
          <span style={{ fontWeight: 600, color: '#2d3436' }}>{val}</span>
        </div>
      ))}
    </div>
  )
}

export default function MapPage({ onBack }: { onBack: () => void }) {
  const mapDivRef  = useRef<HTMLDivElement>(null)
  const mapRef     = useRef<L.Map | null>(null)
  const startRef   = useRef<L.CircleMarker | null>(null)
  const endRef     = useRef<L.CircleMarker | null>(null)
  const routesRef  = useRef<L.Polyline[]>([])
  const clickCount = useRef(0)
  const startLL    = useRef<[number, number] | null>(null)
  const endLL      = useRef<[number, number] | null>(null)

  const [status, setStatus]   = useState('Click on the map to set start point.')
  const [routes, setRoutes]   = useState<Routes | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return

    const map = L.map(mapDivRef.current).setView([40.7128, -74.006], 12)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { attribution: '© CartoDB', maxZoom: 19 }
    ).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      if (clickCount.current === 0) {
        if (startRef.current) map.removeLayer(startRef.current)
        startRef.current = L.circleMarker([lat, lng], {
          radius: 8, fillColor: '#00b894',
          color: 'white', weight: 2, fillOpacity: 1,
        }).addTo(map).bindPopup('Start').openPopup()
        startLL.current = [lat, lng]
        setStatus('Start set. Now click your destination.')
        clickCount.current = 1
      } else if (clickCount.current === 1) {
        if (endRef.current) map.removeLayer(endRef.current)
        endRef.current = L.circleMarker([lat, lng], {
          radius: 8, fillColor: '#e17055',
          color: 'white', weight: 2, fillOpacity: 1,
        }).addTo(map).bindPopup('Destination').openPopup()
        endLL.current = [lat, lng]
        setStatus('Destination set. Press Find Routes.')
        clickCount.current = 2
      }
    })

    mapRef.current = map
  }, [])

  async function findRoutes() {
    if (!startLL.current || !endLL.current) {
      setStatus('Please set both start and destination first.')
      return
    }
    setLoading(true)
    setStatus('Calculating routes...')
    clearRoutes()

    try {
      const res = await fetch('http://localhost:8000/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_lat: startLL.current[0],
          start_lon: startLL.current[1],
          end_lat:   endLL.current[0],
          end_lon:   endLL.current[1],
        }),
      })
      const data: Routes = await res.json()

      if (data.error) {
        setStatus(data.error)
        setLoading(false)
        return
      }

      setRoutes(data)
      drawRoute(data.safe.coords,     '#00b894', 5, 'Safest Route')
      drawRoute(data.shortest.coords, '#4a6cf7', 4, 'Shortest Route')
      drawRoute(data.balanced.coords, '#e17055', 4, 'Balanced Route')
      setStatus('Done. See comparison below.')
    } catch {
      setStatus('Cannot connect to backend. Make sure it is running on port 8000.')
    }
    setLoading(false)
  }

  function drawRoute(coords: [number,number][], color: string,
    weight: number, label: string) {
    const map = mapRef.current
    if (!map || !coords.length) return
    const line = L.polyline(coords, { color, weight, opacity: 0.85 })
      .addTo(map).bindTooltip(label)
    routesRef.current.push(line)
    map.fitBounds(line.getBounds(), { padding: [40, 40] })
  }

  function clearRoutes() {
    routesRef.current.forEach(l => mapRef.current?.removeLayer(l))
    routesRef.current = []
    setRoutes(null)
  }

  function clearAll() {
    clearRoutes()
    const map = mapRef.current
    if (!map) return
    if (startRef.current) map.removeLayer(startRef.current)
    if (endRef.current)   map.removeLayer(endRef.current)
    startRef.current = null
    endRef.current   = null
    startLL.current  = null
    endLL.current    = null
    clickCount.current = 0
    setStatus('Click on the map to set start point.')
  }

  const panelStyle: React.CSSProperties = {
    width: 280, background: 'white',
    borderLeft: '1px solid #e0e0e0',
    display: 'flex', flexDirection: 'column',
    overflowY: 'auto', flexShrink: 0,
  }

  const sectionStyle: React.CSSProperties = {
    padding: '16px', borderBottom: '1px solid #f0f0f0',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 1,
    color: '#b2bec3', marginBottom: 10,
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '10px',
    borderRadius: 8, border: 'none',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer', marginBottom: 8,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* header */}
      <header style={{
        background: 'white', borderBottom: '1px solid #e0e0e0',
        padding: '12px 24px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#2d3436' }}>
            NYC Safe Route Finder
          </span>
          <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
            Urban Crash Analytics
          </span>
        </div>
        <button onClick={onBack} style={{
          background: 'none', border: 'none',
          fontSize: 13, color: '#636e72', cursor: 'pointer',
        }}>
          ← Back
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* map */}
        <div ref={mapDivRef} style={{ flex: 1 }} />

        {/* panel */}
        <div style={panelStyle}>

          <div style={sectionStyle}>
            <div style={labelStyle}>Instructions</div>
            <div style={{ fontSize: 13, color: '#636e72', lineHeight: 1.9 }}>
              <b style={{ color: '#2d3436' }}>1.</b> Click map to set start<br />
              <b style={{ color: '#2d3436' }}>2.</b> Click again for destination<br />
              <b style={{ color: '#2d3436' }}>3.</b> Press Find Routes
            </div>
            <div style={{
              marginTop: 10, fontSize: 12, color: '#636e72',
              background: '#f5f6fa', borderRadius: 6,
              padding: '8px 10px', borderLeft: '3px solid #4a6cf7',
            }}>
              {status}
            </div>
          </div>

          <div style={sectionStyle}>
            <button onClick={findRoutes} disabled={loading} style={{
              ...btnStyle,
              background: loading ? '#ccc' : '#2d3436',
              color: 'white',
            }}>
              {loading ? 'Calculating...' : 'Find Routes'}
            </button>
            <button onClick={clearAll} style={{
              ...btnStyle,
              background: '#f5f6fa',
              color: '#636e72',
              border: '1px solid #e0e0e0',
              marginBottom: 0,
            }}>
              Clear
            </button>
          </div>

          {routes && (
            <div style={sectionStyle}>
              <div style={labelStyle}>Route Comparison</div>
              <RouteCard title="Safest Route"   color="#00b894"
                stats={routes.safe}     recommended />
              <RouteCard title="Shortest Route" color="#4a6cf7"
                stats={routes.shortest} />
              <RouteCard title="Balanced Route" color="#e17055"
                stats={routes.balanced} />
            </div>
          )}

          <div style={sectionStyle}>
            <div style={labelStyle}>Legend</div>
            {[
              { color: '#00b894', label: 'Safest Route' },
              { color: '#4a6cf7', label: 'Shortest Route' },
              { color: '#e17055', label: 'Balanced Route' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center',
                gap: 8, marginBottom: 8,
                fontSize: 12, color: '#636e72',
              }}>
                <div style={{
                  width: 20, height: 3,
                  background: item.color, borderRadius: 2,
                }} />
                {item.label}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}