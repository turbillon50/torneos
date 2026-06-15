'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

export default function AdminDashboard() {
  const [stats, setStats] = useState({ teams: 0, players: 0, matches: 0, pendingPayments: 0, totalPending: 0 })
  const [tournaments, setTournaments] = useState<any[]>([])
  const [recentMatches, setRecentMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tournaments').then(r => r.json()).catch(() => []),
      fetch('/api/teams').then(r => r.json()).catch(() => []),
      fetch('/api/players').then(r => r.json()).catch(() => []),
      fetch('/api/matches').then(r => r.json()).catch(() => []),
      fetch('/api/payments').then(r => r.json()).catch(() => []),
    ]).then(([t, teams, players, matches, payments]) => {
      setTournaments(Array.isArray(t) ? t : [])
      const matchArr = Array.isArray(matches) ? matches : []
      const payArr = Array.isArray(payments) ? payments : []
      setRecentMatches(matchArr.filter((m: any) => m.status === 'live' || m.status === 'scheduled').slice(0, 5))
      const pending = payArr.filter((p: any) => p.status !== 'paid')
      setStats({
        teams: Array.isArray(teams) ? teams.length : 0,
        players: Array.isArray(players) ? players.length : 0,
        matches: matchArr.length,
        pendingPayments: pending.length,
        totalPending: pending.reduce((sum: number, p: any) => sum + Number(p.amount), 0)
      })
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {[...Array(4)].map((_, i) => <div key={i} style={{ height: 100, background: '#141414', borderRadius: 12 }} />)}
    </div>
  )

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>📊 Panel de Administración</h1>
        <div style={{ color: '#888', fontSize: 14 }}>S2 Sport — Liga de Fútbol</div>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Equipos', value: stats.teams, icon: '👥', color: '#CCFF00' },
          { label: 'Jugadores', value: stats.players, icon: '👕', color: '#CCFF00' },
          { label: 'Partidos', value: stats.matches, icon: '⚽', color: '#CCFF00' },
          { label: 'Por Cobrar', value: `$${stats.totalPending.toLocaleString('es-MX')}`, icon: '💳', color: stats.pendingPayments > 0 ? '#FFAA00' : '#CCFF00' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp} style={{
            background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '20px 16px'
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🏆 Torneos</div>
          {tournaments.length === 0 ? (
            <div style={{ color: '#555', fontSize: 13 }}>No hay torneos. Usa la DB para crear el primero.</div>
          ) : tournaments.map((t: any) => (
            <div key={t.id} style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{t.category} · {t.season}</div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                color: t.status === 'active' ? '#000' : '#888',
                background: t.status === 'active' ? '#CCFF00' : '#222'
              }}>{t.status === 'active' ? 'ACTIVO' : 'FINALIZADO'}</div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>⚽ Próximos Partidos</div>
          {recentMatches.length === 0 ? (
            <div style={{ color: '#555', fontSize: 13 }}>Sin partidos programados aún</div>
          ) : recentMatches.map((m: any) => (
            <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.home_team_name} vs {m.away_team_name}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                {m.scheduled_at ? new Date(m.scheduled_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Sin horario'}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
