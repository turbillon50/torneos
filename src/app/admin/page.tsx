'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IcoTeam, IcoPlayer, IcoMatch, IcoPay, IcoTrophy } from '@/components/admin/AdminIcons'

const stagger = { show: { transition: { staggerChildren: 0.06 } } }
const fadeUp  = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

function KPICard({ label, value, Icon, accent = false, href }: {
  label: string; value: string|number; Icon: any; accent?: boolean; href: string
}) {
  return (
    <Link href={href} style={{ textDecoration:'none' }}>
      <motion.div variants={fadeUp} whileHover={{ y:-2 }} transition={{ duration:0.14 }} style={{
        borderRadius:16, padding:'16px 14px', cursor:'pointer', transition:'border-color 0.15s',
        background:'#0d0d0d',
        border:`1px solid ${accent ? 'rgba(255,170,0,0.15)' : 'rgba(255,255,255,0.05)'}`,
      }}>
        <div style={{ color: accent ? '#FFAA00' : 'rgba(255,255,255,0.2)', marginBottom:10 }}><Icon size={20} /></div>
        <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1, lineHeight:1, color: accent ? '#FFAA00' : '#CCFF00' }}>{value}</div>
        <div style={{ fontSize:11, fontWeight:600, marginTop:6, color:'rgba(255,255,255,0.35)' }}>{label}</div>
      </motion.div>
    </Link>
  )
}

function Card({ title, action, children }: { title:string; action?:{label:string;href:string}; children:React.ReactNode }) {
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{
      borderRadius:16, padding:'18px 16px',
      background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{title}</span>
        {action && <Link href={action.href} style={{ textDecoration:'none', fontSize:11, fontWeight:600, color:'#CCFF00' }}>{action.label}</Link>}
      </div>
      {children}
    </motion.div>
  )
}

const DIV = <div style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }} />

export default function AdminDashboard() {
  const [stats, setStats] = useState({ teams:0, players:0, matches:0, totalPending:0 })
  const [tournaments, setTournaments] = useState<any[]>([])
  const [upcoming, setUpcoming] = useState<any[]>([])
  const [pendingPays, setPendingPays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tournaments').then(r=>r.json()).catch(()=>[]),
      fetch('/api/teams').then(r=>r.json()).catch(()=>[]),
      fetch('/api/players').then(r=>r.json()).catch(()=>[]),
      fetch('/api/matches').then(r=>r.json()).catch(()=>[]),
      fetch('/api/payments').then(r=>r.json()).catch(()=>[]),
    ]).then(([t,teams,players,matches,pays])=>{
      const mArr = Array.isArray(matches)?matches:[]
      const pArr = Array.isArray(pays)?pays:[]
      const pend = pArr.filter((p:any)=>p.status!=='paid')
      setTournaments(Array.isArray(t)?t:[])
      setUpcoming(mArr.filter((m:any)=>m.status==='scheduled').slice(0,5))
      setPendingPays(pend.slice(0,4))
      setStats({ teams:Array.isArray(teams)?teams.length:0, players:Array.isArray(players)?players.length:0, matches:mArr.length, totalPending:pend.reduce((s:number,p:any)=>s+Number(p.amount),0) })
      setLoading(false)
    })
  },[])

  const fmt = (n:number) => `$${n.toLocaleString('es-MX')}`

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#CCFF00', marginBottom:4 }}>Panel de control</p>
        <h1 style={{ fontSize:'clamp(22px, 5vw, 30px)', fontWeight:900, letterSpacing:-0.5 }}>Dashboard</h1>
      </motion.div>

      {/* KPIs — 2 cols mobile, 4 cols desktop vía CSS class */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="s2-kpi-grid">
        <KPICard label="Equipos"    value={loading?'—':stats.teams}            Icon={IcoTeam}   href="/admin/equipos"  />
        <KPICard label="Jugadores"  value={loading?'—':stats.players}           Icon={IcoPlayer} href="/admin/jugadores"/>
        <KPICard label="Partidos"   value={loading?'—':stats.matches}           Icon={IcoMatch}  href="/admin/partidos" />
        <KPICard label="Por cobrar" value={loading?'—':fmt(stats.totalPending)} Icon={IcoPay}    href="/admin/pagos"    accent={stats.totalPending>0} />
      </motion.div>

      {/* 2 cols desktop via CSS */}
      <div className="s2-2col">
        {/* Torneos */}
        <Card title="Torneos" action={{ label:'Ver partidos', href:'/admin/partidos' }}>
          {tournaments.length===0
            ? <p style={{ fontSize:13, color:'rgba(255,255,255,0.15)', textAlign:'center', padding:'24px 0' }}>Sin torneos. Conecta la DB.</p>
            : tournaments.map((t:any)=>(
              <div key={t.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ minWidth:0, flex:1, paddingRight:8 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{t.category} · {t.season}</p>
                </div>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:999, letterSpacing:0.5, flexShrink:0,
                  color:t.status==='active'?'#000':'rgba(255,255,255,0.3)', background:t.status==='active'?'#CCFF00':'rgba(255,255,255,0.06)' }}>
                  {t.status==='active'?'ACTIVO':t.status==='finished'?'CERRADO':'PRÓXIMO'}
                </span>
              </div>
            ))
          }
        </Card>

        {/* Próximos */}
        <Card title="Próximos Partidos" action={{ label:'Ver todos', href:'/admin/partidos' }}>
          {upcoming.length===0
            ? <p style={{ fontSize:13, color:'rgba(255,255,255,0.15)', textAlign:'center', padding:'24px 0' }}>Sin partidos programados.</p>
            : upcoming.map((m:any)=>(
              <div key={m.id} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, paddingRight:8 }}>
                    {m.home_team_name} <span style={{ color:'#CCFF00' }}>vs</span> {m.away_team_name}
                  </p>
                  {m.matchday_number&&<span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.25)', flexShrink:0 }}>J{m.matchday_number}</span>}
                </div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:3 }}>
                  {m.scheduled_at?new Date(m.scheduled_at).toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'Sin horario'}
                  {m.field?` · ${m.field}`:''}
                </p>
              </div>
            ))
          }
        </Card>
      </div>

      {/* Pagos pendientes */}
      {pendingPays.length>0 && (
        <Card title="Pagos Pendientes" action={{ label:'Gestionar', href:'/admin/pagos' }}>
          <div className="s2-2col-sm">
            {pendingPays.map((p:any)=>(
              <div key={p.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderRadius:10, padding:'10px 12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ minWidth:0, flex:1, paddingRight:8 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.team_name}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{p.type==='inscription'?'Inscripción':p.type==='arbitration'?'Arbitraje':'Multa'}</p>
                </div>
                <span style={{ fontSize:16, fontWeight:900, flexShrink:0, color:p.status==='overdue'?'#FF4444':'#FFAA00' }}>{fmt(Number(p.amount))}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <style>{`
        .s2-kpi-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        .s2-2col     { display:grid; grid-template-columns:1fr; gap:14px; }
        .s2-2col-sm  { display:grid; grid-template-columns:1fr; gap:8px; }
        @media(min-width:640px){
          .s2-kpi-grid { grid-template-columns:repeat(4,1fr); gap:14px; }
          .s2-2col-sm  { grid-template-columns:repeat(2,1fr); }
        }
        @media(min-width:768px){
          .s2-2col { grid-template-columns:repeat(2,1fr); gap:16px; }
        }
      `}</style>
    </div>
  )
}
