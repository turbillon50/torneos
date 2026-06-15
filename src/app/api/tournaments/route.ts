import { NextResponse } from 'next/server'
import sql, { hasDb } from '@/lib/db'
import { getTournaments } from '@/lib/mock'

export async function GET() {
  try {
    if (!hasDb()) return NextResponse.json(getTournaments())
    const rows = await sql`SELECT * FROM tournaments ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO tournaments (name, category, season, status, start_date, end_date)
      VALUES (${b.name}, ${b.category}, ${b.season}, ${b.status || 'upcoming'}, ${b.start_date || null}, ${b.end_date || null})
      RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
