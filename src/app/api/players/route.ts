import { NextResponse } from 'next/server'
import sql, { hasDb } from '@/lib/db'
import { getPlayers } from '@/lib/mock'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
    if (!hasDb()) return NextResponse.json(getPlayers(teamId))
    const rows = teamId
      ? await sql`SELECT * FROM players WHERE team_id = ${teamId} ORDER BY number ASC NULLS LAST`
      : await sql`SELECT p.*, t.name as team_name FROM players p LEFT JOIN teams t ON p.team_id = t.id ORDER BY p.goals DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!hasDb()) {
      const b = await req.json()
      return NextResponse.json({ id: `pl-new-${Date.now()}`, team_id: b.team_id, name: b.name, number: b.number ?? null, position: b.position ?? null, status: 'active', yellow_cards: 0, red_cards: 0, goals: 0, created_at: new Date().toISOString() }, { status: 201 })
    }
    const b = await req.json()
    const rows = await sql`
      INSERT INTO players (team_id, name, number, position, photo_url)
      VALUES (${b.team_id}, ${b.name}, ${b.number || null}, ${b.position || null}, ${b.photo_url || null})
      RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
