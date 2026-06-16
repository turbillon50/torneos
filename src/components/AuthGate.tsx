'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser, RedirectToSignIn } from '@clerk/nextjs'
import { clerkEnabled } from '@/lib/auth'
import { IconShield, IconLock } from '@/components/Icons'

function DemoGate({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  if (open) return <>{children}</>

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--sp-3)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#ffffff',
          color: '#111111',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-3)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--r-md)',
            background: 'var(--neon)',
            color: '#000',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--sp-2)',
          }}
        >
          <IconShield width={30} height={30} />
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>{title}</h1>
        <p style={{ margin: '6px 0 var(--sp-3)', fontSize: 13.5, color: '#555' }}>{subtitle}</p>

        <label style={{ display: 'block', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#444', marginBottom: 6 }}>
          Correo
        </label>
        <input
          defaultValue="capitan@ligas2.mx"
          style={inputStyle}
          readOnly
        />
        <label style={{ display: 'block', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#444', margin: '12px 0 6px' }}>
          Contraseña
        </label>
        <input type="password" defaultValue="demo1234" style={inputStyle} readOnly />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          style={{
            width: '100%',
            marginTop: 'var(--sp-3)',
            padding: '13px',
            border: 'none',
            borderRadius: 'var(--r-md)',
            background: 'var(--neon)',
            color: '#000',
            fontWeight: 800,
            fontSize: 15,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <IconLock width={18} height={18} /> Entrar
        </motion.button>
        <p style={{ marginTop: 14, fontSize: 11, color: '#999' }}>Acceso demo · sesión protegida</p>
      </motion.div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e3e3e3',
  borderRadius: 'var(--r-md)',
  fontSize: 14,
  color: '#111',
  background: '#fafafa',
  outline: 'none',
}

function ClerkGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()
  if (!isLoaded) return null
  if (!isSignedIn) return <RedirectToSignIn />
  return <>{children}</>
}

export default function AuthGate({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  // clerkEnabled es constante de build → cada rama monta un componente
  // distinto, así que los hooks de Clerk nunca se llaman en modo demo.
  if (clerkEnabled) return <ClerkGate>{children}</ClerkGate>
  return (
    <DemoGate title={title} subtitle={subtitle}>
      {children}
    </DemoGate>
  )
}
