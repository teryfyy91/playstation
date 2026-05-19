import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaiexxcjsixyjfqsrkyo.supabase.co';
const supabaseKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const form = { username: 'max', password: '123456' };
    const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .or(`name.eq.${form.username},email.eq.${form.username}`)
        .eq('password', form.password)
        .single();

    console.log('data:', staffData);
    console.log('error:', error);
}
test();
