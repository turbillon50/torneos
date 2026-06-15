import { NextResponse } from 'next/server'
import sql, { hasDb } from '@/lib/db'
import { getPayments } from '@/lib/mock'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
    if (!hasDb()) return NextResponse.json(getPayments(teamId))
    const rows = teamId
      ? await sql`SELECT p.*, t.name as team_name FROM payments p LEFT JOIN teams t ON p.team_id = t.id WHERE p.team_id = ${teamId} ORDER BY p.created_at DESC`
      : await sql`SELECT p.*, t.name as team_name FROM payments p LEFT JOIN teams t ON p.team_id = t.id ORDER BY p.status ASC, p.due_date ASC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO payments (team_id, type, amount, currency, status, due_date, reference, notes)
      VALUES (${b.team_id}, ${b.type}, ${b.amount}, ${b.currency || 'MXN'},
              ${b.status || 'pending'}, ${b.due_date || null}, ${b.reference || null}, ${b.notes || null})
      RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
