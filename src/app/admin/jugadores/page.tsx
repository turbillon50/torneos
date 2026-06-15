'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IcoPlayer, IcoPlus } from '@/components/admin/AdminIcons'
import { IconCardYellow, IconCardRed } from '@/components/Icons'

const POSITIONS = ['Portero','Def. Central','Lateral Der.','Lateral Izq.','Mediocampista','Extremo','Delantero']

export default function AdminJugadoresPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamFilter, setTeamFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', number:'', position:'', team_id:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/players').then(r=>r.json()).catch(()=>[]),
      fetch('/api/teams').then(r=>r.json()).catch(()=>[]),
    ]).then(([p,t]) => {
      setPlayers(Array.isArray(p)?p:[])
      setTeams(Array.isArray(t)?t:[])
      if (Array.isArray(t) && t.length) setForm(f=>({...f,team_id:t[0].id}))
      setLoading(false)
    })
  }, [])

  async function addPlayer() {
    if (!form.name||!form.team_id) return
    setSaving(true)
    const res = await fetch('/api/players', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...form, number:form.number?parseInt(form.number):null})
    })
    if (res.ok) { const p = await res.json(); setPlayers(prev=>[...prev,p]) }
    setForm(f=>({...f,name:'',number:'',position:''})); setShowForm(false); setSaving(false)
  }

  const filtered = players
    .filter(p=>teamFilter==='all'||p.team_id===teamFilter)
    .filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, color:'#CCFF00', letterSpacing:2, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Gestión</div>
          <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>Jugadores</h1>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{filtered.length} jugadores</div>
        </div>
        <motion.button whileTap={{scale:0.95}} onClick={()=>setShowForm(!showForm)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'#CCFF00', color:'#000', border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer' }}>
          <IcoPlus size={15} /> Agregar
        </motion.button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
          style={{ background:'#0d0d0d', border:'1px solid rgba(204,255,0,0.2)', borderRadius:12, padding:16, marginBottom:16, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 60px', gap:8, marginBottom:8 }}>
            <input placeholder="Nombre del jugador *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
              style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none' }} />
            <input placeholder="#" type="number" value={form.number} onChange={e=>setForm(p=>({...p,number:e.target.value}))}
              style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'10px 8px', color:'#fff', fontSize:13, outline:'none', textAlign:'center' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <select value={form.position} onChange={e=>setForm(p=>({...p,position:e.target.value}))}
              style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'10px 12px', color:form.position?'#fff':'rgba(255,255,255,0.3)', fontSize:13, outline:'none' }}>
              <option value="">Posición</option>
              {POSITIONS.map(pos=><option key={pos} value={pos}>{pos}</option>)}
            </select>
            <select value={form.team_id} onChange={e=>setForm(p=>({...p,team_id:e.target.value}))}
              style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none' }}>
              {teams.map((t:any)=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <motion.button whileTap={{scale:0.96}} onClick={addPlayer} disabled={saving||!form.name}
              style={{ padding:'8px 20px', background:form.name?'#CCFF00':'#1a1a1a', color:form.name?'#000':'#555', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              {saving?'Guardando…':'Guardar'}
            </motion.button>
            <button onClick={()=>setShowForm(false)} style={{ padding:'8px 14px', background:'transparent', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13 }}>Cancelar</button>
          </div>
        </motion.div>
      )}

      {/* Filtros */}
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input placeholder="Buscar jugador..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, minWidth:160, background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 12px', color:'#fff', fontSize:13, outline:'none' }} />
        <select value={teamFilter} onChange={e=>setTeamFilter(e.target.value)}
          style={{ background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 12px', color:teamFilter!=='all'?'#fff':'rgba(255,255,255,0.4)', fontSize:13, outline:'none' }}>
          <option value="all">Todos los equipos</option>
          {teams.map((t:any)=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[...Array(6)].map((_,i)=><div key={i} style={{ height:52, background:'#0d0d0d', borderRadius:10, opacity:0.5-i*0.07 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#333' }}>
          <div style={{ fontSize:14 }}>Sin jugadores{search?` con "${search}"`:''}.</div>
        </div>
      ) : filtered.map((p:any,i:number) => (
        <motion.div key={p.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.02}}
          style={{ background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:5 }}>
          <div style={{ width:32, height:32, background:'rgba(204,255,0,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:'#CCFF00', flexShrink:0 }}>
            {p.number||'–'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>
              {p.position||'Sin posición'}{p.team_name?` · ${p.team_name}`:''}
            </div>
          </div>
          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            {p.yellow_cards>0 && <div style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:999, background:'rgba(255,215,0,0.12)', color:'#FFD700', display:'inline-flex', alignItems:'center', gap:4 }}><IconCardYellow size={11} /> {p.yellow_cards}</div>}
            {p.red_cards>0 && <div style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:999, background:'rgba(255,68,68,0.12)', color:'#FF4444', display:'inline-flex', alignItems:'center', gap:4 }}><IconCardRed size={11} /> {p.red_cards}</div>}
            {p.goals>0 && <div style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:999, background:'rgba(204,255,0,0.08)', color:'#CCFF00' }}>{p.goals} gol{p.goals>1?'es':''}</div>}
            {p.status==='suspended' && <div style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:999, background:'rgba(255,68,68,0.15)', color:'#FF4444', letterSpacing:0.3 }}>SUSP.</div>}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
