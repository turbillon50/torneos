import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tid = searchParams.get('tournament_id')
    const rows = tid
      ? await sql`
          SELECT m.*,
            ht.name as home_team_name, ht.shield_url as home_team_shield,
            at.name as away_team_name, at.shield_url as away_team_shield,
            r.name as referee_name, md.number as matchday_number
          FROM matches m
          LEFT JOIN teams ht ON m.home_team_id = ht.id
          LEFT JOIN teams at ON m.away_team_id = at.id
          LEFT JOIN referees r ON m.referee_id = r.id
          LEFT JOIN matchdays md ON m.matchday_id = md.id
          WHERE m.tournament_id = ${tid}
          ORDER BY m.scheduled_at ASC NULLS LAST`
      : await sql`
          SELECT m.*,
            ht.name as home_team_name, ht.shield_url as home_team_shield,
            at.name as away_team_name, at.shield_url as away_team_shield,
            r.name as referee_name, md.number as matchday_number
          FROM matches m
          LEFT JOIN teams ht ON m.home_team_id = ht.id
          LEFT JOIN teams at ON m.away_team_id = at.id
          LEFT JOIN referees r ON m.referee_id = r.id
          LEFT JOIN matchdays md ON m.matchday_id = md.id
          ORDER BY m.scheduled_at ASC NULLS LAST`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO matches (matchday_id, tournament_id, home_team_id, away_team_id, referee_id, field, scheduled_at)
      VALUES (${b.matchday_id}, ${b.tournament_id}, ${b.home_team_id}, ${b.away_team_id},
              ${b.referee_id || null}, ${b.field || null}, ${b.scheduled_at || null})
      RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
