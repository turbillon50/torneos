'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div variants={fadeUp} style={{
      background: '#141414', border: '1px solid #222', borderRadius: 12,
      padding: '24px', textAlign: 'center'
    }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: '#CCFF00', letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </motion.div>
  )
}

export default function Landing() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#CCFF00', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, color: '#000'
          }}>S2</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>S2 Sport</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/sign-in" style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            border: '1px solid #333', color: '#fff', textDecoration: 'none',
            background: 'transparent'
          }}>Entrar</Link>
          <Link href="/sign-up" style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700,
            background: '#CCFF00', color: '#000', textDecoration: 'none'
          }}>Registrarse</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 999,
            background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.3)',
            fontSize: 12, fontWeight: 600, color: '#CCFF00', marginBottom: 24, letterSpacing: 1
          }}>⚽ PLATAFORMA OFICIAL S2 SPORT</motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: -2, marginBottom: 24
          }}>
            Tus Torneos,<br />
            <span style={{ color: '#CCFF00' }}>Digitalizados.</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: 18, color: '#888', maxWidth: 480, margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Gestiona equipos, resultados, tablas, pagos y árbitros desde una sola plataforma.
            Todo en tiempo real.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tabla" style={{
              padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 16,
              background: '#CCFF00', color: '#000', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>Ver Tabla de Posiciones →</Link>
            <Link href="/calendario" style={{
              padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 16,
              border: '1px solid #333', color: '#fff', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>📅 Calendario</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}
        >
          <StatCard value="3" label="Torneos Activos" />
          <StatCard value="24" label="Equipos" />
          <StatCard value="312" label="Jugadores" />
          <StatCard value="98%" label="Partidos Registrados" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, textAlign: 'center' }}
        >
          Todo lo que necesita tu liga
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}
        >
          {[
            { icon: '🏆', title: 'Tabla de Posiciones', desc: 'Actualización automática con cada resultado registrado.' },
            { icon: '📅', title: 'Calendario de Partidos', desc: 'Rol de juegos, campos, horarios y árbitros asignados.' },
            { icon: '👥', title: 'Gestión de Equipos', desc: 'Plantillas, capitanes y estadísticas por jugador.' },
            { icon: '💳', title: 'Pagos en Línea', desc: 'Inscripciones y arbitrajes controlados en un solo lugar.' },
            { icon: '🟨', title: 'Tarjetas y Sanciones', desc: 'Control automático de acumulación y suspensiones.' },
            { icon: '🔔', title: 'Notificaciones', desc: 'Avisos de cambios de horario y jornadas a captains.' },
          ].map(f => (
            <motion.div key={f.title} variants={fadeUp} style={{
              background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '24px'
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA ROLES */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, textAlign: 'center' }}
        >
          Una app, tres accesos
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}
        >
          {[
            { role: 'Aficionado', icon: '👤', color: '#888', desc: 'Consulta tabla, calendario y estadísticas. Gratis, sin registro.' },
            { role: 'Capitán', icon: '🦺', color: '#CCFF00', desc: 'Registra tu plantilla, paga en línea, revisa sanciones de tu equipo.' },
            { role: 'Admin Liga', icon: '⚙️', color: '#CCFF00', desc: 'Control total: resultados, arbitraje, equipos y pagos.' },
          ].map(r => (
            <motion.div key={r.role} variants={fadeUp} style={{
              background: '#141414',
              border: `1px solid ${r.color === '#CCFF00' ? 'rgba(204,255,0,0.3)' : '#222'}`,
              borderRadius: 12, padding: '28px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: r.color, marginBottom: 8 }}>{r.role}</div>
              <div style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>{r.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1a1a1a', padding: '32px 24px', textAlign: 'center', color: '#555', fontSize: 13
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, background: '#CCFF00', borderRadius: 6,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 12, color: '#000'
          }}>S2</div>
          <span style={{ fontWeight: 700, color: '#888' }}>S2 Sport Torneos</span>
        </div>
        <div>Desarrollado por <span style={{ color: '#CCFF00' }}>V·Momentum</span> — All Global Holding LLC</div>
      </footer>
    </div>
  )
}
