import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const sk = process.env.CLERK_SECRET_KEY || ''
const clerkEnabled = sk.startsWith('sk_') && !sk.includes('placeholder')

const isProtected = createRouteMatcher(['/capitan(.*)', '/admin(.*)'])

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect()
})

// Con llaves reales → Clerk protege /capitan y /admin.
// Con placeholders (demo) → passthrough, el gate local hace el resto.
export default clerkEnabled ? clerk : () => NextResponse.next()

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}
