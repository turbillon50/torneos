'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IcoPlus, IcoCheck } from '@/components/admin/AdminIcons'
import { IconX } from '@/components/Icons'

const STATUS_LABEL: Record<string,string> = { scheduled:'Pendiente', live:'En Vivo', finished:'Final', postponed:'Pospuesto' }
const STATUS_COLOR: Record<string,string> = { scheduled:'rgba(255,255,255,0.2)', live:'#CCFF00', finished:'rgba(255,255,255,0.15)', postponed:'#FFAA00' }
const STATUS_TEXT: Record<string,string> = { scheduled:'#888', live:'#000', finished:'#555', postponed:'#000' }

export default function AdminPartidosPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [tournaments, setTournaments] = useState<any[]>([])
  const [activeTid, setActiveTid] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editMatch, setEditMatch] = useState<any>(null)
  const [score, setScore] = useState({ home: '', away: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/tournaments').then(r=>r.json()).catch(()=>[]).then((t:any[]) => {
      if (!Array.isArray(t)) return setLoading(false)
      setTournaments(t)
      const act = t.find(x=>x.status==='active')
      if (act) setActiveTid(act.id)
      else if (t.length) setActiveTid(t[0].id)
      else setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!activeTid) return
    setLoading(true)
    fetch(`/api/matches?tournament_id=${activeTid}`).then(r=>r.json()).catch(()=>[])
      .then((d:any[]) => { setMatches(Array.isArray(d)?d:[]); setLoading(false) })
  }, [activeTid])

  async function saveResult() {
    if (!editMatch || score.home==='' || score.away==='') return
    setSaving(true)
    await fetch(`/api/matches/${editMatch.id}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ home_score: parseInt(score.home), away_score: parseInt(score.away), status:'finished' })
    })
    setMatches(prev => prev.map(m => m.id===editMatch.id
      ? {...m, home_score:parseInt(score.home), away_score:parseInt(score.away), status:'finished'}
      : m))
    setEditMatch(null); setSaving(false)
  }

  const filtered = matches.filter(m => filterStatus==='all' || m.status===filterStatus)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color:'#CCFF00', letterSpacing:2, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Gestión</div>
        <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>Partidos</h1>
      </div>

      {/* Filtros torneo */}
      {tournaments.length > 1 && (
        <div style={{ display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
          {tournaments.map((t:any) => (
            <button key={t.id} onClick={()=>setActiveTid(t.id)} style={{
              padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid', cursor:'pointer', whiteSpace:'nowrap',
              borderColor: activeTid===t.id?'#CCFF00':'rgba(255,255,255,0.1)',
              background: activeTid===t.id?'#CCFF00':'transparent',
              color: activeTid===t.id?'#000':'rgba(255,255,255,0.4)',
            }}>{t.name}</button>
          ))}
        </div>
      )}

      {/* Filtros estado */}
      <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {[['all','Todos'],['scheduled','Pendientes'],['live','En Vivo'],['finished','Finalizados'],['postponed','Pospuestos']].map(([v,l]) => (
          <button key={v} onClick={()=>setFilterStatus(v)} style={{
            padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid', cursor:'pointer', whiteSpace:'nowrap',
            borderColor: filterStatus===v?'#CCFF00':'rgba(255,255,255,0.08)',
            background: filterStatus===v?'rgba(204,255,0,0.12)':'transparent',
            color: filterStatus===v?'#CCFF00':'rgba(255,255,255,0.35)',
          }}>{l}</button>
        ))}
      </div>

      {/* Modal resultado */}
      <AnimatePresence>
        {editMatch && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={e=>{if(e.target===e.currentTarget)setEditMatch(null)}}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <motion.div initial={{scale:0.94,y:20}} animate={{scale:1,y:0}} exit={{scale:0.94,y:20}}
              style={{ background:'#111', border:'1px solid rgba(204,255,0,0.25)', borderRadius:16, padding:28, width:'100%', maxWidth:360 }}>
              <div style={{ fontSize:11, color:'#CCFF00', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Registrar Resultado</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
                {editMatch.home_team_name} vs {editMatch.away_team_name}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 24px 1fr', gap:8, alignItems:'center', marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:6, textAlign:'center', textTransform:'uppercase', letterSpacing:0.5 }}>
                    {editMatch.home_team_name}
                  </div>
                  <input type="number" min="0" value={score.home} onChange={e=>setScore(p=>({...p,home:e.target.value}))}
                    placeholder="0"
                    style={{ width:'100%', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'14px 8px', color:'#fff', fontSize:28, fontWeight:900, outline:'none', textAlign:'center' }} />
                </div>
                <div style={{ textAlign:'center', color:'rgba(255,255,255,0.2)', fontWeight:700, fontSize:18 }}>–</div>
                <div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:6, textAlign:'center', textTransform:'uppercase', letterSpacing:0.5 }}>
                    {editMatch.away_team_name}
                  </div>
                  <input type="number" min="0" value={score.away} onChange={e=>setScore(p=>({...p,away:e.target.value}))}
                    placeholder="0"
                    style={{ width:'100%', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'14px 8px', color:'#fff', fontSize:28, fontWeight:900, outline:'none', textAlign:'center' }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <motion.button whileTap={{scale:0.96}} onClick={saveResult}
                  disabled={saving||score.home===''||score.away===''}
                  style={{ flex:1, padding:'12px', background:score.home!==''&&score.away!==''?'#CCFF00':'#1a1a1a', color:score.home!==''&&score.away!==''?'#000':'#555', border:'none', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <IcoCheck /> {saving?'Guardando…':'Guardar'}
                </motion.button>
                <button onClick={()=>setEditMatch(null)} style={{ padding:'12px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}><IconX size={16} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista partidos */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[...Array(5)].map((_,i)=>(
            <div key={i} style={{ height:72, background:'#0d0d0d', borderRadius:12, opacity:0.5-i*0.06 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#333' }}>
          <div style={{ fontSize:14, marginBottom:4 }}>Sin partidos en esta categoría</div>
          <div style={{ fontSize:11, color:'#222' }}>Selecciona otro filtro o agrega partidos desde la DB</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map((m:any, i:number) => (
            <motion.div key={m.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
              style={{ background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.05)', borderRadius:12, padding:'12px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1 }}>
                  {m.matchday_number && <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontWeight:600, marginBottom:4 }}>JORNADA {m.matchday_number}</div>}
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{m.home_team_name}</span>
                    <span style={{
                      fontWeight:900, fontSize:17, minWidth:56, textAlign:'center',
                      color: m.status==='finished'?'#CCFF00' : m.status==='live'?'#CCFF00':'rgba(255,255,255,0.2)'
                    }}>
                      {m.status==='finished'||m.status==='live' ? `${m.home_score} – ${m.away_score}` : '–'}
                    </span>
                    <span style={{ fontWeight:700, fontSize:14 }}>{m.away_team_name}</span>
                  </div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:4 }}>
                    {m.scheduled_at?new Date(m.scheduled_at).toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'Sin horario'}
                    {m.field?` · ${m.field}`:''}
                    {m.referee_name?` · Árb: ${m.referee_name}`:''}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                  <div style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:999, letterSpacing:0.5, background:STATUS_COLOR[m.status]||'#1a1a1a', color:STATUS_TEXT[m.status]||'#666' }}>
                    {STATUS_LABEL[m.status]||m.status}
                  </div>
                  {m.status!=='finished' && (
                    <motion.button whileTap={{scale:0.94}}
                      onClick={()=>{setEditMatch(m);setScore({home:'',away:''})}}
                      style={{ padding:'5px 10px', background:'rgba(204,255,0,0.1)', border:'1px solid rgba(204,255,0,0.25)', borderRadius:7, color:'#CCFF00', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                      Resultado
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
