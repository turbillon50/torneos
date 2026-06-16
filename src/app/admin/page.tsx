'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LEAGUE,
  standings,
  upcomingMatches,
  playedMatches,
  SQUAD,
  teamById,
} from '@/lib/data'
import { TeamBadge, fadeUp, stagger } from '@/components/parts'
import {
  IconChart,
  IconTeams,
  IconBall,
  IconMoney,
  IconBell,
  IconShield,
  IconArrow,
  IconCheck,
} from '@/components/Icons'

type Section = 'resumen' | 'equipos' | 'partidos' | 'pagos'

const NAV: { id: Section; label: string; Icon: typeof IconChart }[] = [
  { id: 'resumen', label: 'Resumen', Icon: IconChart },
  { id: 'equipos', label: 'Equipos', Icon: IconTeams },
  { id: 'partidos', label: 'Partidos', Icon: IconBall },
  { id: 'pagos', label: 'Pagos', Icon: IconMoney },
]

export default function AdminPage() {
  const [section, setSection] = useState<Section>('resumen')

  return (
    <div style={{ minHeight: '100dvh', display: 'flex' }}>
      {/* ── Sidebar desktop 240px ── */}
      <aside
        className="admin-sidebar"
        style={{
          width: 'var(--sidebar-w)',
          minWidth: 'var(--sidebar-w)',
          borderRight: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: 'var(--sp-3) var(--sp-2)',
          position: 'sticky',
          top: 0,
          height: '100dvh',
          flexDirection: 'column',
          gap: 'var(--sp-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-2)' }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--r-sm)',
              background: 'var(--neon)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
            }}
          >
            S2
          </span>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Admin</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{LEAGUE.name}</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = section === id
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '11px 12px',
                  border: 'none',
                  borderRadius: 'var(--r-md)',
                  background: active ? 'var(--neon)' : 'transparent',
                  color: active ? '#000' : 'var(--text-2)',
                  fontWeight: active ? 800 : 600,
                  fontSize: 14,
                  textAlign: 'left',
                  transition: 'all var(--anim-fast)',
                }}
              >
                <Icon width={19} height={19} strokeWidth={active ? 2.2 : 1.9} />
                {label}
              </button>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <KpiMini label="Ingresos del mes" value="$24,800" />
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: 'var(--muted)',
              padding: '8px 12px',
            }}
          >
            <IconArrow width={15} height={15} style={{ transform: 'rotate(180deg)' }} /> Ver app pública
          </Link>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--sp-2)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
          }}
        >
          <div>
            <div className="section-title">Panel de control</div>
            <div style={{ fontWeight: 800, fontSize: 18, textTransform: 'capitalize' }}>{section}</div>
          </div>
          <button
            aria-label="Notificaciones"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--r-full)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBell width={20} height={20} />
          </button>
        </header>

        <main className="admin-main" style={{ padding: 'var(--sp-2)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {section === 'resumen' && <Resumen />}
              {section === 'equipos' && <Equipos />}
              {section === 'partidos' && <Partidos />}
              {section === 'pagos' && <Pagos />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Bottom nav mobile ── */}
      <nav
        className="admin-bottomnav"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'calc(var(--nav-h) + env(safe-area-inset-bottom, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          gridTemplateColumns: `repeat(${NAV.length}, 1fr)`,
          background: 'rgba(8,8,8,0.94)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid var(--border)',
          zIndex: 50,
        }}
      >
        {NAV.map(({ id, label, Icon }) => {
          const active = section === id
          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                height: 'var(--nav-h)',
                color: active ? 'var(--neon)' : 'var(--muted)',
              }}
            >
              <Icon width={21} height={21} strokeWidth={active ? 2.2 : 1.9} />
              <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/* ── Secciones ── */

function Resumen() {
  const table = standings()
  const next = upcomingMatches().slice(0, 3)
  const played = playedMatches().length
  const pending = SQUAD.filter((p) => !p.paid).length

  return (
    <div className="pb-safe-admin" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--sp-1)' }}
      >
        <BigKpi icon={<IconTeams width={20} height={20} />} value="8" label="Equipos activos" />
        <BigKpi icon={<IconBall width={20} height={20} />} value={String(played)} label="Partidos jugados" />
        <BigKpi icon={<IconMoney width={20} height={20} />} value="$24,800" label="Ingresos del mes" accent />
        <BigKpi icon={<IconShield width={20} height={20} />} value={String(pending)} label="Pagos pendientes" />
      </motion.div>

      <section>
        <h2 className="section-title" style={{ marginBottom: 'var(--sp-1)' }}>Próximos partidos a programar</h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          {next.map((m, i) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px var(--sp-2)',
                borderBottom: i < next.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <TeamBadge team={teamById(m.home)} size={28} />
              <span style={{ fontSize: 11, color: 'var(--neon)', fontWeight: 700 }}>vs</span>
              <TeamBadge team={teamById(m.away)} size={28} />
              <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text-2)', textAlign: 'right' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title" style={{ marginBottom: 'var(--sp-1)' }}>Líderes</h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          {table.slice(0, 3).map((t, i) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '11px var(--sp-2)',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ width: 18, fontWeight: 800, color: i === 0 ? 'var(--neon)' : 'var(--text)' }}>{i + 1}</span>
              <TeamBadge team={t} size={28} />
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{t.name}</span>
              <span style={{ fontWeight: 800 }}>{t.pts} pts</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Equipos() {
  const teams = standings()
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="pb-safe-admin card"
      style={{ overflow: 'hidden' }}
    >
      {teams.map((t, i) => (
        <motion.div
          key={t.id}
          variants={fadeUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '13px var(--sp-2)',
            borderBottom: i < teams.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <TeamBadge team={t} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
              {t.g}G · {t.e}E · {t.p}P
            </div>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>{t.pts}</span>
          <button
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-2)',
              borderRadius: 'var(--r-sm)',
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Editar
          </button>
        </motion.div>
      ))}
    </motion.div>
  )
}

function Partidos() {
  const next = upcomingMatches()
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="pb-safe-admin"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}
    >
      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 4px' }}>Captura el marcador final de cada partido.</p>
      {next.map((m) => (
        <motion.div key={m.id} variants={fadeUp} className="card" style={{ padding: 'var(--sp-2)' }}>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10 }}>
            {m.label} · {m.venue}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TeamBadge team={teamById(m.home)} size={30} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{teamById(m.home).short}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ScoreInput />
              <span style={{ color: 'var(--muted)' }}>:</span>
              <ScoreInput />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{teamById(m.away).short}</span>
              <TeamBadge team={teamById(m.away)} size={30} />
            </div>
          </div>
          <button
            style={{
              width: '100%',
              marginTop: 12,
              padding: '10px',
              border: 'none',
              borderRadius: 'var(--r-md)',
              background: 'var(--neon)',
              color: '#000',
              fontWeight: 800,
              fontSize: 13.5,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <IconCheck width={16} height={16} /> Guardar resultado
          </button>
        </motion.div>
      ))}
    </motion.div>
  )
}

