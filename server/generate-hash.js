const bcrypt = require('bcrypt');

async function generateHash() {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash('123456789', salt);
    console.log('HASH:', hash);
}

generateHash();
