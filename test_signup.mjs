import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSign() {
    const { data, error } = await supabase.auth.signUp({
        email: 'testuser123@example.com',
        password: 'password123'
    });
    console.log(data, error);
}
testSign();
