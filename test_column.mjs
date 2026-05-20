import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addStaffName() {
    console.log("Trying to insert a room with staff_name...");
    const { error } = await supabase.from('rooms').insert([{ name: 'Test Isolation', price: 0, staff_name: 'test' }]);
    if (error) {
        console.log("Error (expected if column missing):", error.message);
    } else {
        console.log("SUCCESS! staff_name column exists or was added!");
    }
}
addStaffName();
