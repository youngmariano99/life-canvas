const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
});

async function updatePassword() {
    try {
        await client.connect();
        const res = await client.query(`
            UPDATE public.users 
            SET password = '$2b$10$UCeVtyfgV7Rnn2sYAMHzz4CXRGeS8nsjko85dBD6pnd2Tm4gtH' 
            WHERE id = '29ef8642-b55f-4cab-ae38-a6d83dce29a9'
        `);
        console.log('Update success:', res.rowCount);
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        await client.end();
    }
}

updatePassword();
