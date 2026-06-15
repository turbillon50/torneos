import { NextResponse } from 'next/server'
import sql, { hasDb } from '@/lib/db'
import { getCards } from '@/lib/mock'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const playerId = searchParams.get('player_id')
    const teamId = searchParams.get('team_id')
    if (!hasDb()) return NextResponse.json(getCards({ playerId, teamId }))
    let rows
    if (playerId) {
      rows = await sql`SELECT c.*, p.name as player_name, t.name as team_name FROM cards c LEFT JOIN players p ON c.player_id = p.id LEFT JOIN teams t ON c.team_id = t.id WHERE c.player_id = ${playerId} ORDER BY c.created_at DESC`
    } else if (teamId) {
      rows = await sql`SELECT c.*, p.name as player_name, t.name as team_name FROM cards c LEFT JOIN players p ON c.player_id = p.id LEFT JOIN teams t ON c.team_id = t.id WHERE c.team_id = ${teamId} ORDER BY c.created_at DESC`
    } else {
      rows = await sql`SELECT c.*, p.name as player_name, t.name as team_name FROM cards c LEFT JOIN players p ON c.player_id = p.id LEFT JOIN teams t ON c.team_id = t.id ORDER BY c.created_at DESC LIMIT 100`
    }
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO cards (match_id, player_id, team_id, type, minute, reason, suspension_matches)
      VALUES (${b.match_id}, ${b.player_id}, ${b.team_id}, ${b.type},
              ${b.minute || null}, ${b.reason || null}, ${b.suspension_matches || 0})
      RETURNING *`
    if (b.type === 'yellow' || b.type === 'double_yellow') {
      await sql`UPDATE players SET yellow_cards = yellow_cards + 1 WHERE id = ${b.player_id}`
    }
    if (b.type === 'red' || b.type === 'double_yellow') {
      await sql`UPDATE players SET red_cards = red_cards + 1 WHERE id = ${b.player_id}`
    }
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
