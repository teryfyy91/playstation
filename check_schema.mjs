
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co'
const supabaseAnonKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
    const { data, error } = await supabase.from('history').select('*').limit(1)
    if (error) {
        console.error(error)
    } else {
        console.log(Object.keys(data[0] || {}))
    }
}

check()
