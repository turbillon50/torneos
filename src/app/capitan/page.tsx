'use client'

import { motion } from 'framer-motion'
import { SQUAD, upcomingMatches, teamById } from '@/lib/data'
import { fadeUp, stagger, TeamBadge } from '@/components/parts'
import {
  IconShield,
  IconUser,
  IconMoney,
  IconCard,
  IconCheck,
  IconClock,
  IconPin,
  IconPlus,
} from '@/components/Icons'

export default function CapitanPage() {
  const squad = SQUAD
  const paid = squad.filter((p) => p.paid).length
  const next = upcomingMatches().find((m) => m.home === 'halcones' || m.away === 'halcones')
  const totalGoals = squad.reduce((s, p) => s + p.goals, 0)
  const cards = squad.reduce((s, p) => s + p.yellow + p.red, 0)

  return (
    <div style={{ padding: 'var(--sp-2)' }}>
      {/* header capitán */}
      <motion.header
        {...fadeUp}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--sp-3)' }}
      >
        <span
          style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--r-md)',
            background: 'var(--neon)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconShield width={26} height={26} />
        </span>
        <div style={{ flex: 1 }}>
          <div className="section-title">Modo capitán</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Halcones FC</div>
        </div>
        <span className="chip" style={{ background: '#fff', color: '#111' }}>1º lugar</span>
      </motion.header>

      {/* KPIs */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--sp-1)', marginBottom: 'var(--sp-3)' }}
      >
        <Kpi icon={<IconUser width={18} height={18} />} label="Jugadores" value={squad.length} />
        <Kpi icon={<IconMoney width={18} height={18} />} label="Al corriente" value={`${paid}/${squad.length}`} accent />
        <Kpi icon={<IconCard width={18} height={18} />} label="Tarjetas" value={cards} />
      </motion.div>

      {/* próximo partido */}
      {next && (
        <motion.div {...fadeUp} className="card" style={{ padding: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
          <div className="section-title" style={{ marginBottom: 10 }}>Tu próximo partido</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TeamBadge team={teamById(next.home)} size={34} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neon)' }}>VS</span>
              <TeamBadge team={teamById(next.away)} size={34} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', fontSize: 12.5, fontWeight: 600 }}>
                <IconClock width={13} height={13} /> {next.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>
                <IconPin width={12} height={12} /> {next.venue}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* plantilla */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
        <h2 className="section-title">Plantilla · {totalGoals} goles</h2>
        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            border: '1.5px solid var(--neon)',
            background: 'transparent',
            color: 'var(--neon)',
            borderRadius: 'var(--r-full)',
            padding: '6px 12px',
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <IconPlus width={15} height={15} /> Agregar
        </motion.button>
      </div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="card" style={{ overflow: 'hidden' }}>
        {squad.map((p, i) => (
          <motion.div
            key={p.id}
            variants={fadeUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px var(--sp-2)',
              borderBottom: i < squad.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 'var(--r-full)',
                background: 'var(--surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                color: 'var(--neon)',
              }}
            >
              {p.number}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                {p.position} · {p.goals} goles
              </div>
            </div>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {p.yellow > 0 && <Pill color="#f5c542" n={p.yellow} />}
              {p.red > 0 && <Pill color="#ff4d4d" n={p.red} />}
            </span>
            {p.paid ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#000',
                  background: 'var(--neon)',
                  padding: '3px 8px',
                  borderRadius: 'var(--r-full)',
                }}
              >
                <IconCheck width={12} height={12} /> Pagó
              </span>
            ) : (
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '3px 8px',
                  borderRadius: 'var(--r-full)',
                }}
              >
                Debe
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <motion.div variants={fadeUp} className="card" style={{ padding: 'var(--sp-2)' }}>
      <span style={{ color: accent ? 'var(--neon)' : 'var(--text-2)' }}>{icon}</span>
      <div style={{ fontWeight: 900, fontSize: 22, marginTop: 8, color: accent ? 'var(--neon)' : 'var(--text)' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
    </motion.div>
  )
}

function Pill({ color, n }: { color: string; n: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 11,
        fontWeight: 700,
        color,
      }}
    >
      <span style={{ width: 9, height: 12, borderRadius: 2, background: color, display: 'inline-block' }} />
      {n}
    </span>
  )
}
