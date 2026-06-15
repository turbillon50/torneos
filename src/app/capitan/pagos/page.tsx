'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const typeLabel: Record<string,string> = { inscription:'Inscripción', arbitration:'Arbitraje', penalty:'Multa' }
const statusStyle: Record<string,{color:string;bg:string;label:string}> = {
  paid:{color:'#CCFF00',bg:'rgba(204,255,0,0.1)',label:'Pagado'},
  pending:{color:'#FFAA00',bg:'rgba(255,170,0,0.1)',label:'Pendiente'},
  overdue:{color:'#FF4444',bg:'rgba(255,68,68,0.1)',label:'Vencido'},
}

export default function PagosCapitanPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).catch(() => []).then((t: any[]) => {
      if (!Array.isArray(t) || t.length === 0) { setLoading(false); return }
      setTeams(t); setTeamId(t[0].id)
      fetch(`/api/payments?team_id=${t[0].id}`).then(r => r.json()).catch(() => []).then((p: any[]) => {
        setPayments(Array.isArray(p) ? p : []); setLoading(false)
      })
    })
  }, [])

  const totalPending = payments.filter(p => p.status !== 'paid').reduce((s,p) => s + Number(p.amount), 0)

  if (loading) return <div style={{ textAlign:'center', padding:40, color:'#555' }}>Cargando...</div>

  return (
    <div>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:900 }}>💳 Pagos</h1>
        {teams.length > 0 && (
          <select value={teamId} onChange={e => setTeamId(e.target.value)}
            style={{ marginTop:6, background:'#141414', border:'1px solid #333', borderRadius:6, padding:'4px 8px', color:'#fff', fontSize:13 }}>
            {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
      </motion.div>

      {totalPending > 0 && (
        <div style={{ background:'rgba(255,170,0,0.1)', border:'1px solid rgba(255,170,0,0.3)', borderRadius:12, padding:'16px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:700, color:'#FFAA00' }}>⚠️ Saldo pendiente</div>
            <div style={{ fontSize:13, color:'#888', marginTop:2 }}>Contacta al administrador</div>
          </div>
          <div style={{ fontSize:24, fontWeight:900, color:'#FFAA00' }}>${totalPending.toLocaleString('es-MX')}</div>
        </div>
      )}

      {payments.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'#555' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>💳</div>
          <div>Sin pagos registrados aún</div>
        </div>
      ) : payments.map((p: any) => {
        const s = statusStyle[p.status] || statusStyle.pending
        return (
          <motion.div key={p.id} initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{typeLabel[p.type] || p.type}</div>
              {p.due_date && <div style={{ fontSize:11, color:'#888', marginTop:2 }}>Vence: {new Date(p.due_date).toLocaleDateString('es-MX')}</div>}
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:800, fontSize:16 }}>${Number(p.amount).toLocaleString('es-MX')}</div>
              <div style={{ fontSize:11, color:s.color, background:s.bg, padding:'2px 8px', borderRadius:999, marginTop:4 }}>{s.label}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
