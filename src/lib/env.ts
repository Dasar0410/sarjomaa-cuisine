function viteEnv(key: string): string | undefined {
  try {
    return (import.meta as { env?: Record<string, string | undefined> })?.env?.[key]
  } catch {
    return undefined
  }
}

const nextPublicEnv: Record<string, string | undefined> = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_ADMIN_USER_ID: process.env.NEXT_PUBLIC_ADMIN_USER_ID,
  NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
}

export function getEnv(viteKey: string, nextKey: string): string | undefined {
  return nextPublicEnv[nextKey] ?? viteEnv(viteKey)
}
