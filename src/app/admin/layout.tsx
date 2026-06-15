import AdminNav from './AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: 220 }}>
        {children}
      </main>
    </div>
  )
}
