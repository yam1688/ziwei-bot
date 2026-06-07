import { Solar } from 'lunar-javascript';

// Find all unique jieQi names used by lunar-javascript
const results = new Set();
for (const y of [2023, 2024, 2025, 2026]) {
  for (const m of [1, 3, 5, 7, 9, 11]) {
    const solar = Solar.fromYmd(y, m, 15);
    const lunar = solar.getLunar();
    const prev = lunar.getPrevJieQi();
    if (prev) results.add(prev.getName());
    const next = lunar.getNextJieQi();
    if (next) results.add(next.getName());
  }
}
console.log('All JieQi names:');
for (const name of [...results].sort()) {
  console.log(`  "${name}"`);
}
