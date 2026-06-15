import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: '#CCFF00', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#000', margin: '0 auto 12px' }}>S2</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>S2 Sport Torneos</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Crea tu cuenta gratuita</div>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
