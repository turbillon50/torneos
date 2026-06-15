import { neon, NeonQueryFunction } from '@neondatabase/serverless'

let _sql: NeonQueryFunction<false, false> | null = null

// true solo cuando hay una conexión Neon real configurada
export function hasDb(): boolean {
  const url = process.env.DATABASE_URL
  return !!url && !url.includes('placeholder')
}

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url || url.includes('placeholder')) {
      throw new Error('DATABASE_URL not set')
    }
    _sql = neon(url)
  }
  return _sql
}

// Tagged template literal proxy
const sql = new Proxy({} as NeonQueryFunction<false, false>, {
  get(_target, prop) {
    return (getSql() as any)[prop]
  },
  apply(_target, _thisArg, args) {
    return (getSql() as any)(...args)
  }
}) as unknown as (strings: TemplateStringsArray, ...values: any[]) => Promise<any[]>

export default sql
