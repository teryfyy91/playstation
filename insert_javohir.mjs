import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addJavohir() {
    const username = 'Javohir';
    const password = '1234567890';
    const email = 'javohir@gaimpoint.com';

    console.log(`Checking staff table for ${username}...`);
    let { data, error } = await supabase.from('staff').select('*').eq('name', username);
    if (error) {
        console.error("Error fetching:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log(`User ${username} already exists. Updating password...`);
        const { error: updateError } = await supabase
            .from('staff')
            .update({ password: password, role: 'Admin' })
            .eq('name', username);

        if (updateError) {
            console.error("Update error:", updateError);
        } else {
            console.log("Password and role updated successfully.");
        }
    } else {
        console.log(`User ${username} not found, inserting...`);
        const { error: insertError } = await supabase.from('staff').insert([
            {
                name: username,
                password: password,
                role: 'Admin',
                email: email,
                status: 'Ishda',
                phone: ''
            }
        ]);

        if (insertError) {
            console.error("Insert error:", insertError.message || insertError);
        } else {
            console.log(`Successfully inserted ${username} into staff table.`);
        }
    }

    // Also register in Auth if needed (optional but good for future auth implementations)
    console.log(`Attempting to register ${email} in Supabase Auth...`);
    const { error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log(`Email ${email} is already registered in Supabase Auth.`);
        } else {
            console.error("Auth Register error:", authError.message);
        }
    } else {
        console.log(`Successfully registered ${email} in Supabase Auth.`);
    }
}

addJavohir();
