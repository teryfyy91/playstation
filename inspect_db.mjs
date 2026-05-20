import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
    const { data: rooms, error: err1 } = await supabase.from('rooms').select('*').limit(1);
    console.log("Rooms columns:", rooms ? Object.keys(rooms[0] || {}) : "No data");

    const { data: history, error: err2 } = await supabase.from('history').select('*').limit(1);
    console.log("History columns:", history ? Object.keys(history[0] || {}) : "No data");
}
inspectTables();
