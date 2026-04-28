import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getCloudflareContext } from '@opennextjs/cloudflare'

type SupabasePublicBinding = {
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
}

/**
 * Usa `async: true` para no depender del contexto síncrono del Worker (evita fallos cuando
 * `getCloudflareContext({ async: false })` no está montado en el global del request).
 */
async function resolveSupabaseUrlAndAnon(): Promise<{ url: string; key: string }> {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  try {
    const { env } = await getCloudflareContext({ async: true })
    const cf = env as SupabasePublicBinding
    if (!url) url = cf.NEXT_PUBLIC_SUPABASE_URL?.trim()
    if (!key) key = cf.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  } catch {
    // Build, `next dev` sin Wrangler proxy, o fuera de Cloudflare — queda process.env / .env.local.
  }

  return { url: url ?? '', key: key ?? '' }
}

/** `null` si faltan credenciales (no lanzar para no tumbar SSR de listados). */
export async function createServerClient(): Promise<SupabaseClient | null> {
  const { url, key } = await resolveSupabaseUrlAndAnon()

  if (!url || !key) {
    console.error(
      '[supabase/server] Sin credenciales Supabase tras fusionar process.env y Worker env.',
      { hasUrl: Boolean(url), hasKey: Boolean(key) },
    )
    return null
  }

  return createClient(url, key)
}
