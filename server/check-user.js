const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
});

async function checkUser() {
    try {
        await client.connect();
        console.log('Connected. Querying users...');
        const res = await client.query(`SELECT id, email, password FROM public.users`);
        console.log('Users found:', res.rows);

        // Also try specific query
        const specific = await client.query(`SELECT * FROM public.users WHERE email = 'youngmariano99@gmail.com'`);
        console.log('Specific query count:', specific.rowCount);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkUser();
