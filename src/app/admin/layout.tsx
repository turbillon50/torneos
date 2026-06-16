import AuthGate from '@/components/AuthGate'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGate
      title="Acceso Admin"
      subtitle="Panel de operación de la Liga S2"
    >
      {children}
    </AuthGate>
  )
}
