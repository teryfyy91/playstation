const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAdd() {
    console.log("Checking staff table for max...");
    let { data, error } = await supabase.from('staff').select('*').eq('name', 'max');
    if (error) console.error("Error fetching", error);

    if (data && data.length > 0) {
        console.log("User max already exists:", data);
    } else {
        console.log("User max not found, inserting...");
        const { error: insertError } = await supabase.from('staff').insert([
            { name: 'max', password: '123456', role: 'Admin', phone: '', email: 'max@gaimpoint.com', status: 'Ishda' }
        ]);
        if (insertError) {
            console.error("Insert error:", insertError.message || insertError);
        } else {
            console.log("Successfully inserted max into staff table.");
        }
    }
}
checkAndAdd();