function Pagos() {
  const rows = [
    { team: 'Halcones FC', paid: 8, total: 8 },
    { team: 'Tiburones', paid: 7, total: 8 },
    { team: 'Real Cancún', paid: 8, total: 8 },
    { team: 'Deportivo Maya', paid: 6, total: 8 },
    { team: 'Atlético Centro', paid: 5, total: 8 },
    { team: 'Guerreros FC', paid: 7, total: 8 },
    { team: 'Pumas del Sur', paid: 4, total: 8 },
    { team: 'Inter Caribe', paid: 6, total: 8 },
  ]
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="pb-safe-admin card" style={{ overflow: 'hidden' }}>
      {rows.map((r, i) => {
        const pct = Math.round((r.paid / r.total) * 100)
        const full = r.paid === r.total
        return (
          <motion.div
            key={r.team}
            variants={fadeUp}
            style={{
              padding: '13px var(--sp-2)',
              borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{r.team}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: full ? 'var(--neon)' : 'var(--text-2)' }}>
                {r.paid}/{r.total}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 'var(--r-full)', background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--neon)' }} />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ── Bits ── */

function BigKpi({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode
  value: string
  label: string
  accent?: boolean
}) {
  return (
    <motion.div variants={fadeUp} className="card" style={{ padding: 'var(--sp-2)' }}>
      <span style={{ color: accent ? 'var(--neon)' : 'var(--text-2)' }}>{icon}</span>
      <div style={{ fontWeight: 900, fontSize: 24, marginTop: 10, color: accent ? 'var(--neon)' : 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
    </motion.div>
  )
}

function KpiMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ padding: 'var(--sp-2)' }}>
      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--neon)', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function ScoreInput() {
  return (
    <input
      type="text"
      inputMode="numeric"
      defaultValue="0"
      maxLength={2}
      style={{
        width: 44,
        height: 44,
        textAlign: 'center',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
        color: 'var(--text)',
        fontWeight: 800,
        fontSize: 18,
        outline: 'none',
      }}
    />
  )
}
