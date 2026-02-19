const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
    connectionString: "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
});

async function verifyCycle() {
    try {
        await client.connect();

        const passwordPlain = '123456789';
        console.log('1. Generating hash for:', passwordPlain);

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(passwordPlain, salt);
        console.log('2. Generated hash:', hash);

        console.log('3. Immediate verification:', await bcrypt.compare(passwordPlain, hash));

        console.log('4. Updating DB...');
        await client.query(`
            UPDATE public.users 
            SET password = $1
            WHERE email = 'youngmariano99@gmail.com'
        `, [hash]);

        console.log('5. Reading back from DB...');
        const res = await client.query(`SELECT password FROM public.users WHERE email = 'youngmariano99@gmail.com'`);
        const dbHash = res.rows[0].password;

        console.log('6. Hash from DB:', dbHash);
        console.log('7. Compare plain vs DB hash:', await bcrypt.compare(passwordPlain, dbHash));

        console.log('8. Compare original hash vs DB hash (should be identical):', hash === dbHash);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

verifyCycle();
