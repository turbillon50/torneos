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

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
}

function NavItem({ href, label, Icon, active, onClick }: {
  href: string; label: string; Icon: IconComp; active: boolean; onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration:'none', display:'block', position:'relative' }}>
      {active && (
        <motion.div layoutId="active-pill" style={{ position:'absolute', left:0, top:4, bottom:4, width:3, background:'#CCFF00', borderRadius:'0 2px 2px 0' }} />
      )}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'9px 12px', borderRadius:10, fontSize:13, fontWeight:600,
        color: active ? '#fff' : 'rgba(255,255,255,0.28)',
        background: active ? 'rgba(204,255,0,0.07)' : 'transparent',
        transition:'all 0.15s'
      }}>
        <span style={{ color: active ? '#CCFF00' : 'rgba(255,255,255,0.18)' }}>
          <Icon size={17} />
        </span>
        {label}
      </div>
    </Link>
  )
}

function Brand() {
  return (
    <Link href="/admin" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:32, height:32, background:'#CCFF00', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#000', flexShrink:0 }}>S2</div>
      <div>
        <div style={{ fontWeight:800, fontSize:13, color:'#fff', letterSpacing:-0.3 }}>S2 Sport</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:1, textTransform:'uppercase' }}>Admin</div>
      </div>
    </Link>
  )
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ minHeight:'100dvh', display:'flex', background:'#000' }}>

      {/* SIDEBAR DESKTOP */}
      <aside style={{
        width:240, flexShrink:0, position:'sticky', top:0, height:'100dvh',
        background:'#080808', borderRight:'1px solid rgba(255,255,255,0.06)',
        display:'flex', flexDirection:'column', padding:'20px 12px'
      }} className="s2-sidebar">
        <div style={{ marginBottom:28 }}><Brand /></div>
        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(item => <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />)}
        </nav>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(255,255,255,0.22)', textDecoration:'none', padding:'8px 12px', borderRadius:8 }}>
            <IcoBack size={14} /> Volver al sitio
          </Link>
        </div>
      </aside>

      {/* AREA DERECHA */}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>

        {/* TOPBAR MOBILE */}
        <header className="s2-topbar" style={{
          position:'sticky', top:0, zIndex:40, display:'flex', alignItems:'center',
          justifyContent:'space-between', padding:'0 16px', height:52, flexShrink:0,
          background:'rgba(0,0,0,0.94)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,0.06)'
        }}>
          <Brand />
          <motion.button whileTap={{ scale:0.88 }} onClick={() => setOpen(v => !v)} style={{
            width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
            background:'#111', border:'1px solid rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer'
          }}>
            {open ? <IcoX size={18} /> : <IcoMenu size={18} />}
          </motion.button>
        </header>

        {/* DRAWER MOBILE */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div key="ov"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={() => setOpen(false)}
                className="s2-topbar"
                style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,0.78)', backdropFilter:'blur(6px)' }}
              />
              <motion.nav key="dr"
                initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
                transition={{ type:'spring', stiffness:340, damping:34 }}
                className="s2-topbar"
                style={{
                  position:'fixed', top:0, left:0, bottom:0, zIndex:50, width:260,
                  background:'#080808', borderRight:'1px solid rgba(255,255,255,0.08)',
                  display:'flex', flexDirection:'column', padding:'20px 12px'
                }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
                  <Brand />
                  <motion.button whileTap={{ scale:0.88 }} onClick={() => setOpen(false)} style={{
                    width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center',
                    background:'#111', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', cursor:'pointer'
                  }}><IcoX size={14} /></motion.button>
                </div>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
                  {NAV.map(item => <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} onClick={() => setOpen(false)} />)}
                </div>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14, marginTop:'auto' }}>
                  <Link href="/" onClick={() => setOpen(false)} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(255,255,255,0.22)', textDecoration:'none', padding:'8px 12px', borderRadius:8 }}>
                    <IcoBack size={14} /> Volver al sitio
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* MAIN */}
        <main style={{ flex:1, minWidth:0, overflowY:'auto' }}>
          <div style={{ maxWidth:960, width:'100%', margin:'0 auto', padding:'20px 16px' }} className="s2-main-pad">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity:0, y:8 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-5 }}
                transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <style>{`
        .s2-sidebar { display: none !important; }
        .s2-topbar  { display: flex !important; }
        @media (min-width: 768px) {
          .s2-sidebar { display: flex !important; }
          .s2-topbar  { display: none !important; }
          .s2-main-pad { padding: 32px 40px !important; }
        }
      `}</style>
    </div>
  )
}
