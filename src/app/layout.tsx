import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkEnabled } from '@/lib/auth'
import SWRegister from '@/components/SWRegister'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'S2 SPORT · Liga S2 Apertura 2026',
  description: 'Tu liga en vivo: tabla, partidos, equipos y goleadores.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'S2 SPORT',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = (
    <html lang="es" className={jakarta.variable}>
      <body>
        {children}
        <SWRegister />
      </body>
    </html>
  )

  // Clerk solo cuando hay llaves reales — si no, modo demo limpio.
  return clerkEnabled ? <ClerkProvider>{tree}</ClerkProvider> : tree
}
