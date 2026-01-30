import fs from 'fs';
const apiKey = 'AIzaSyAu_oU789M8H5jDL4s_Wia833DFN4oezpM';
const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey;
const res = await fetch(url);
const data = await res.json();
fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
console.log('DONE');
