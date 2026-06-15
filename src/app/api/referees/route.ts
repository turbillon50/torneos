import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM referees ORDER BY name ASC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const rows = await sql`
      INSERT INTO referees (name, phone) VALUES (${b.name}, ${b.phone || null}) RETURNING *`
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
