'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const IconTable = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconTeam = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const navItems = [
  { href: '/tabla', label: 'Tabla', Icon: IconTable },
  { href: '/calendario', label: 'Partidos', Icon: IconCalendar },
  { href: '/equipos', label: 'Equipos', Icon: IconTeam },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 20px'
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', height: 52, gap: 8 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 20 }}>
            <div style={{ width: 28, height: 28, background: '#CCFF00', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000' }}>S2</div>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Torneos</span>
          </Link>
          <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
            {navItems.map(({ href, label, Icon }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  color: active ? '#000' : '#666',
                  background: active ? '#CCFF00' : 'transparent',
                  transition: 'all 0.15s'
                }}>
                  <Icon /> {label}
                </Link>
              )
            })}
          </div>
          <Link href="/admin" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#CCFF00', textDecoration: 'none',
            padding: '5px 12px', border: '1px solid rgba(204,255,0,0.25)',
            borderRadius: 7, fontWeight: 600, whiteSpace: 'nowrap'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Panel Admin
          </Link>
        </div>
      </nav>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>
        {children}
      </main>
    </div>
  )
}
