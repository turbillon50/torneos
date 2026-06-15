import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tid = searchParams.get('tournament_id')
    const rows = tid
      ? await sql`SELECT * FROM teams WHERE tournament_id = ${tid} ORDER BY name`
      : await sql`SELECT * FROM teams ORDER BY name`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO teams (tournament_id, name, shield_url, captain_clerk_id, captain_name, contact_phone)
      VALUES (${b.tournament_id}, ${b.name}, ${b.shield_url || null}, ${b.captain_clerk_id || null},
              ${b.captain_name || null}, ${b.contact_phone || null})
      RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
