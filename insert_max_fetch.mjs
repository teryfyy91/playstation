const url = 'https://yaiexxcjsixyjfqsrkyo.supabase.co/rest/v1/staff';
const apiKey = 'sb_publishable_XYMW0ICCJgY_gxrA0g0WEA_RVaXGVY6';

async function main() {
    try {
        const checkRes = await fetch(url + '?name=eq.max', {
            headers: {
                'apikey': apiKey,
                'Authorization': 'Bearer ' + apiKey
            }
        });
        const checkData = await checkRes.json();

        if (checkData && checkData.length > 0) {
            console.log('User max already exists:', checkData[0]);
        } else {
            console.log('Inserting user max...');
            const insertRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Authorization': 'Bearer ' + apiKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    name: 'max',
                    password: '123456',
                    role: 'Admin', // Or Operator
                    phone: '',
                    email: 'max@gaimpoint.com',
                    status: 'Ishda'
                })
            });
            const resText = await insertRes.text();
            console.log('Insert result:', resText);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
