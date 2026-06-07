// Test: generate the full /today output and check for Markdown-breaking chars
import { Solar } from 'lunar-javascript';

const now = new Date();
const hk = new Date(now.getTime() + 8*3600000);
const y = hk.getUTCFullYear(), m = hk.getUTCMonth()+1, d = hk.getUTCDate();

const solar = Solar.fromYmd(y, m, d);
const lunar = solar.getLunar();

let r = `📅 **黄历** ${y}年${m}月${d}日\n━━━━━━━━━━━━━━\n`;
r += `农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}\n`;
r += `生肖：${lunar.getYearShengXiao()}  年柱：${lunar.getYearInGanZhi()}\n`;
r += `月柱：${lunar.getMonthInGanZhiExact()}  日柱：${lunar.getDayInGanZhiExact()}\n\n`;

const jq = lunar.getCurrentJieQi();
if (jq) r += `🌿 节气：${jq}\n`;
const jqTable = lunar.getJieQiTable();
if (jqTable) {
  const entries = Object.entries(jqTable);
  r += `  近节气：${entries.slice(0,4).map(([k,v])=>`${k}${v}`).join('、')}\n`;
}
r += '\n';

r += `⭐ **三元九运**\n`;
try {
  const yn = lunar.getYearNineStar();
  // Check if getName exists or if it's getNameInXuanKong
  console.log('NineStar methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(yn)).join(', '));
  r += `  年九星：${yn.getNameInXuanKong()}（${yn.getColor()} ${yn.getWuXing()}）\n`;
} catch(e) { console.log('YearNineStar error:', e.message); }
try { 
  const ms = lunar.getMonthNineStar();
  r += `  月九星：${ms.getNameInXuanKong ? ms.getNameInXuanKong() : ms}\n`; 
} catch(e){ console.log('MonthNineStar:', e.message); }
try { 
  const ds = lunar.getDayNineStar();
  r += `  日九星：${ds.getNameInXuanKong ? ds.getNameInXuanKong() : ds}\n`; 
} catch(e){}
try { 
  const ts = lunar.getTimeNineStar();
  r += `  时九星：${ts.getNameInXuanKong ? ts.getNameInXuanKong() : ts}\n`; 
} catch(e){}
r += '\n';

r += `🌌 **二十八宿**\n`;
r += `  值宿：${lunar.getXiu()}（${lunar.getXiuLuck()}）\n`;
r += `  歌诀：${lunar.getXiuSong()}\n\n`;

r += `✅ **宜**\n`;
const yi = lunar.getDayYi();
r += `  ${Array.isArray(yi) ? yi.join('、') : yi||'无'}\n`;
r += `❌ **忌**\n`;
const ji = lunar.getDayJi();
r += `  ${Array.isArray(ji) ? ji.join('、') : ji||'无'}\n\n`;

r += `🙏 **吉神**\n  ${lunar.getDayJiShen()||'无'}\n`;
r += `👹 **凶煞**\n  ${lunar.getDayXiongSha()||'无'}\n\n`;

r += `📖 **彭祖百忌**\n`;
r += `  ${lunar.getPengZuGan()||''}\n`;
r += `  ${lunar.getPengZuZhi()||''}\n\n`;

r += `🔀 **冲煞**\n`;
r += `  冲：${lunar.getDayChong()}（${lunar.getDayChongShengXiao()}）\n`;
r += `  煞：${lunar.getDaySha()}\n\n`;

r += `🌙 **月相**：${lunar.getYueXiang()||''}\n`;
r += `🌟 **值星**：${lunar.getZhiXing()||''}\n`;
try { r += `☯ **六爻**：${lunar.getLiuYao()||''}\n`; } catch(e){}

// Now scan for Markdown-breaking characters
console.log('\n=== Scanning for Markdown issues ===');
for (let i = 0; i < r.length; i++) {
  const ch = r[i];
  // Check for underscore (italic in Telegram Markdown)
  if (ch === '_') {
    console.log(`  BUG: underscore at char ${i} (byte ~${estimateByteOffset(r, i)}): ...${r.substring(Math.max(0,i-10), i+10)}...`);
  }
  // Check for unclosed **
}
console.log('\n=== Full output ===');
console.log(r);
console.log('\n=== Output length ===');
console.log('Chars:', r.length);
console.log('Bytes:', Buffer.byteLength(r, 'utf-8'));

function estimateByteOffset(str, charIdx) {
  return Buffer.byteLength(str.substring(0, charIdx), 'utf-8');
}
