import * as mod from 'iching-shifa';
console.log('=== iching-shifa exports ===');
console.log(Object.keys(mod).join('\n'));

// Try methods
for (const k of Object.keys(mod)) {
  console.log(`\n--- ${k} ---`);
  if (typeof mod[k] === 'function') {
    try {
      const r = mod[k]();
      console.log(JSON.stringify(r).substring(0, 500));
    } catch(e) {
      console.log('Error:', e.message);
    }
  } else if (typeof mod[k] === 'object') {
    console.log(JSON.stringify(mod[k]).substring(0, 500));
  } else {
    console.log(String(mod[k]).substring(0, 500));
  }
}
