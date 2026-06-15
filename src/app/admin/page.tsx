'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const IcoTeam = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IcoPlayer = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IcoMatch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
const IcoPay = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
const IcoTrophy = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 21h8m-4-4v4M7 4H4v3a3 3 0 0 0 3 3M17 4h3v3a3 3 0 0 1-3 3"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/></svg>

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

export default function AdminDashboard() {
  const [stats, setStats] = useState({ teams: 0, players: 0, matches: 0, totalPending: 0 })
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
      setRecentMatches(matchArr.filter((m: any) => m.status !== 'finished').slice(0, 4))
      const pending = payArr.filter((p: any) => p.status !== 'paid')
      setStats({
        teams: Array.isArray(teams) ? teams.length : 0,
        players: Array.isArray(players) ? players.length : 0,
        matches: matchArr.length,
        totalPending: pending.reduce((s: number, p: any) => s + Number(p.amount), 0)
      })
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: '#CCFF00', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Panel de control</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Dashboard</h1>
        <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>S2 Sport — Liga de Fútbol</div>
      </motion.div>

      {/* KPIs */}
      <motion.div initial="hidden" animate="show" variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Equipos', value: stats.teams, Icon: IcoTeam },
          { label: 'Jugadores', value: stats.players, Icon: IcoPlayer },
          { label: 'Partidos', value: stats.matches, Icon: IcoMatch },
          { label: 'Por Cobrar', value: `$${stats.totalPending.toLocaleString('es-MX')}`, Icon: IcoPay, highlight: stats.totalPending > 0 },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} style={{
            background: '#0d0d0d', border: `1px solid ${s.highlight ? 'rgba(255,170,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 14, padding: '18px 16px'
          }}>
            <div style={{ color: s.highlight ? '#FFAA00' : '#444', marginBottom: 10 }}><s.Icon /></div>
            <div style={{ fontSize: loading ? 28 : 28, fontWeight: 900, color: s.highlight ? '#FFAA00' : '#CCFF00', letterSpacing: -0.5 }}>
              {loading ? '—' : s.value}
            </div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Torneos */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <IcoTrophy />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Torneos</span>
        </div>
        {tournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#333' }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Sin torneos registrados</div>
            <div style={{ fontSize: 11, color: '#2a2a2a' }}>Conecta la base de datos para comenzar</div>
          </div>
        ) : tournaments.map((t: any) => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{t.category} · {t.season}</div>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.5,
              color: t.status === 'active' ? '#000' : '#555',
              background: t.status === 'active' ? '#CCFF00' : '#1a1a1a'
            }}>{t.status === 'active' ? 'ACTIVO' : 'CERRADO'}</div>
          </div>
        ))}
      </motion.div>

      {/* Próximos partidos */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <IcoMatch />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Próximos Partidos</span>
        </div>
        {recentMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#333' }}>
            <div style={{ fontSize: 13 }}>Sin partidos programados</div>
          </div>
        ) : recentMatches.map((m: any) => (
          <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{m.home_team_name} <span style={{ color: '#CCFF00' }}>vs</span> {m.away_team_name}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
              {m.scheduled_at ? new Date(m.scheduled_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Horario pendiente'}
              {m.field ? ` · ${m.field}` : ''}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
