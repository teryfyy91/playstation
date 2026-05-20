import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6'; // This is usually a service key if they can run migrations, but if it's publishable it won't work for DDl
const supabase = createClient(supabaseUrl, supabaseKey);

async function tryAddColumn() {
    console.log("Trying to list rooms with a fake staff_id filter...");
    const { data, error } = await supabase.from('rooms').select('*').eq('staff_name', 'max');
    if (error && error.message.includes('column staff_name does not exist')) {
        console.log("Confirmed: staff_name column does not exist.");
    } else {
        console.log("Result:", data, "Error:", error);
    }
}
tryAddColumn();
