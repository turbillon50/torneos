import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tid = searchParams.get('tournament_id')
    const rows = tid
      ? await sql`SELECT * FROM notifications WHERE tournament_id = ${tid} ORDER BY created_at DESC LIMIT 20`
      : await sql`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO notifications (tournament_id, title, body, type, target)
      VALUES (${b.tournament_id}, ${b.title}, ${b.body}, ${b.type || 'info'}, ${b.target || 'all'})
      RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
