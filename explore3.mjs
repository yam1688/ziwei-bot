import { Solar, Lunar, EightChar } from 'lunar-javascript';
import { iching } from 'iching-shifa';

console.log('=== iching-shifa exports ===');
console.log(Object.keys(iching).join('\n'));

// Test iching
const result = iching.divine();
console.log('\n=== Divination Result ===');
console.log(JSON.stringify(result, null, 2).substring(0, 3000));
