import BottomNav from '@/components/BottomNav'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100dvh' }}>
      <main className="pb-safe">{children}</main>
      <BottomNav />
    </div>
  )
}
