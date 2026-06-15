// Iconos SVG inline propios — sin dependencias externas, sin emojis.
// Uso: <IconBall size={20} />  (hereda color con currentColor salvo tarjetas)
type P = { size?: number }
const base = (size: number) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
})

export const IconUsers = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
export const IconUser = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
export const IconBall = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
)
export const IconCalendar = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
export const IconClock = ({ size = 18 }: P) => (
  <svg {...base(size)}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
)
export const IconPin = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
export const IconPhone = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
export const IconHome = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
export const IconTrophy = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
)
export const IconJersey = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M8 2 5 4 2 7l3 3 1-1v11h12V9l1 1 3-3-3-3-3-2a4 4 0 0 1-8 0z" />
  </svg>
)
export const IconWallet = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="17.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)
export const IconBell = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
export const IconWhistle = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M4 11a5 5 0 0 0 5 5h2l5 4v-9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 4z" />
    <line x1="14" y1="4" x2="14" y2="2" /><line x1="18" y1="5" x2="20" y2="4" />
  </svg>
)
export const IconBack = ({ size = 18 }: P) => (
  <svg {...base(size)}><polyline points="15 18 9 12 15 6" /></svg>
)
export const IconChevronRight = ({ size = 18 }: P) => (
  <svg {...base(size)}><polyline points="9 18 15 12 9 6" /></svg>
)
export const IconWarning = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
export const IconBan = ({ size = 18 }: P) => (
  <svg {...base(size)}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
)
export const IconCheck = ({ size = 18 }: P) => (
  <svg {...base(size)}><polyline points="20 6 9 17 4 12" /></svg>
)
export const IconX = ({ size = 18 }: P) => (
  <svg {...base(size)}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)
export const IconStadium = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <ellipse cx="12" cy="9" rx="9" ry="4" /><path d="M3 9v6c0 2.2 4 4 9 4s9-1.8 9-4V9" /><path d="M12 13v6" />
  </svg>
)
export const IconShieldCheck = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
)

// --- Tarjetas (color fijo, no heredan currentColor) ---
export const IconCardYellow = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="amarilla">
    <rect x="6" y="3" width="12" height="18" rx="2" fill="#FFD700" />
  </svg>
)
export const IconCardRed = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="roja">
    <rect x="6" y="3" width="12" height="18" rx="2" fill="#FF4444" />
  </svg>
)
export const IconCardGreen = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="limpio">
    <rect x="6" y="3" width="12" height="18" rx="2" fill="#CCFF00" />
  </svg>
)
export const IconDoubleCard = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 28 24" aria-label="doble amarilla">
    <rect x="3" y="3" width="11" height="18" rx="2" fill="#FFD700" />
    <rect x="13" y="3" width="11" height="18" rx="2" fill="#FF4444" />
  </svg>
)
