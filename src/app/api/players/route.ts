import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
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
