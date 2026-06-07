import { Solar, EightChar } from 'lunar-javascript';
import { getCurrentSolarTerm } from 'iching-shifa';

// 1. Check EightChar with hour + gender
console.log('=== EightChar gender/hour test ===');
const solar = Solar.fromYmdHms(1990, 1, 1, 5, 0, 0); // 5am = 寅时 (branch 2)
const lunar = solar.getLunar();
console.log('Lunar time:', lunar.getHour(), 'hour:', lunar.getTimeZhi());
const ec = EightChar.fromLunar(lunar);
console.log('BaZi:', ec.toString());
console.log('Time pillar:', ec.getTime());

const yun = ec.getYun();
console.log('Yun gender:', yun.getGender());
console.log('StartYear:', yun.getStartYear());

// 2. Check EightChar with different gender
// Actually check if EightChar has any static methods for gender
console.log('\nEightChar static keys:', Object.getOwnPropertyNames(EightChar));

// 3. Check getCurrentSolarTerm
console.log('\ngetCurrentSolarTerm:', JSON.stringify(getCurrentSolarTerm()));

// 4. Test jieQi table with prev/next
const solar2 = Solar.fromYmd(2026, 6, 7);
const lunar2 = solar2.getLunar();
console.log('\nCurrent JieQi:', lunar2.getCurrentJieQi());
console.log('Prev JieQi:', lunar2.getPrevJieQi ? lunar2.getPrevJieQi() : 'no method');
console.log('Next JieQi:', lunar2.getNextJieQi ? lunar2.getNextJieQi() : 'no method');
console.log('Current Jie:', lunar2.getCurrentJie ? lunar2.getCurrentJie() : 'no method');
console.log('Current Qi:', lunar2.getCurrentQi ? lunar2.getCurrentQi() : 'no method');
