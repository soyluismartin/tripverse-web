import { createClient } from '@supabase/supabase-js'
import { getCloudflareContext } from '@opennextjs/cloudflare'

type SupabasePublicBinding = {
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
}

function resolveSupabaseUrlAndAnon(): { url: string; key: string } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  try {
    const { env } = getCloudflareContext({ async: false })
    const cf = env as SupabasePublicBinding
    if (!url) url = cf.NEXT_PUBLIC_SUPABASE_URL?.trim()
    if (!key) key = cf.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  } catch {
    // Fuera del Worker de Cloudflare (build estático, scripts locales sin Wrangler proxy).
  }

  return { url: url ?? '', key: key ?? '' }
}

export function createServerClient() {
  const { url, key } = resolveSupabaseUrlAndAnon()

  if (!url || !key) {
    console.error(
      '[supabase/server] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY tras fusionar process.env y env del Worker.',
      { hasUrl: Boolean(url), hasKey: Boolean(key) },
    )
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY (Pages build env + wrangler [vars]).',
    )
  }

  return createClient(url, key)
}
