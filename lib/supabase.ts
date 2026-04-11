// lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side (anon key — usado no GateModal)
export const supabase = createClient(supabaseUrl, supabaseAnon)

// Server-side helper — fetching data nas Server Components
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnon, {
    auth: { persistSession: false },
  })
}
