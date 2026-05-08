import { useEffect, useState } from 'react'

type BoroughData = { f1: number; segments: number }
type ModelData   = { f1: number; auc: number }

type StatsData = {
  total_crashes: number
  total_segments: number
  date_range: string
  model_f1: number
  model_auc: number
  risk_distribution: { low: number; moderate: number; high: number }
}

type BoroughStats = {
  boroughs: Record<string, BoroughData>
  models:   Record<string, ModelData>
}

const API = 'http://localhost:8000'

// simple horizontal bar
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ background: '#f0f0f0', borderRadius: 4, height: 8, flex: 1 }}>
      <div style={{
        width: `${(value / max) * 100}%`,
        background: color, borderRadius: 4, height: 8,
        transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

export default function StatsPage({ onBack }: { onBack: () => void }) {
  const [stats, setStats]     = useState<StatsData | null>(null)
  const [borough, setBorough] = useState<BoroughStats | null>(null)

  useEffect(() => {
    fetch(`${API}/stats`).then(r => r.json()).then(setStats)
    fetch(`${API}/borough-stats`).then(r => r.json()).then(setBorough)
  }, [])

  const card = (children: React.ReactNode) => (
    <div style={{
      background: 'white', borderRadius: 12,
      padding: 24, border: '1px solid #f0f0f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      marginBottom: 20,
    }}>
      {children}
    </div>
  )

  const sectionTitle = (title: string) => (
    <div style={{ fontSize: 13, fontWeight: 700, color: '#2d3436',
      marginBottom: 16, paddingBottom: 8,
      borderBottom: '1px solid #f0f0f0' }}>
      {title}
    </div>
  )

  if (!stats || !borough) return (
    <div style={{ display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: '100vh', color: '#999' }}>
      Loading...
    </div>
  )

  const riskTotal = stats.risk_distribution.low +
                    stats.risk_distribution.moderate +
                    stats.risk_distribution.high

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>

      {/* header */}
      <header style={{
        background: 'white', borderBottom: '1px solid #e0e0e0',
        padding: '12px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#2d3436' }}>
            Project Statistics
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

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* summary numbers */}
        {card(<>
          {sectionTitle('Dataset Summary')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { label: 'Crash Records',  value: '461,425' },
              { label: 'Road Segments',  value: '122,272' },
              { label: 'Date Range',     value: '2021–2026' },
              { label: 'NYC Boroughs',   value: '5' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#2d3436' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* risk distribution */}
        {card(<>
          {sectionTitle('Risk Class Distribution')}
          {[
            { label: 'Low Risk',      count: stats.risk_distribution.low,      color: '#00b894' },
            { label: 'Moderate Risk', count: stats.risk_distribution.moderate, color: '#fdcb6e' },
            { label: 'High Risk',     count: stats.risk_distribution.high,     color: '#e17055' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center',
              gap: 12, marginBottom: 14,
            }}>
              <div style={{ width: 110, fontSize: 13, color: '#636e72' }}>
                {r.label}
              </div>
              <Bar value={r.count} max={riskTotal} color={r.color} />
              <div style={{ width: 60, fontSize: 12,
                fontWeight: 700, color: '#2d3436', textAlign: 'right' }}>
                {r.count.toLocaleString()}
              </div>
              <div style={{ width: 40, fontSize: 11, color: '#999' }}>
                {((r.count / riskTotal) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </>)}

        {/* model comparison */}
        {card(<>
          {sectionTitle('Model Comparison')}
          <div style={{ display: 'grid',
            gridTemplateColumns: '1fr 80px 80px', gap: 0 }}>
            {/* header row */}
            {['Model', 'F1 Score', 'ROC-AUC'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700,
                color: '#b2bec3', padding: '6px 0',
                borderBottom: '1px solid #f0f0f0',
                textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {h}
              </div>
            ))}
            {/* model rows */}
            {Object.entries(borough.models).map(([name, m], i) => (
              <>
                <div key={name} style={{
                  padding: '12px 0', fontSize: 13,
                  color: '#2d3436', fontWeight: i === 0 ? 700 : 400,
                  borderBottom: '1px solid #f8f8f8',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {i === 0 && (
                    <span style={{ background: '#eef2ff', color: '#4a6cf7',
                      fontSize: 10, padding: '2px 7px',
                      borderRadius: 10, fontWeight: 700 }}>
                      Best
                    </span>
                  )}
                  {name}
                </div>
                <div key={name+'f1'} style={{ padding: '12px 0',
                  fontSize: 13, fontWeight: 600,
                  color: i === 0 ? '#00b894' : '#2d3436',
                  borderBottom: '1px solid #f8f8f8' }}>
                  {m.f1.toFixed(3)}
                </div>
                <div key={name+'auc'} style={{ padding: '12px 0',
                  fontSize: 13, color: '#636e72',
                  borderBottom: '1px solid #f8f8f8' }}>
                  {m.auc.toFixed(3)}
                </div>
              </>
            ))}
          </div>
        </>)}

        {/* borough F1 */}
        {card(<>
          {sectionTitle('F1 Score by Borough (Random Forest)')}
          {Object.entries(borough.boroughs).map(([name, b]) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center',
              gap: 12, marginBottom: 14,
            }}>
              <div style={{ width: 100, fontSize: 13, color: '#636e72' }}>
                {name}
              </div>
              <Bar value={b.f1} max={1} color='#4a6cf7' />
              <div style={{ width: 50, fontSize: 12,
                fontWeight: 700, color: '#2d3436', textAlign: 'right' }}>
                {b.f1.toFixed(3)}
              </div>
              <div style={{ width: 60, fontSize: 11, color: '#999' }}>
                {b.segments.toLocaleString()} segs
              </div>
            </div>
          ))}
        </>)}

      </div>
    </div>
  )
}
