const bcrypt = require('bcrypt');

async function test() {
    const pass = '123456789';
    const hash = '$2b$10$UCeVtyfgV7Rnn2sYAMHzz4CXRGeS8nsjko85dBD6pnd2Tm4gtH';

    console.log('Pass:', pass);
    console.log('Hash:', hash);

    // Check length
    console.log('Hash length:', hash.length); // Should be 60

    const isMatch = await bcrypt.compare(pass, hash);
    console.log('Match result:', isMatch);
}

test();
