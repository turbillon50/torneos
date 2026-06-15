'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import {
  IcoDashboard, IcoMatch, IcoTeam, IcoPlayer, IcoRef,
  IcoPay, IcoBell, IcoMenu, IcoX, IcoBack
} from './AdminIcons'

type IconComp = (p: { size?: number }) => React.ReactNode

const NAV: { href: string; label: string; Icon: IconComp }[] = [
  { href: '/admin',                label: 'Dashboard',   Icon: IcoDashboard },
  { href: '/admin/partidos',       label: 'Partidos',    Icon: IcoMatch     },
  { href: '/admin/equipos',        label: 'Equipos',     Icon: IcoTeam      },
  { href: '/admin/jugadores',      label: 'Jugadores',   Icon: IcoPlayer    },
  { href: '/admin/arbitros',       label: 'Árbitros',    Icon: IcoRef       },
  { href: '/admin/pagos',          label: 'Pagos',       Icon: IcoPay       },
  { href: '/admin/notificaciones', label: 'Avisos',      Icon: IcoBell      },
]

function active(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
}

function NavItem({ href, label, Icon, isActive, onClick }: {
  href: string; label: string; Icon: IconComp; isActive: boolean; onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
      {isActive && (
        <motion.div layoutId="admin-active-pill"
          style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 3, background: '#CCFF00', borderRadius: '0 2px 2px 0' }}
        />
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
        color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
        background: isActive ? 'rgba(204,255,0,0.08)' : 'transparent',
        transition: 'all 0.15s'
      }}>
        <span style={{ color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.25)' }}>
          <Icon size={17} />
        </span>
        {label}
      </div>
    </Link>
  )
}

function Brand() {
  return (
    <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, background: '#CCFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000', flexShrink: 0 }}>S2</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: -0.3 }}>S2 Sport</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1, textTransform: 'uppercase' }}>Admin</div>
      </div>
    </Link>
  )
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: '#000' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        position: 'sticky', top: 0, height: '100dvh',
        background: '#080808', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '20px 12px',
        // Solo visible en md+
      }} className="admin-sidebar">
        <div style={{ marginBottom: 28 }}><Brand /></div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <NavItem key={item.href} {...item} isActive={active(pathname, item.href)} />
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
            padding: '8px 12px', borderRadius: 8
          }}>
            <IcoBack /> Volver al sitio
          </Link>
        </div>
      </aside>

      {/* ── CONTENIDO ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar mobile */}
        <header className="admin-topbar" style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 52
        }}>
          <Brand />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDrawerOpen(v => !v)}
            style={{ width: 36, height: 36, borderRadius: 8, background: '#111', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
          >
            {drawerOpen ? <IcoX size={18} /> : <IcoMenu size={18} />}
          </motion.button>
        </header>

        {/* Drawer mobile */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                className="admin-topbar"
              />
              <motion.nav
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                style={{
                  position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
                  width: 260, background: '#080808', borderRight: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', flexDirection: 'column', padding: '20px 12px'
                }}
                className="admin-topbar"
              >
                <div style={{ marginBottom: 28 }}><Brand /></div>
                {NAV.map(item => (
                  <NavItem key={item.href} {...item} isActive={active(pathname, item.href)} onClick={() => setDrawerOpen(false)} />
                ))}
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                  <Link href="/" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', padding: '8px 12px' }}>
                    <IcoBack /> Volver al sitio
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Main content con page transitions */}
        <main style={{ flex: 1, minWidth: 0, padding: '24px 16px', maxWidth: 1000, width: '100%', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .admin-sidebar { display: none; }
        .admin-topbar { display: flex !important; }
        @media (min-width: 768px) {
          .admin-sidebar { display: flex !important; }
          .admin-topbar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
