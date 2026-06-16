import AuthGate from '@/components/AuthGate'
import BottomNav from '@/components/BottomNav'

export default function CapitanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGate
      title="Acceso Capitán"
      subtitle="Administra tu plantilla, pagos y sanciones"
    >
      <div style={{ minHeight: '100dvh' }}>
        <main className="pb-safe">{children}</main>
        <BottomNav />
      </div>
    </AuthGate>
  )
}
