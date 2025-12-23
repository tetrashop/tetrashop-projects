import db from './src/index.js';
console.log('Database module structure:');
console.log(Object.keys(db));
console.log('Has query function?', typeof db.query);
