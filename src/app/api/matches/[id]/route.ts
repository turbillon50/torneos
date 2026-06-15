import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const b = await req.json()
    const rows = await sql`
      UPDATE matches SET
        home_score = ${b.home_score ?? null},
        away_score = ${b.away_score ?? null},
        status = ${b.status || 'finished'}
      WHERE id = ${params.id}
      RETURNING *`
    // Recalcular tabla si el partido terminó
    if (b.status === 'finished') {
      await recalcStandings(params.id)
    }
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

async function recalcStandings(matchId: string) {
  const matches = await sql`SELECT * FROM matches WHERE id = ${matchId}`
  const m = matches[0]
  if (!m || m.home_score === null) return

  const homeWon = m.home_score > m.away_score
  const awayWon = m.away_score > m.home_score
  const draw = m.home_score === m.away_score

  // Upsert home team
  await sql`
    INSERT INTO standings (tournament_id, team_id, played, won, drawn, lost, goals_for, goals_against, goal_difference, points)
    VALUES (${m.tournament_id}, ${m.home_team_id}, 1,
      ${homeWon ? 1 : 0}, ${draw ? 1 : 0}, ${awayWon ? 1 : 0},
      ${m.home_score}, ${m.away_score}, ${m.home_score - m.away_score},
      ${homeWon ? 3 : draw ? 1 : 0})
    ON CONFLICT (tournament_id, team_id) DO UPDATE SET
      played = standings.played + 1,
      won = standings.won + ${homeWon ? 1 : 0},
      drawn = standings.drawn + ${draw ? 1 : 0},
      lost = standings.lost + ${awayWon ? 1 : 0},
      goals_for = standings.goals_for + ${m.home_score},
      goals_against = standings.goals_against + ${m.away_score},
      goal_difference = standings.goal_difference + ${m.home_score - m.away_score},
      points = standings.points + ${homeWon ? 3 : draw ? 1 : 0},
      updated_at = now()`

  // Upsert away team
  await sql`
    INSERT INTO standings (tournament_id, team_id, played, won, drawn, lost, goals_for, goals_against, goal_difference, points)
    VALUES (${m.tournament_id}, ${m.away_team_id}, 1,
      ${awayWon ? 1 : 0}, ${draw ? 1 : 0}, ${homeWon ? 1 : 0},
      ${m.away_score}, ${m.home_score}, ${m.away_score - m.home_score},
      ${awayWon ? 3 : draw ? 1 : 0})
    ON CONFLICT (tournament_id, team_id) DO UPDATE SET
      played = standings.played + 1,
      won = standings.won + ${awayWon ? 1 : 0},
      drawn = standings.drawn + ${draw ? 1 : 0},
      lost = standings.lost + ${homeWon ? 1 : 0},
      goals_for = standings.goals_for + ${m.away_score},
      goals_against = standings.goals_against + ${m.home_score},
      goal_difference = standings.goal_difference + ${m.away_score - m.home_score},
      points = standings.points + ${awayWon ? 3 : draw ? 1 : 0},
      updated_at = now()`
}
