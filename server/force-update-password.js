const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
    connectionString: "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
});

async function updatePassword() {
    try {
        await client.connect();

        const salt = await bcrypt.genSalt(10);
        // Using "123456789" explicitly
        const hash = await bcrypt.hash('123456789', salt);

        console.log('Generated NEW Hash:', hash);

        const res = await client.query(`
            UPDATE public.users 
            SET password = $1
            WHERE email = 'youngmariano99@gmail.com'
        `, [hash]);

        console.log('Update success:', res.rowCount);
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        await client.end();
    }
}

updatePassword();
