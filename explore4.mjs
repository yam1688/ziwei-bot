import mod from 'iching-shifa';

console.log('=== iching-shifa exports ===');
console.log(Object.keys(mod).join('\n'));

// Try calling
if (typeof mod.divine === 'function') {
  const result = mod.divine();
  console.log('\n=== Divination Result ===');
  console.log(JSON.stringify(result, null, 2).substring(0, 3000));
}
