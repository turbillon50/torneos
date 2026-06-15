'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconJersey, IconWallet, IconCardYellow, IconWhistle, IconBack } from '@/components/Icons'

const nav = [
  { href: '/capitan',           label: 'Inicio',    Icon: IconHome },
  { href: '/capitan/plantilla', label: 'Plantilla', Icon: IconJersey },
  { href: '/capitan/pagos',     label: 'Pagos',     Icon: IconWallet },
  { href: '/capitan/sanciones', label: 'Sanciones', Icon: IconCardYellow },
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <span style={{ color: '#000', display: 'flex', alignItems: 'center' }}>
            <IconWhistle size={16} />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
          {nav.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
              color: pathname === item.href ? '#000' : '#888',
              background: pathname === item.href ? '#CCFF00' : 'transparent',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <item.Icon size={15} />
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/" style={{ fontSize: 11, color: '#555', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IconBack size={12} />
          Salir
        </Link>
      </div>
    </nav>
  )
}
