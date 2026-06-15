import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tid = searchParams.get('tournament_id')
    const rows = tid
      ? await sql`
          SELECT s.*, t.name as team_name, t.shield_url as team_shield
          FROM standings s JOIN teams t ON s.team_id = t.id
          WHERE s.tournament_id = ${tid}
          ORDER BY s.points DESC, s.goal_difference DESC, s.goals_for DESC`
      : await sql`
          SELECT s.*, t.name as team_name, t.shield_url as team_shield
          FROM standings s JOIN teams t ON s.team_id = t.id
          ORDER BY s.points DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
