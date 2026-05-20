import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStaff() {
    const { data, error } = await supabase.from('staff').select('*');
    if (error) console.error(error);
    else console.log("Staff in Table:", data.map(s => s.name));
}
checkStaff();
