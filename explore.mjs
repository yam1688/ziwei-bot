import { Solar, Lunar, EightChar } from 'lunar-javascript';
import { astro } from 'iztro';

console.log('=== lunar-javascript exports ===');
import('lunar-javascript').then(m => {
  console.log(Object.keys(m).filter(k => !k.startsWith('_')).join('\n'));
});

console.log('\n=== iztro exports ===');
import('iztro').then(m => {
  console.log(Object.keys(m).filter(k => !k.startsWith('_')).join('\n'));
});

// Test EightChar (八字)
console.log('\n=== Test EightChar ===');
const solar = Solar.fromYmd(1990, 1, 1);
const lunar = solar.getLunar();
const eightChar = EightChar.fromLunar(lunar);
console.log('EightChar:', eightChar);
console.log('Year:', eightChar.getYear());
console.log('Month:', eightChar.getMonth());
console.log('Day:', eightChar.getDay());
console.log('Hour:', eightChar.getTime());

// Check methods
console.log('\nEightChar methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(eightChar)).join(', '));

// Lunar methods
console.log('\nLunar methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(lunar)).join(', '));
