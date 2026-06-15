import CapitanNav from './CapitanNav'

export default function CapitanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <CapitanNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
    </div>
  )
}
