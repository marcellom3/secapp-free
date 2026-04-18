import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client para uso no browser (RLS ativo)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Client para uso no servidor (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
