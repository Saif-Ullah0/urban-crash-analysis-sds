const stats = [
  { value: '500K', label: 'Crash Records' },
  { value: '122K', label: 'Road Segments' },
  { value: '89%',  label: 'Model Accuracy' },
  { value: '5',    label: 'NYC Boroughs' },
]

const features = [
  {
    icon: '🗺',
    title: 'Interactive Risk Map',
    desc: 'Every road segment in NYC colored by collision risk — Low, Moderate, or High — based on crash history and road features.',
  },
  {
    icon: '🔀',
    title: 'Safe Route Finder',
    desc: 'Given two points, find three routes — safest, shortest, and balanced. Compare risk scores and high-risk segments crossed.',
  },
  {
    icon: '🤖',
    title: 'ML Risk Prediction',
    desc: 'XGBoost classifier trained on road infrastructure features achieving F1 of 0.848 and AUC of 0.971.',
  },
  {
    icon: '📊',
    title: 'Borough Analysis',
    desc: 'Consistent F1 scores from 0.830 to 0.852 across all five NYC boroughs — generalizes well geographically.',
  },
]

const pipeline = [
  'Data Collection', 'Cleaning + CSI', 'Spatial Join',
  'Feature Engineering', 'Model Training', 'Risk Map',
]

export default function Home({ onOpenMap }: { onOpenMap: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>

      {/* header */}
      <header style={{
        background: 'white', borderBottom: '1px solid #e0e0e0',
        padding: '14px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#2d3436' }}>
            Urban Crash Analytics
          </div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
            Information Technology University — Spatial Data Science & ML
          </div>
        </div>
        <button onClick={onOpenMap} style={{
          background: '#2d3436', color: 'white',
          border: 'none', borderRadius: 8,
          padding: '9px 20px', fontSize: 13,
          fontWeight: 600, cursor: 'pointer',
        }}>
          Open Map →
        </button>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>

        {/* hero */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-block', background: '#eef2ff',
            color: '#4a6cf7', fontSize: 12, fontWeight: 700,
            padding: '4px 14px', borderRadius: 20, marginBottom: 16,
          }}>
            XGBoost · F1 0.848 · AUC 0.971
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#2d3436',
            lineHeight: 1.3, marginBottom: 16 }}>
            Predicting Road Collision Risk<br />Before Accidents Happen
          </h1>
          <p style={{ color: '#636e72', maxWidth: 520,
            margin: '0 auto', lineHeight: 1.8, fontSize: 14 }}>
            We analyzed 500,000 crash records across NYC and trained a machine
            learning model to predict which road segments are dangerous —
            using road design features alone, before any accident occurs.
          </p>
          <div style={{ marginTop: 28, display: 'flex',
            gap: 12, justifyContent: 'center' }}>
            <button onClick={onOpenMap} style={{
              background: '#2d3436', color: 'white',
              border: 'none', borderRadius: 8,
              padding: '12px 24px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}>
              Try Route Finder
            </button>
            <a href="https://github.com/Saif-Ullah0/urban-crash-analysis-sds"
              target="_blank" rel="noreferrer"
              style={{
                border: '1px solid #ddd', borderRadius: 8,
                padding: '12px 24px', fontSize: 14,
                fontWeight: 600, color: '#2d3436',
                background: 'white', display: 'inline-block',
              }}>
              View on GitHub
            </a>
          </div>
        </div>

        {/* stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 60,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 12,
              padding: '20px 16px', textAlign: 'center',
              border: '1px solid #f0f0f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2d3436' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* features */}
        <h2 style={{ fontSize: 20, fontWeight: 700,
          marginBottom: 20, color: '#2d3436' }}>
          What This Project Does
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 16, marginBottom: 60,
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'white', borderRadius: 12,
              padding: '20px', border: '1px solid #f0f0f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14,
                marginBottom: 8, color: '#2d3436' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#636e72',
                lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* pipeline */}
        <h2 style={{ fontSize: 20, fontWeight: 700,
          marginBottom: 20, color: '#2d3436' }}>
          Project Pipeline
        </h2>
        <div style={{
          background: 'white', borderRadius: 12,
          padding: '24px', border: '1px solid #f0f0f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center',
          gap: 12, flexWrap: 'wrap',
        }}>
          {pipeline.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#2d3436', color: 'white',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#2d3436' }}>
                  {step}
                </span>
              </div>
              {i < pipeline.length - 1 && (
                <span style={{ color: '#ccc', fontSize: 16 }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ textAlign: 'center', marginTop: 60,
          fontSize: 12, color: '#b2bec3' }}>
          Saif Ullah · BSCS23065 · Information Technology University, Lahore
        </div>

      </div>
    </div>
  )
}