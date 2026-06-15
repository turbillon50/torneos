'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// SVG Icons — zero emojis
const IcoDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const IcoMatch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>
)
const IcoTeam = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IcoPlayer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IcoRef = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="10" rx="1"/>
    <path d="M5 22V13l7 3 7-3v9"/>
  </svg>
)
const IcoPay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
)
const IcoBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const nav = [
  { href: '/admin', label: 'Dashboard', Icon: IcoDashboard },
  { href: '/admin/partidos', label: 'Partidos', Icon: IcoMatch },
  { href: '/admin/equipos', label: 'Equipos', Icon: IcoTeam },
  { href: '/admin/jugadores', label: 'Jugadores', Icon: IcoPlayer },
  { href: '/admin/arbitros', label: 'Árbitros', Icon: IcoRef },
  { href: '/admin/pagos', label: 'Pagos', Icon: IcoPay },
  { href: '/admin/notificaciones', label: 'Avisos', Icon: IcoBell },
]

export default function AdminNav() {
  const pathname = usePathname()
  const isActive = (href: string) => href === '/admin' ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* DESKTOP sidebar — solo en lg+ */}
      <nav className="admin-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
        background: '#080808', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '20px 10px', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, paddingLeft: 6 }}>
          <div style={{ width: 32, height: 32, background: '#CCFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000', flexShrink: 0 }}>S2</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: -0.3 }}>S2 Sport</div>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 0.5 }}>Admin Panel</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600,
                color: active ? '#000' : '#555',
                background: active ? '#CCFF00' : 'transparent',
                transition: 'all 0.15s'
              }}>
                <Icon /> {label}
              </Link>
            )
          })}
        </div>
        <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ fontSize: 12, color: '#444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Volver al sitio
          </Link>
        </div>
      </nav>

      {/* MOBILE top bar */}
      <div className="admin-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 52
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#CCFF00', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>S2</div>
          <span style={{ fontWeight: 800, fontSize: 14 }}>Admin</span>
        </div>
        <Link href="/" style={{ fontSize: 12, color: '#555', textDecoration: 'none' }}>← Sitio</Link>
      </div>

      {/* MOBILE bottom tab bar */}
      <div className="admin-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
        height: 'calc(60px + env(safe-area-inset-bottom))'
      }}>
        {nav.slice(0, 5).map(({ href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              textDecoration: 'none', padding: '4px 8px', borderRadius: 8, flex: 1,
              color: active ? '#CCFF00' : '#444',
            }}>
              <Icon />
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</span>
            </Link>
          )
        })}
        <Link href="/admin/notificaciones" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          textDecoration: 'none', padding: '4px 8px', borderRadius: 8, flex: 1,
          color: pathname.startsWith('/admin/notificaciones') ? '#CCFF00' : '#444',
        }}>
          <IcoBell />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Avisos</span>
        </Link>
      </div>

      <style>{`
        .admin-sidebar { display: none; }
        .admin-topbar { display: flex; }
        .admin-bottomnav { display: flex; }
        @media (min-width: 768px) {
          .admin-sidebar { display: flex !important; }
          .admin-topbar { display: none !important; }
          .admin-bottomnav { display: none !important; }
        }
      `}</style>
    </>
  )
}
