import Link from 'next/link'
import { IconBack } from '@/components/Icons'

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, background: '#CCFF00', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 22, color: '#000', margin: '0 auto 16px' }}>S2</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>S2 Sport Torneos</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>Próximamente: acceso con cuenta</div>
        <Link href="/" style={{ padding: '12px 24px', background: '#CCFF00', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><IconBack size={14} />Volver al inicio</Link>
      </div>
    </div>
  )
}
