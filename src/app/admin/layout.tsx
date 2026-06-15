import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AdminNav from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  // TODO: verificar rol admin via Clerk metadata
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: 220 }}>
        {children}
      </main>
    </div>
  )
}
