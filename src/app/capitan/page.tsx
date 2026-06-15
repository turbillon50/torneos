'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import type { Team, Player, Payment, Card } from '@/types'
import Link from 'next/link'

export default function CapitanDashboard() {
  const { user } = useUser()
  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    // Buscar equipo del capitán por clerk_id
    fetch('/api/teams').then(r => r.json()).then((teams: Team[]) => {
      const myTeam = teams.find(t => t.captain_clerk_id === user.id)
      setTeam(myTeam || null)
      if (myTeam) {
        Promise.all([
          fetch(`/api/players?team_id=${myTeam.id}`).then(r => r.json()),
          fetch(`/api/payments?team_id=${myTeam.id}`).then(r => r.json()),
        ]).then(([p, pay]) => { setPlayers(p); setPayments(pay); setLoading(false) })
      } else setLoading(false)
    })
  }, [user])

  const pendingPayments = payments.filter(p => p.status !== 'paid')
  const suspendedPlayers = players.filter(p => p.status === 'suspended')

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Cargando...</div>

  if (!team) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Aún no tienes equipo asignado</div>
      <div style={{ color: '#888', fontSize: 14 }}>Contacta al administrador de la liga para que te vincule como capitán.</div>
    </div>
  )

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#888' }}>Bienvenido, {user?.firstName}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>{team.name}</h1>
      </motion.div>

      {/* Resumen cards */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}
      >
        {[
          { label: 'Jugadores', value: players.length, icon: '👕', color: '#CCFF00' },
          { label: 'Pagos Pendientes', value: pendingPayments.length, icon: '💳', color: pendingPayments.length > 0 ? '#FFAA00' : '#CCFF00' },
          { label: 'Sancionados', value: suspendedPlayers.length, icon: '🟨', color: suspendedPlayers.length > 0 ? '#FF4444' : '#CCFF00' },
        ].map(s => (
          <div key={s.label} style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Accesos rápidos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { href: '/capitan/plantilla', icon: '👕', title: 'Gestionar Plantilla', desc: `${players.length} jugadores registrados` },
          { href: '/capitan/pagos', icon: '💳', title: 'Ver Pagos', desc: pendingPayments.length > 0 ? `${pendingPayments.length} pendientes` : 'Al corriente' },
          { href: '/capitan/sanciones', icon: '🟨', title: 'Tarjetas y Sanciones', desc: suspendedPlayers.length > 0 ? `${suspendedPlayers.length} suspendidos` : 'Sin sancionados' },
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
