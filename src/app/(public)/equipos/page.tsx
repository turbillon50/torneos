'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { standings } from '@/lib/data'
import { TeamBadge, FormDots, fadeUp, stagger } from '@/components/parts'
import { IconBall, IconShield } from '@/components/Icons'

export default function EquiposPage() {
  const teams = standings()

  return (
    <div style={{ padding: 'var(--sp-2)' }}>
      <motion.header {...fadeUp} transition={{ duration: 0.35 }} style={{ marginBottom: 'var(--sp-2)' }}>
        <div className="section-title">8 equipos · Apertura 2026</div>
        <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          Los <span className="neon-text">equipos</span>
        </h1>
      </motion.header>

      {/* destacado con imagen jugador */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          marginBottom: 'var(--sp-2)',
          minHeight: 150,
          border: '1px solid var(--border)',
        }}
      >
        <Image src="/images/jugador.png" alt="Jugador destacado" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'top center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.1))' }} />
        <div style={{ position: 'relative', padding: 'var(--sp-2)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 150 }}>
          <span className="chip" style={{ background: 'var(--neon)', color: '#000', alignSelf: 'flex-start' }}>
            <IconShield width={13} height={13} /> LÍDER
          </span>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>Halcones FC</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>19 pts · invicto · 18 goles a favor</div>
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-1)' }}
      >
        {teams.map((t) => (
          <motion.div key={t.id} variants={fadeUp} whileTap={{ scale: 0.97 }} className="card" style={{ padding: 'var(--sp-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <TeamBadge team={t} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.pj} jugados</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--neon)' }}>{t.pts}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>pts</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-2)' }}>
                <IconBall width={14} height={14} /> {t.gf}
              </span>
              <FormDots form={t.form} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
