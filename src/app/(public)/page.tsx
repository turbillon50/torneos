'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LEAGUE,
  standings,
  todayMatches,
  upcomingMatches,
  playedMatches,
  teamById,
} from '@/lib/data'
import { TeamBadge, MatchCard, FormDots, fadeUp, stagger } from '@/components/parts'
import { IconArrow, IconUser, IconTrophy } from '@/components/Icons'

export default function Home() {
  const table = standings()
  const top3 = table.slice(0, 3)
  const today = todayMatches()
  const next = upcomingMatches().slice(0, 2)
  const recent = playedMatches().slice(0, 4)
  const todayOrNext = today.length ? today : next

  return (
    <div>
      {/* ── Hero: cancha + overlay + header ── */}
      <section style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
        <Image
          src="/images/cancha.png"
          alt="Cancha"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.95) 100%)',
          }}
        />
        <div style={{ position: 'relative', padding: 'var(--sp-3) var(--sp-2) var(--sp-2)' }}>
          {/* header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  fontSize: 16,
                  letterSpacing: '-0.03em',
                }}
              >
                S2
              </span>
              <div style={{ lineHeight: 1.05 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{LEAGUE.brand}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                  {LEAGUE.name} · {LEAGUE.season}
                </div>
              </div>
            </div>
            <Link
              href="/capitan"
              aria-label="Mi cuenta"
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--r-full)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <IconUser width={20} height={20} />
            </Link>
          </div>

          {/* título hero */}
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} style={{ marginTop: 36 }}>
            <span className="chip" style={{ background: 'var(--neon)', color: '#000' }}>
              ● EN VIVO · JORNADA 8
            </span>
            <h1
              style={{
                margin: '12px 0 0',
                fontSize: 30,
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              La liga, <span className="neon-text">en tu mano</span>.
            </h1>
          </motion.div>
        </div>
      </section>

      <div style={{ padding: 'var(--sp-2)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {/* ── Hoy ── */}
        <motion.section variants={stagger} initial="initial" animate="animate">
          <SectionHead
            title={today.length ? 'Partidos de hoy' : 'Próximos partidos'}
            href="/partidos"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', marginTop: 'var(--sp-1)' }}>
            {todayOrNext.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        </motion.section>

        {/* ── Tabla rápida top 3 ── */}
        <motion.section variants={stagger} initial="initial" animate="animate">
          <SectionHead title="Tabla · Top 3" href="/tabla" />
          <motion.div variants={fadeUp} className="card" style={{ marginTop: 'var(--sp-1)', overflow: 'hidden' }}>
            {top3.map((t, i) => (
              <Link
                key={t.id}
                href="/tabla"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px var(--sp-2)',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span
                  style={{
                    width: 22,
                    fontWeight: 800,
                    fontSize: 15,
                    color: i === 0 ? 'var(--neon)' : 'var(--text)',
                  }}
                >
                  {i + 1}
                </span>
                <TeamBadge team={t} size={30} />
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{t.name}</span>
                <FormDots form={t.form} />
                <span style={{ fontWeight: 800, fontSize: 16, minWidth: 26, textAlign: 'right' }}>
                  {t.pts}
                </span>
              </Link>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Goleador destacado ── */}
        <motion.section variants={fadeUp} initial="initial" animate="animate">
          <div
            className="card"
            style={{
              padding: 'var(--sp-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'linear-gradient(120deg, #1a1a08, var(--surface))',
              borderColor: '#3a3a14',
            }}
          >
            <span style={{ color: 'var(--neon)' }}>
              <IconTrophy width={30} height={30} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="section-title">Líder de goleo</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>D. Canul · Halcones FC</div>
            </div>
            <span style={{ fontWeight: 900, fontSize: 26, color: 'var(--neon)' }}>9</span>
          </div>
        </motion.section>

        {/* ── Últimos resultados ── */}
        <motion.section variants={stagger} initial="initial" animate="animate">
          <SectionHead title="Últimos resultados" href="/partidos" />
          <motion.div variants={fadeUp} className="card" style={{ marginTop: 'var(--sp-1)', overflow: 'hidden' }}>
            {recent.map((m, i) => {
              const h = teamById(m.home)
              const a = teamById(m.away)
              const hw = (m.homeGoals ?? 0) > (m.awayGoals ?? 0)
              const aw = (m.awayGoals ?? 0) > (m.homeGoals ?? 0)
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: 8,
                    padding: '11px var(--sp-2)',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span style={{ textAlign: 'right', fontSize: 13, fontWeight: hw ? 800 : 500, color: hw ? 'var(--text)' : 'var(--text-2)' }}>
                    {h.name}
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      background: 'var(--surface-2)',
                      borderRadius: 'var(--r-sm)',
                      padding: '3px 10px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.homeGoals} - {m.awayGoals}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: aw ? 800 : 500, color: aw ? 'var(--text)' : 'var(--text-2)' }}>
                    {a.name}
                  </span>
                </div>
              )
            })}
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2 className="section-title">{title}</h2>
      <Link
        href={href}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--neon)' }}
      >
        Ver todo <IconArrow width={14} height={14} />
      </Link>
    </div>
  )
}
