'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/partidos', label: 'Partidos', icon: '⚽' },
  { href: '/admin/equipos', label: 'Equipos', icon: '👥' },
  { href: '/admin/jugadores', label: 'Jugadores', icon: '👕' },
  { href: '/admin/arbitros', label: 'Árbitros', icon: '🟨' },
  { href: '/admin/pagos', label: 'Pagos', icon: '💳' },
  { href: '/admin/notificaciones', label: 'Avisos', icon: '🔔' },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
      background: '#0a0a0a', borderRight: '1px solid #1a1a1a',
      display: 'flex', flexDirection: 'column', padding: '20px 12px', zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, paddingLeft: 4 }}>
        <div style={{ width: 32, height: 32, background: '#CCFF00', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 14, color: '#000' }}>S2</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13 }}>S2 Sport</div>
          <div style={{ fontSize: 10, color: '#555' }}>Admin Panel</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600,
              color: active ? '#000' : '#888',
              background: active ? '#CCFF00' : 'transparent',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>

      <div style={{ paddingTop: 16, borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
        <UserButton />
        <Link href="/" style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>← Sitio</Link>
      </div>
    </nav>
  )
}
