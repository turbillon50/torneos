'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IcoTeam, IcoPlayer, IcoMatch, IcoPay, IcoTrophy, IcoBell, IcoRef } from '@/components/admin/AdminIcons'

const stagger = { show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

function KPICard({ label, value, Icon, accent = false, href }: { label: string; value: string | number; Icon: any; accent?: boolean; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.div
        variants={fadeUp}
        whileHover={{ borderColor: 'rgba(204,255,0,0.25)', y: -2 }}
        transition={{ duration: 0.15 }}
        style={{
          background: '#0d0d0d',
          border: `1px solid ${accent ? 'rgba(255,170,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 14, padding: '18px 16px', cursor: 'pointer'
        }}
      >
        <div style={{ color: accent ? '#FFAA00' : 'rgba(255,255,255,0.25)', marginBottom: 12 }}><Icon size={20} /></div>
        <div style={{ fontSize: 30, fontWeight: 900, color: accent ? '#FFAA00' : '#CCFF00', letterSpacing: -1, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontWeight: 600 }}>{label}</div>
      </motion.div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState({ teams: 0, players: 0, matches: 0, refs: 0, pending: 0, totalPending: 0, notifications: 0 })
  const [tournaments, setTournaments] = useState<any[]>([])
  const [upcoming, setUpcoming] = useState<any[]>([])
  const [recentPay, setRecentPay] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tournaments').then(r=>r.json()).catch(()=>[]),
      fetch('/api/teams').then(r=>r.json()).catch(()=>[]),
      fetch('/api/players').then(r=>r.json()).catch(()=>[]),
      fetch('/api/matches').then(r=>r.json()).catch(()=>[]),
      fetch('/api/payments').then(r=>r.json()).catch(()=>[]),
      fetch('/api/notifications').then(r=>r.json()).catch(()=>[]),
    ]).then(([t, teams, players, matches, pays, notifs]) => {
      const pending = Array.isArray(pays) ? pays.filter((p:any)=>p.status!=='paid') : []
      setTournaments(Array.isArray(t) ? t : [])
      setUpcoming(Array.isArray(matches) ? matches.filter((m:any)=>m.status==='scheduled').slice(0,4) : [])
      setRecentPay(pending.slice(0,5))
      setData({
        teams: Array.isArray(teams) ? teams.length : 0,
        players: Array.isArray(players) ? players.length : 0,
        matches: Array.isArray(matches) ? matches.length : 0,
        refs: 0,
        pending: pending.length,
        totalPending: pending.reduce((s:number,p:any)=>s+Number(p.amount),0),
        notifications: Array.isArray(notifs) ? notifs.length : 0,
      })
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: '#CCFF00', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Panel de control</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Dashboard</h1>
      </motion.div>

      {/* KPIs — 2 cols mobile, 4 cols desktop */}
      <motion.div initial="hidden" animate="show" variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 28 }}>
        <KPICard label="Equipos" value={loading ? '—' : data.teams} Icon={IcoTeam} href="/admin/equipos" />
        <KPICard label="Jugadores" value={loading ? '—' : data.players} Icon={IcoPlayer} href="/admin/jugadores" />
        <KPICard label="Partidos" value={loading ? '—' : data.matches} Icon={IcoMatch} href="/admin/partidos" />
        <KPICard label={`Por cobrar`} value={loading ? '—' : `$${data.totalPending.toLocaleString('es-MX')}`} Icon={IcoPay} accent={data.totalPending > 0} href="/admin/pagos" />
      </motion.div>

      <style>{`@media(min-width:640px){ .kpi-grid{ grid-template-columns: repeat(4,1fr) !important; } }`}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>

        {/* Torneos activos */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcoTrophy size={17} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Torneos</span>
            </div>
            <div style={{ fontSize: 11, color: '#CCFF00', fontWeight: 700 }}>{tournaments.length} total</div>
          </div>
          {tournaments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>Sin torneos aún</div>
              <div style={{ fontSize: 11, color: '#222' }}>Conecta la DB para comenzar</div>
            </div>
          ) : tournaments.map((t:any) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{t.category} · {t.season}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.5, color: t.status==='active'?'#000':'rgba(255,255,255,0.3)', background: t.status==='active'?'#CCFF00':'rgba(255,255,255,0.06)' }}>
                {t.status === 'active' ? 'ACTIVO' : t.status === 'finished' ? 'CERRADO' : 'PRÓXIMO'}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Próximos partidos */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcoMatch size={17} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Próximos Partidos</span>
            </div>
            <Link href="/admin/partidos" style={{ fontSize: 11, color: '#CCFF00', textDecoration: 'none', fontWeight: 600 }}>Ver todos</Link>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#333', fontSize: 13 }}>Sin partidos programados</div>
          ) : upcoming.map((m:any) => (
            <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {m.home_team_name} <span style={{ color: '#CCFF00', fontSize: 11 }}>vs</span> {m.away_team_name}
                </div>
                {m.matchday_number && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>J{m.matchday_number}</div>}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                {m.scheduled_at ? new Date(m.scheduled_at).toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : 'Sin horario'}
                {m.field ? ` · ${m.field}` : ''}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pagos pendientes */}
        {recentPay.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ background: '#0d0d0d', border: '1px solid rgba(255,170,0,0.1)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IcoPay size={17} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Pagos Pendientes</span>
              </div>
              <Link href="/admin/pagos" style={{ fontSize: 11, color: '#FFAA00', textDecoration: 'none', fontWeight: 600 }}>Gestionar</Link>
            </div>
            {recentPay.map((p:any) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.team_name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.type === 'inscription' ? 'Inscripción' : p.type === 'arbitration' ? 'Arbitraje' : 'Multa'}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: p.status==='overdue'?'#FF4444':'#FFAA00' }}>
                  ${Number(p.amount).toLocaleString('es-MX')}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
