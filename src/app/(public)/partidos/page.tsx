'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { todayMatches, upcomingMatches, playedMatches } from '@/lib/data'
import { MatchCard, fadeUp, stagger } from '@/components/parts'

type Tab = 'proximos' | 'jugados'

export default function PartidosPage() {
  const [tab, setTab] = useState<Tab>('proximos')

  const proximos = [...todayMatches(), ...upcomingMatches()]
  const jugados = playedMatches()
  const list = tab === 'proximos' ? proximos : jugados

  return (
    <div style={{ padding: 'var(--sp-2)' }}>
      <motion.header {...fadeUp} transition={{ duration: 0.35 }} style={{ marginBottom: 'var(--sp-2)' }}>
        <div className="section-title">Calendario · Liga S2</div>
        <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          Partidos
        </h1>
      </motion.header>

      {/* tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          padding: 4,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-full)',
          marginBottom: 'var(--sp-2)',
        }}
      >
        {(['proximos', 'jugados'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              position: 'relative',
              border: 'none',
              background: 'transparent',
              padding: '9px 0',
              borderRadius: 'var(--r-full)',
              fontSize: 13.5,
              fontWeight: 700,
              color: tab === t ? '#000' : 'var(--text-2)',
              transition: 'color var(--anim-fast)',
            }}
          >
            {tab === t && (
              <motion.span
                layoutId="tab-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--neon)',
                  borderRadius: 'var(--r-full)',
                  zIndex: 0,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {t === 'proximos' ? `Próximos (${proximos.length})` : `Jugados (${jugados.length})`}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={stagger}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0, x: -16 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}
        >
          {list.map((m, i) => (
            <MatchCard key={m.id} match={m} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
