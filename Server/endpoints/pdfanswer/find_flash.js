import fs from 'fs';
const data = JSON.parse(fs.readFileSync('models.json', 'utf8'));
const names = data.models.filter(m => m.name.includes('flash')).map(m => m.name);
fs.writeFileSync('flash_models.txt', names.join('\n'));
console.log('DONE');
