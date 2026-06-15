'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CapitanDashboard() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#888' }}>Panel de Capitán</div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Mi Equipo</h1>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { href: '/capitan/plantilla', icon: '👕', title: 'Gestionar Plantilla', desc: 'Jugadores registrados' },
          { href: '/capitan/pagos', icon: '💳', title: 'Ver Pagos', desc: 'Estado de pagos' },
          { href: '/capitan/sanciones', icon: '🟨', title: 'Tarjetas y Sanciones', desc: 'Control de disciplina' },
          { href: '/tabla', icon: '🏆', title: 'Ver Tabla General', desc: 'Posiciones del torneo' },
          { href: '/calendario', icon: '📅', title: 'Próximos Partidos', desc: 'Calendario completo' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ borderColor: 'rgba(204,255,0,0.3)', x: 4 }} style={{
              background: '#141414', border: '1px solid #222', borderRadius: 12,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.desc}</div>
              </div>
              <span style={{ color: '#555', fontSize: 18 }}>›</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
