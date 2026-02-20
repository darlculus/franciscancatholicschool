const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'bursar123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nRun this SQL in Supabase:');
  console.log(`
UPDATE users 
SET password = '${hash}' 
WHERE username = 'bursar';
  `);
}

generateHash();
