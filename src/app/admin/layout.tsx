import AdminNav from './AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <AdminNav />
      {/* Desktop: margin-left para el sidebar */}
      {/* Mobile: padding-top para la topbar, padding-bottom para bottom nav */}
      <main style={{
        paddingTop: 'max(52px, env(safe-area-inset-top))',
        paddingBottom: 'calc(68px + env(safe-area-inset-bottom))',
        padding: '52px 0 calc(68px + env(safe-area-inset-bottom))'
      }}>
        <style>{`
          @media (min-width: 768px) {
            main { margin-left: 220px !important; padding: 32px 32px 32px 32px !important; }
          }
        `}</style>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
