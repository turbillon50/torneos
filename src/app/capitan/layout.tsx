import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CapitanNav from './CapitanNav'

export default async function CapitanLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <CapitanNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
    </div>
  )
}
