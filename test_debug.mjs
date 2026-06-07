import { Solar } from 'lunar-javascript';

const solar = Solar.fromYmd(2026, 6, 7);
const lunar = solar.getLunar();

// Test NineStar toString behavior
console.log('=== NineStar toString tests ===');

const yn = lunar.getYearNineStar();
console.log('Year toString:', yn.toString());
console.log('Year toFullString:', yn.toFullString());
console.log('Year getNameInXuanKong:', yn.getNameInXuanKong());
console.log('Year getNumber:', yn.getNumber());

// Template literal test
const yearStr = `${lunar.getYearNineStar()}`;
console.log('Year via template:', JSON.stringify(yearStr));

const ms = lunar.getMonthNineStar();
console.log('\nMonth toString:', ms.toString());
console.log('Month getNameInXuanKong:', ms.getNameInXuanKong());
const monthStr = `${lunar.getMonthNineStar()}`;
console.log('Month via template:', JSON.stringify(monthStr));

const ds = lunar.getDayNineStar();
console.log('\nDay toString:', ds.toString());
console.log('Day getNameInXuanKong:', ds.getNameInXuanKong());
const dayStr = `${lunar.getDayNineStar()}`;
console.log('Day via template:', JSON.stringify(dayStr));

const ts = lunar.getTimeNineStar();
console.log('\nTime toString:', ts.toString());
console.log('Time getNameInXuanKong:', ts.getNameInXuanKong());
const timeStr = `${lunar.getTimeNineStar()}`;
console.log('Time via template:', JSON.stringify(timeStr));

// Check all JieQi table keys for underscores
console.log('\n=== JieQi table key check ===');
const jqTable = lunar.getJieQiTable();
if (jqTable) {
  const entries = Object.entries(jqTable);
  for (const [k, v] of entries.slice(0, 10)) {
    const hasUnderscore = k.includes('_');
    console.log(`  key="${k}" underscore=${hasUnderscore} value="${v}" toString="${v.toString()}" toYmd="${v.toYmd ? v.toYmd() : 'N/A'}"`);
  }
}

// Also test getDayJiShen for special chars
console.log('\n=== Special char check ===');
const checks = {
  getDayJiShen: lunar.getDayJiShen(),
  getDayXiongSha: lunar.getDayXiongSha(),
  getPengZuGan: lunar.getPengZuGan(),
  getPengZuZhi: lunar.getPengZuZhi(),
  getZhiXing: lunar.getZhiXing(),
  getLiuYao: lunar.getLiuYao(),
  getXiuSong: lunar.getXiuSong(),
  getDayYi: lunar.getDayYi(),
  getDayJi: lunar.getDayJi(),
};
for (const [name, val] of Object.entries(checks)) {
  const str = Array.isArray(val) ? val.join(',') : String(val);
  const hasUnderscore = str.includes('_');
  const hasAsterisk = str.includes('*');
  const hasBacktick = str.includes('`');
  if (hasUnderscore || hasAsterisk || hasBacktick) {
    console.log(`  ⚠️ ${name}: _=${hasUnderscore} *=${hasAsterisk} \`=${hasBacktick} value="${str.substring(0, 80)}"`);
  }
}
console.log('Done scanning - no special chars found means safe');
