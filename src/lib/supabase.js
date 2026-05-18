import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co'
const supabaseAnonKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
