'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IconCardYellow, IconCardRed, IconDoubleCard, IconBan, IconShieldCheck } from '@/components/Icons'

export default function SancionesCapitanPage() {
  const [cards, setCards] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).catch(() => []).then((t: any[]) => {
      if (!Array.isArray(t) || t.length === 0) { setLoading(false); return }
      setTeams(t)
      fetch(`/api/cards?team_id=${t[0].id}`).then(r => r.json()).catch(() => []).then((c: any[]) => {
        setCards(Array.isArray(c) ? c : []); setLoading(false)
      })
    })
  }, [])

  if (loading) return <div style={{ textAlign:'center', padding:40, color:'#555' }}>Cargando...</div>
  const suspended = cards.filter((c: any) => c.suspension_matches > 0)

  return (
    <div>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:900, display:'inline-flex', alignItems:'center', gap:8 }}>
          <IconCardYellow size={20} />
          Tarjetas y Sanciones
        </h1>
        {teams.length > 0 && <div style={{ color:'#888', fontSize:13 }}>{teams[0].name}</div>}
      </motion.div>

      {suspended.length > 0 && (
        <div style={{ background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.2)', borderRadius:12, padding:16, marginBottom:20 }}>
          <div style={{ fontWeight:700, color:'#FF4444', marginBottom:8, display:'inline-flex', alignItems:'center', gap:6 }}>
            <IconBan size={16} />
            Jugadores Suspendidos
          </div>
          {suspended.map((c: any) => (
            <div key={c.id} style={{ fontSize:13, color:'#ccc', padding:'4px 0', borderBottom:'1px solid #1a1a1a' }}>
              {c.player_name} — {c.suspension_matches} partido(s)
            </div>
          ))}
        </div>
      )}

      {cards.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'#555' }}>
          <div style={{ marginBottom:12, display:'flex', justifyContent:'center', color:'#CCFF00' }}>
            <IconShieldCheck size={40} />
          </div>
          <div>Sin tarjetas registradas. ¡Juego limpio!</div>
        </div>
      ) : cards.map((c: any) => (
        <motion.div key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            {c.type === 'yellow'
              ? <IconCardYellow size={22} />
              : c.type === 'double_yellow'
              ? <IconDoubleCard size={24} />
              : <IconCardRed size={22} />
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{c.player_name}</div>
            {c.minute && <div style={{ fontSize:11, color:'#888' }}>Min. {c.minute}</div>}
          </div>
          {c.suspension_matches > 0 && (
            <div style={{ fontSize:11, color:'#FF4444', background:'rgba(255,68,68,0.1)', padding:'3px 8px', borderRadius:999 }}>+{c.suspension_matches} partido(s)</div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
