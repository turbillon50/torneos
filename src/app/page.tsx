'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const HERO_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3DDb66hXpSaWG4DmoX3Ae5V2dqt/hf_20260615_035205_4b479300-4fe1-4138-9f25-2b455f48499e.png"
const PLAYER_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3DDb66hXpSaWG4DmoX3Ae5V2dqt/hf_20260615_035327_761cb9f8-edc9-4310-b9ae-a3042b04fcf6.png"
const TROPHY_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3DDb66hXpSaWG4DmoX3Ae5V2dqt/hf_20260615_035329_95f00f96-7daf-46e6-8b1e-1c0b85ec4ad0.png"

const IconTable = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconBall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>
)
const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="1"/>
    <path d="M5 22V12l7 4 7-4v10"/>
  </svg>
)
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}{suffix}</span>
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => { setTimeout(onComplete, 2000) }, [onComplete])
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        <motion.div
          animate={{ boxShadow: ['0 0 0px #CCFF00', '0 0 40px #CCFF00', '0 0 0px #CCFF00'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: 96, height: 96, background: '#CCFF00', borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 900, color: '#000', letterSpacing: -2 }}>S2</span>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>S2 SPORT</div>
        <div style={{ fontSize: 12, color: '#555', letterSpacing: 3, marginTop: 4, textTransform: 'uppercase' }}>Torneos</div>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        style={{ height: 2, background: '#CCFF00', borderRadius: 999 }}
      />
    </motion.div>
  )
}

export default function Landing() {
  const [mounted, setMounted] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 120])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ background: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}
      >
        {/* NAV */}
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0 24px', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#CCFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000' }}>S2</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>S2 Sport</div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: 1, textTransform: 'uppercase' }}>Torneos</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link href="/tabla" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#888', textDecoration: 'none' }}>Tabla</Link>
            <Link href="/calendario" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#888', textDecoration: 'none' }}>Partidos</Link>
            <Link href="/admin" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#CCFF00', color: '#000', textDecoration: 'none' }}>Admin</Link>
          </div>
        </motion.nav>

        {/* HERO full bleed */}
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{ y: heroY, position: 'absolute', inset: '-10%' }}>
            <img src={HERO_IMG} alt="S2 Sport" style={{ width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.9) 80%, #000 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204,255,0,0.01) 2px, rgba(204,255,0,0.01) 4px)', pointerEvents: 'none' }} />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity, position: 'absolute', bottom: '12%', left: 0, right: 0, padding: '0 24px', maxWidth: 900, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.3)', fontSize: 11, fontWeight: 700, color: '#CCFF00', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CCFF00' }} />
                Plataforma oficial S2 Sport
              </div>
              <h1 style={{ fontSize: 'clamp(48px, 9vw, 96px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, marginBottom: 24 }}>
                La Liga.<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1px #CCFF00', textShadow: '0 0 40px rgba(204,255,0,0.3)' }}>Digitalizada.</span>
              </h1>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 440, lineHeight: 1.6, marginBottom: 32 }}>
                Resultados en tiempo real, tablas automáticas, control de pagos y sanciones — todo desde una sola plataforma.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/tabla" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, background: '#CCFF00', color: '#000', textDecoration: 'none' }}>
                  <IconTable /> Ver Tabla
                </Link>
                <Link href="/calendario" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 10, fontWeight: 600, fontSize: 15, border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.05)' }}>
                  <IconCalendar /> Partidos
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="6 9 12 15 18 9"/></svg>
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'rgba(255,255,255,0.02)' }}
        >
          {[{ value: 3, suffix: '', label: 'TORNEOS ACTIVOS' }, { value: 24, suffix: '', label: 'EQUIPOS' }, { value: 312, suffix: '+', label: 'JUGADORES' }, { value: 98, suffix: '%', label: 'REGISTRADOS' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#CCFF00', letterSpacing: -1 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* FEATURES SPLIT */}
        <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div style={{ fontSize: 11, color: '#CCFF00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Control total</div>
              <h2 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: -1.5, marginBottom: 24 }}>Todo lo que necesita tu liga</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 36 }}>
                Desde el primer partido hasta el trofeo final. Tablas automáticas, sanciones, pagos y notificaciones en una sola plataforma.
              </p>
              {[
                { Icon: IconTable, title: 'Tabla automática', desc: 'Se actualiza sola con cada resultado registrado.' },
                { Icon: IconCard, title: 'Tarjetas y suspensiones', desc: 'Acumulación automática. Cero papel.' },
                { Icon: IconBell, title: 'Avisos a equipos', desc: 'Notifica cambios de horario al instante.' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ color: '#CCFF00', marginTop: 2, flexShrink: 0 }}><f.Icon /></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ position: 'relative' }}>
              <img src={PLAYER_IMG} alt="Jugador" style={{ width: '100%', borderRadius: 20, aspectRatio: '4/5', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: '1px solid rgba(204,255,0,0.15)', boxShadow: '0 0 60px rgba(204,255,0,0.08) inset' }} />
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(204,255,0,0.2)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CCFF00' }} />
                <div>
                  <div style={{ fontSize: 11, color: '#CCFF00', fontWeight: 700 }}>EN VIVO</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Tigres 2 – 1 Leones</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TROPHY */}
        <section style={{ position: 'relative', overflow: 'hidden', margin: '0 24px 100px', borderRadius: 24 }}>
          <img src={TROPHY_IMG} alt="Copa" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.3) 100%)', display: 'flex', alignItems: 'center', padding: '0 60px' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ maxWidth: 480 }}>
              <div style={{ fontSize: 11, color: '#CCFF00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>3 accesos</div>
              <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, letterSpacing: -1.5, marginBottom: 20 }}>Una app.<br />Tres roles.</h2>
              {[
                { Icon: IconBall, label: 'Aficionado', desc: 'Tabla, calendario y estadísticas. Sin registro.' },
                { Icon: IconShield, label: 'Capitán', desc: 'Plantilla, pagos y sanciones de tu equipo.' },
                { Icon: IconSettings, label: 'Administrador', desc: 'Control total de la liga.' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ color: '#CCFF00' }}><r.Icon /></div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{r.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginLeft: 8 }}>{r.desc}</span>
                  </div>
                </div>
              ))}
              <Link href="/tabla" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: '#CCFF00', color: '#000', textDecoration: 'none', marginTop: 20 }}>
                Explorar ahora <IconArrow />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#CCFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000' }}>S2</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>S2 Sport Torneos</div>
              <div style={{ fontSize: 11, color: '#555' }}>Desarrollado por V·Momentum</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/tabla" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>Tabla</Link>
            <Link href="/calendario" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>Partidos</Link>
            <Link href="/equipos" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>Equipos</Link>
            <Link href="/admin" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>Admin</Link>
          </div>
        </footer>
      </motion.div>
    </>
  )
}
