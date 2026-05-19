const url = 'https://yaiexxcjsixyjfqsrkyo.supabase.co/auth/v1/signup';
const apiKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';

async function signupUser() {
    try {
        console.log('Signing up user max@gmail.com...');
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'max@gmail.com',
                password: '123456'
            })
        });
        const data = await result.json();
        console.log('Signup result:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

signupUser();
