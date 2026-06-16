'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconHome, IconTable, IconBall, IconTeams, IconShield } from './Icons'

const ITEMS = [
  { href: '/', label: 'Inicio', Icon: IconHome },
  { href: '/tabla', label: 'Tabla', Icon: IconTable },
  { href: '/partidos', label: 'Partidos', Icon: IconBall },
  { href: '/equipos', label: 'Equipos', Icon: IconTeams },
  { href: '/capitan', label: 'Capitán', Icon: IconShield },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 'calc(var(--nav-h) + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        display: 'grid',
        gridTemplateColumns: `repeat(${ITEMS.length}, 1fr)`,
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
      }}
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = href === '/' ? path === '/' : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              height: 'var(--nav-h)',
              color: active ? 'var(--neon)' : 'var(--muted)',
              transition: 'color var(--anim-fast) ease',
            }}
          >
            <motion.span
              whileTap={{ scale: 0.85 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            >
              <Icon width={22} height={22} strokeWidth={active ? 2.2 : 1.9} />
              <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, letterSpacing: '0.01em' }}>
                {label}
              </span>
            </motion.span>
          </Link>
        )
      })}
    </nav>
  )
}
