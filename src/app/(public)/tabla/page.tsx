'use client'

import { motion } from 'framer-motion'
import { standings, LEAGUE } from '@/lib/data'
import { TeamBadge, FormDots, fadeUp, stagger } from '@/components/parts'

export default function TablaPage() {
  const table = standings()

  return (
    <div style={{ padding: 'var(--sp-2)' }}>
      <motion.header {...fadeUp} transition={{ duration: 0.35 }} style={{ marginBottom: 'var(--sp-2)' }}>
        <div className="section-title">{LEAGUE.name} · {LEAGUE.season}</div>
        <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          Tabla <span className="neon-text">general</span>
        </h1>
      </motion.header>

      <motion.div variants={stagger} initial="initial" animate="animate" className="card" style={{ overflow: 'hidden' }}>
        {/* header de columnas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr 26px 26px 26px 26px 34px',
            gap: 6,
            padding: '10px var(--sp-2)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--muted)',
            letterSpacing: '0.04em',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span>#</span>
          <span>EQUIPO</span>
          <span style={{ textAlign: 'center' }}>PJ</span>
          <span style={{ textAlign: 'center' }}>DG</span>
          <span style={{ textAlign: 'center' }}>GF</span>
          <span style={{ textAlign: 'center' }}>GC</span>
          <span style={{ textAlign: 'right' }}>PTS</span>
        </div>

        {table.map((t, i) => {
          const dg = t.gf - t.gc
          const champ = i === 0
          const promo = i < 4
          return (
            <motion.div
              key={t.id}
              variants={fadeUp}
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 26px 26px 26px 26px 34px',
                gap: 6,
                alignItems: 'center',
                padding: '12px var(--sp-2)',
                borderBottom: i < table.length - 1 ? '1px solid var(--border)' : 'none',
                background: champ ? 'rgba(204,255,0,0.05)' : 'transparent',
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  color: champ ? 'var(--neon)' : 'var(--text)',
                }}
              >
                <span
                  style={{
                    width: 3,
                    height: 18,
                    borderRadius: 2,
                    background: promo ? 'var(--neon)' : 'transparent',
                  }}
                />
                {i + 1}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <TeamBadge team={t} size={28} />
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.name}
                  </span>
                  <span style={{ marginTop: 4 }}><FormDots form={t.form} /></span>
                </span>
              </span>
              <span style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>{t.pj}</span>
              <span style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: dg > 0 ? 'var(--neon)' : dg < 0 ? '#ff6b6b' : 'var(--text-2)' }}>
                {dg > 0 ? `+${dg}` : dg}
              </span>
              <span style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>{t.gf}</span>
              <span style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>{t.gc}</span>
              <span style={{ textAlign: 'right', fontWeight: 800, fontSize: 16 }}>{t.pts}</span>
            </motion.div>
          )
        })}
      </motion.div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'var(--sp-2)', fontSize: 11.5, color: 'var(--muted)' }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--neon)' }} />
        Zona de liguilla (top 4)
      </div>
    </div>
  )
}
