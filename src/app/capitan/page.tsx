'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IconJersey, IconWallet, IconCardYellow, IconTrophy, IconCalendar, IconChevronRight } from '@/components/Icons'

const items = [
  { href: '/capitan/plantilla', Icon: IconJersey,     title: 'Gestionar Plantilla', desc: 'Jugadores registrados' },
  { href: '/capitan/pagos',     Icon: IconWallet,     title: 'Ver Pagos',           desc: 'Estado de pagos' },
  { href: '/capitan/sanciones', Icon: IconCardYellow, title: 'Tarjetas y Sanciones',desc: 'Control de disciplina' },
  { href: '/tabla',             Icon: IconTrophy,     title: 'Ver Tabla General',   desc: 'Posiciones del torneo' },
  { href: '/calendario',        Icon: IconCalendar,   title: 'Próximos Partidos',   desc: 'Calendario completo' },
]

export default function CapitanDashboard() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#888' }}>Panel de Capitán</div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Mi Equipo</h1>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ borderColor: 'rgba(204,255,0,0.3)', x: 4 }} style={{
              background: '#141414', border: '1px solid #222', borderRadius: 12,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
            }}>
              <span style={{ color: '#CCFF00', display: 'flex', alignItems: 'center' }}>
                <item.Icon size={22} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.desc}</div>
              </div>
              <span style={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                <IconChevronRight size={18} />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
