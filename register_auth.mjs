import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function registerInAuth() {
    // Javohir
    console.log("Registering Javohir in Auth...");
    const { error: err1 } = await supabase.auth.signUp({
        email: 'javohir_admin@gmail.com',
        password: '1234567890',
    });
    if (err1) console.error("Javohir Auth Error:", err1.message);
    else console.log("Javohir registered in Auth!");

    // Max
    console.log("Registering Max in Auth...");
    const { error: err2 } = await supabase.auth.signUp({
        email: 'max_admin@gmail.com',
        password: '123456',
    });
    if (err2) console.error("Max Auth Error:", err2.message);
    else console.log("Max registered in Auth!");
}
registerInAuth();
