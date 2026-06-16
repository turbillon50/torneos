'use client'

import { motion } from 'framer-motion'
import { type Match, type Team, teamById } from '@/lib/data'
import { IconPin, IconClock } from './Icons'

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export function TeamBadge({
  team,
  size = 34,
}: {
  team: Team
  size?: number
}) {
  const dark = team.color.toLowerCase() === '#ffffff' || team.color.toLowerCase() === '#ccff00'
  return (
    <span
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 'var(--r-full)',
        background: `${team.color}1f`,
        border: `1.5px solid ${team.color}`,
        color: dark ? team.color : team.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.32,
        fontWeight: 800,
        letterSpacing: '0.02em',
      }}
    >
      {team.short}
    </span>
  )
}

export function FormDots({ form }: { form: ('G' | 'E' | 'P')[] }) {
  const map = { G: 'var(--neon)', E: '#555', P: '#ff4d4d' }
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {form.map((f, i) => (
        <span
          key={i}
          title={f}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: map[f],
          }}
        />
      ))}
    </span>
  )
}

export function MatchCard({ match, index = 0 }: { match: Match; index?: number }) {
  const home = teamById(match.home)
  const away = teamById(match.away)
  const played = match.status === 'played'
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: index * 0.04 }}
      className="card"
      style={{ padding: 'var(--sp-2)' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <span
          className="chip"
          style={{
            background: match.status === 'today' ? 'var(--neon)' : 'var(--surface-2)',
            color: match.status === 'today' ? '#000' : 'var(--text-2)',
          }}
        >
          <IconClock width={13} height={13} />
          {match.label}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>J{match.jornada}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
        <Side team={home} align="flex-start" />
        <div style={{ textAlign: 'center', minWidth: 56 }}>
          {played ? (
            <span style={{ fontSize: 22, fontWeight: 800 }}>
              {match.homeGoals}<span style={{ color: 'var(--muted)', margin: '0 6px' }}>·</span>{match.awayGoals}
            </span>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neon)' }}>VS</span>
          )}
        </div>
        <Side team={away} align="flex-end" />
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11.5,
          color: 'var(--muted)',
        }}
      >
        <IconPin width={13} height={13} />
        {match.venue}
      </div>
    </motion.div>
  )
}

function Side({ team, align }: { team: Team; align: 'flex-start' | 'flex-end' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: align === 'flex-end' ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: align,
      }}
    >
      <TeamBadge team={team} size={36} />
      <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.1 }}>{team.name}</span>
    </div>
  )
}
