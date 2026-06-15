import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS tournaments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, category TEXT NOT NULL, season TEXT NOT NULL, status TEXT DEFAULT 'active', start_date DATE, end_date DATE, created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS teams (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id UUID REFERENCES tournaments(id), name TEXT NOT NULL, shield_url TEXT, captain_clerk_id TEXT, captain_name TEXT, contact_phone TEXT, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS players (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), team_id UUID REFERENCES teams(id), name TEXT NOT NULL, number INTEGER, position TEXT, photo_url TEXT, status TEXT DEFAULT 'active', yellow_cards INTEGER DEFAULT 0, red_cards INTEGER DEFAULT 0, goals INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS referees (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, phone TEXT, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS matchdays (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id UUID REFERENCES tournaments(id), number INTEGER NOT NULL, date DATE, created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS matches (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), matchday_id UUID REFERENCES matchdays(id), tournament_id UUID REFERENCES tournaments(id), home_team_id UUID REFERENCES teams(id), away_team_id UUID REFERENCES teams(id), referee_id UUID REFERENCES referees(id), field TEXT, scheduled_at TIMESTAMPTZ, home_score INTEGER, away_score INTEGER, status TEXT DEFAULT 'scheduled', created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS goals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), match_id UUID REFERENCES matches(id), player_id UUID REFERENCES players(id), team_id UUID REFERENCES teams(id), minute INTEGER, type TEXT DEFAULT 'normal', created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS cards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), match_id UUID REFERENCES matches(id), player_id UUID REFERENCES players(id), team_id UUID REFERENCES teams(id), type TEXT NOT NULL, minute INTEGER, reason TEXT, suspension_matches INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS standings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id UUID REFERENCES tournaments(id), team_id UUID REFERENCES teams(id), played INTEGER DEFAULT 0, won INTEGER DEFAULT 0, drawn INTEGER DEFAULT 0, lost INTEGER DEFAULT 0, goals_for INTEGER DEFAULT 0, goals_against INTEGER DEFAULT 0, goal_difference INTEGER DEFAULT 0, points INTEGER DEFAULT 0, updated_at TIMESTAMPTZ DEFAULT now(), UNIQUE(tournament_id, team_id))`
    await sql`CREATE TABLE IF NOT EXISTS payments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), team_id UUID REFERENCES teams(id), type TEXT NOT NULL, amount DECIMAL(10,2) NOT NULL, currency TEXT DEFAULT 'MXN', status TEXT DEFAULT 'pending', due_date DATE, paid_at TIMESTAMPTZ, reference TEXT, notes TEXT, created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id UUID REFERENCES tournaments(id), title TEXT NOT NULL, body TEXT NOT NULL, type TEXT DEFAULT 'info', target TEXT DEFAULT 'all', created_at TIMESTAMPTZ DEFAULT now())`
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_standings_tournament ON standings(tournament_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id)`
    return NextResponse.json({ ok: true, message: 'Schema creado correctamente' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
