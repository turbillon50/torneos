'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/capitan', label: '🏠 Inicio' },
  { href: '/capitan/plantilla', label: '👕 Plantilla' },
  { href: '/capitan/pagos', label: '💳 Pagos' },
  { href: '/capitan/sanciones', label: '🟨 Sanciones' },
]

export default function CapitanNav() {
  const pathname = usePathname()
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1a1a1a', padding: '0 16px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', height: 56, gap: 4 }}>
        <div style={{ width: 28, height: 28, background: '#CCFF00', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000', marginRight: 12 }}>🦺</div>
        <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
          {nav.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
              color: pathname === item.href ? '#000' : '#888',
              background: pathname === item.href ? '#CCFF00' : 'transparent',
            }}>{item.label}</Link>
          ))}
        </div>
        <Link href="/" style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>← Salir</Link>
      </div>
    </nav>
  )
}
