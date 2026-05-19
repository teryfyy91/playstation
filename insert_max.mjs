import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAdd() {
    console.log("Checking staff table for max...");
    let { data, error } = await supabase.from('staff').select('*').eq('name', 'max');
    if (error) console.error("Error fetching", error);

    if (data && data.length > 0) {
        console.log("User max already exists:", data);

        // Let's also check if the password is correct or if we should update it
        if (data[0].password !== '123456') {
            console.log("Updating password to 123456...");
            await supabase.from('staff').update({ password: '123456' }).eq('name', 'max');
            console.log("Password updated.");
        }
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

    // Also let's try to add it as a Supabase Auth user just in case they revert my previous change
    console.log("Checking if user exists in Supabase Auth...");
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'max@gaimpoint.com',
        password: '123456',
    });
    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log("User max@gaimpoint.com already registered in Supabase Auth.");
        } else {
            console.error("Auth Register error:", authError.message);
        }
    } else {
        console.log("Successfully registered max@gaimpoint.com in Supabase Auth.");
    }
}
checkAndAdd();
