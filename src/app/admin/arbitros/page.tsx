'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IcoPlus, IcoRef } from '@/components/admin/AdminIcons'

export default function AdminArbitrosPage() {
  const [refs, setRefs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)

  // Cargar árbitros desde la tabla referees via API
  useEffect(() => {
    fetch('/api/referees').then(r=>r.json()).catch(()=>[])
      .then((d:any[]) => { setRefs(Array.isArray(d)?d:[]); setLoading(false) })
  }, [])

  async function addRef() {
    if (!form.name.trim()) return
    setSaving(true)
    const res = await fetch('/api/referees', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const r = await res.json()
      setRefs(prev=>[...prev, r])
    }
    setForm({name:'',phone:''}); setShowForm(false); setSaving(false)
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:10, color:'#CCFF00', letterSpacing:2, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Gestión</div>
          <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>Árbitros</h1>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{refs.length} registrados</div>
        </div>
        <motion.button whileTap={{scale:0.95}} onClick={()=>setShowForm(!showForm)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'#CCFF00', color:'#000', border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer' }}>
          <IcoPlus size={15} /> Agregar
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            style={{ background:'#0d0d0d', border:'1px solid rgba(204,255,0,0.2)', borderRadius:12, padding:16, marginBottom:16, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <input placeholder="Nombre *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none' }} />
              <input placeholder="Teléfono" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none' }} />
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <motion.button whileTap={{scale:0.96}} onClick={addRef} disabled={saving||!form.name}
                style={{ padding:'8px 20px', background:form.name?'#CCFF00':'#1a1a1a', color:form.name?'#000':'#555', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:form.name?'pointer':'default' }}>
                {saving?'Guardando…':'Guardar'}
              </motion.button>
              <button onClick={()=>setShowForm(false)} style={{ padding:'8px 14px', background:'transparent', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13 }}>Cancelar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[...Array(4)].map((_,i)=><div key={i} style={{ height:56, background:'#0d0d0d', borderRadius:10, opacity:0.5-i*0.1 }} />)}
        </div>
      ) : refs.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#333' }}>
          <IcoRef size={40} />
          <div style={{ fontSize:14, marginTop:16, marginBottom:4 }}>Sin árbitros registrados</div>
          <div style={{ fontSize:12, color:'#222' }}>Agrega el primero con el botón de arriba</div>
        </div>
      ) : refs.map((r:any, i:number) => (
        <motion.div key={r.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
          style={{ background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          <div style={{ width:36, height:36, background:'rgba(204,255,0,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#CCFF00', flexShrink:0 }}>
            <IcoRef size={18} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{r.name}</div>
            {r.phone && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{r.phone}</div>}
          </div>
          <div style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, color:r.status==='active'?'#000':'rgba(255,255,255,0.3)', background:r.status==='active'?'#CCFF00':'rgba(255,255,255,0.06)' }}>
            {r.status==='active'?'ACTIVO':'INACTIVO'}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
