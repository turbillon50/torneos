export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

export function formatScore(home?: number, away?: number) {
  if (home === null || home === undefined) return 'vs'
  return `${home} - ${away}`
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    active: '#CCFF00', live: '#CCFF00', paid: '#CCFF00', active_tournament: '#CCFF00',
    finished: '#888888', overdue: '#FF4444', suspended: '#FF4444',
    pending: '#FFAA00', scheduled: '#888888', postponed: '#FFAA00',
  }
  return map[status] || '#888888'
}

export function getCardColor(type: string) {
  if (type === 'yellow' || type === 'double_yellow') return '#FFD700'
  return '#FF0000'
}
