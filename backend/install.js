const { execSync } = require('child_process');
try {
  console.log('Running npm install...');
  execSync('"C:\\Program Files\\nodejs\\npm.cmd" install', { stdio: 'inherit' });
  console.log('Running prisma generate...');
  execSync('"C:\\Program Files\\nodejs\\npx.cmd" prisma generate', { stdio: 'inherit' });
  console.log('Done.');
} catch (e) {
  console.error(e.message);
}
