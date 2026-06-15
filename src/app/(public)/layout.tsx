'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/tabla', label: '🏆 Tabla' },
  { href: '/calendario', label: '📅 Partidos' },
  { href: '/equipos', label: '👥 Equipos' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a', padding: '0 16px'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', height: 56, gap: 8 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
            <div style={{ width: 30, height: 30, background: '#CCFF00', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000' }}>S2</div>
          </Link>
          <div style={{ display: 'flex', gap: 4, flex: 1, overflowX: 'auto' }}>
            {navItems.map(item => (
              <Link key={item.href} href={item.href} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: 'none', whiteSpace: 'nowrap',
                color: pathname === item.href ? '#000' : '#888',
                background: pathname === item.href ? '#CCFF00' : 'transparent',
              }}>{item.label}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isSignedIn ? (
              <>
                <Link href="/capitan" style={{ fontSize: 12, color: '#CCFF00', textDecoration: 'none', padding: '5px 10px', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 6 }}>Mi Panel</Link>
                <UserButton />
              </>
            ) : (
              <Link href="/sign-in" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Entrar</Link>
            )}
          </div>
        </div>
      </nav>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
    </div>
  )
}
