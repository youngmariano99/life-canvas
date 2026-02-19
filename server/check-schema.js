const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
});

async function checkSchema() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'password';
        `);
        console.log('Password Column Schema:', res.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkSchema();
