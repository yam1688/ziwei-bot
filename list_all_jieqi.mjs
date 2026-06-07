import { Solar } from 'lunar-javascript';

// Test all 12 months across multiple years to get ALL jieqi names
const results = new Set();
// Scan through the year every 15 days
for (const y of [2024, 2025, 2026]) {
  for (let d = 0; d < 365; d += 15) {
    const solar = Solar.fromYmd(y, 1, 1).nextDay(d);
    const lunar = solar.getLunar();
    const prev = lunar.getPrevJieQi();
    if (prev) results.add(prev.getName());
  }
}
console.log('All unique JieQi from lunar-javascript:');
for (const n of [...results].sort()) {
  console.log(`  "${n}"`);
}
