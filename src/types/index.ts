export interface Tournament {
  id: string; name: string; category: string; season: string
  status: 'active' | 'finished' | 'upcoming'
  start_date?: string; end_date?: string; created_at: string
}
export interface Team {
  id: string; tournament_id: string; name: string
  shield_url?: string; captain_clerk_id?: string
  captain_name?: string; contact_phone?: string
  status: 'active' | 'suspended' | 'withdrawn'; created_at: string
}
export interface Player {
  id: string; team_id: string; name: string; number?: number
  position?: string; photo_url?: string
  status: 'active' | 'suspended' | 'injured'
  yellow_cards: number; red_cards: number; goals: number; created_at: string
}
export interface Match {
  id: string; matchday_id: string; tournament_id: string
  home_team_id: string; away_team_id: string; referee_id?: string
  field?: string; scheduled_at?: string
  home_score?: number; away_score?: number
  status: 'scheduled' | 'live' | 'finished' | 'postponed'
  home_team_name?: string; away_team_name?: string
  home_team_shield?: string; away_team_shield?: string
  referee_name?: string; matchday_number?: number; created_at: string
}
export interface Standing {
  id: string; tournament_id: string; team_id: string
  team_name?: string; team_shield?: string
  played: number; won: number; drawn: number; lost: number
  goals_for: number; goals_against: number
  goal_difference: number; points: number
}
export interface Payment {
  id: string; team_id: string; team_name?: string
  type: 'inscription' | 'arbitration' | 'penalty'
  amount: number; currency: string
  status: 'pending' | 'paid' | 'overdue'
  due_date?: string; paid_at?: string
  reference?: string; notes?: string; created_at: string
}
export interface Card {
  id: string; match_id: string; player_id: string; team_id: string
  player_name?: string; team_name?: string
  type: 'yellow' | 'red' | 'double_yellow'
  minute?: number; reason?: string; suspension_matches: number; created_at: string
}
export interface Referee {
  id: string; name: string; phone?: string
  status: 'active' | 'inactive'; created_at: string
}
export interface Notification {
  id: string; tournament_id: string; title: string; body: string
  type: 'info' | 'warning' | 'result' | 'schedule'
  target: 'all' | 'captains' | 'players'; created_at: string
}
