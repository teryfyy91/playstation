import { createClient } from '@supabase/supabase-js';
const s = createClient('https://yaiexxcjsixyjfqsrkyo.supabase.co', 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6');
async function run() {
    const res = await s.from('history').insert([{ staff_name: 'test', room_id: '1', date: '2026-05-20', total_price: 0 }]).select();
    console.log(JSON.stringify(res));
    process.exit(0);
}
run();
