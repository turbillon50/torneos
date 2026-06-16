// Clerk se activa SOLO cuando hay llaves reales inyectadas.
// Con placeholders, la app corre en modo demo (gate local) para que
// el deploy y la PWA funcionen sin romperse.
const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''

export const clerkEnabled =
  pk.startsWith('pk_') && !pk.includes('placeholder')
