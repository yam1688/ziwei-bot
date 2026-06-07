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

// 节气 - 修复版
const curJq = lunar.getCurrentJieQi();
if (curJq) r += `🌿 当前节气：${curJq}\n`;
const prevJq = lunar.getPrevJieQi();
const nextJq = lunar.getNextJieQi();
if (prevJq) r += `  前一节气：${prevJq.getName()}（${prevJq.getSolar().toYmd()}）\n`;
if (nextJq) r += `  后一节气：${nextJq.getName()}（${nextJq.getSolar().toYmd()}）\n`;
r += '\n';

// 三元九运 - 修复版
r += `⭐ **三元九运**\n`;
try {
  const yn = lunar.getYearNineStar();
  r += `  年九星：${yn.getNameInXuanKong()}（${yn.getColor()} ${yn.getWuXing()}）\n`;
} catch(e) { r += `  年九星：(error ${e.message})\n`; }
try { const ms = lunar.getMonthNineStar(); r += `  月九星：${ms.getNameInXuanKong()}\n`; } catch(e){ r += `  月九星：(error)\n`; }
try { const ds = lunar.getDayNineStar(); r += `  日九星：${ds.getNameInXuanKong()}\n`; } catch(e){ r += `  日九星：(error)\n`; }
try { const ts = lunar.getTimeNineStar(); r += `  时九星：${ts.getNameInXuanKong()}\n`; } catch(e){ r += `  时九星：(error)\n`; }
r += '\n';

// 二十八宿
r += `🌌 **二十八宿**\n`;
r += `  值宿：${lunar.getXiu()}（${lunar.getXiuLuck()}）\n`;
r += `  歌诀：${lunar.getXiuSong()}\n\n`;

// 宜忌
r += `✅ **宜**\n`;
r += `  ${Array.isArray(lunar.getDayYi()) ? lunar.getDayYi().join('、') : lunar.getDayYi()||'无'}\n`;
r += `❌ **忌**\n`;
r += `  ${Array.isArray(lunar.getDayJi()) ? lunar.getDayJi().join('、') : lunar.getDayJi()||'无'}\n\n`;

// 吉神凶煞
r += `🙏 **吉神**\n  ${lunar.getDayJiShen()||'无'}\n`;
r += `👹 **凶煞**\n  ${lunar.getDayXiongSha()||'无'}\n\n`;

// 彭祖百忌
r += `📖 **彭祖百忌**\n`;
r += `  ${lunar.getPengZuGan()||''}\n`;
r += `  ${lunar.getPengZuZhi()||''}\n\n`;

// 冲煞
r += `🔀 **冲煞**\n`;
r += `  冲：${lunar.getDayChong()}（${lunar.getDayChongShengXiao()}）\n`;
r += `  煞：${lunar.getDaySha()}\n\n`;

// 值星 / 六爻 / 月相
r += `🌙 **月相**：${lunar.getYueXiang()||''}\n`;
r += `🌟 **值星**：${lunar.getZhiXing()||''}\n`;
try { r += `☯ **六爻**：${lunar.getLiuYao()||''}\n`; } catch(e){}

// 扫描 Markdown 特殊字符
console.log('=== Markdown 安全检查 ===');
let hasBug = false;
for (let i = 0; i < r.length; i++) {
  const ch = r[i];
  if (ch === '_') {
    hasBug = true;
    console.log(`  ❌ 下划线在字符 ${i}: ...${r.substring(Math.max(0,i-5), i+10)}...`);
  }
  // Check for unpaired **
}
const openBold = (r.match(/\*\*/g) || []).length;
if (openBold % 2 !== 0) {
  hasBug = true;
  console.log(`  ❌ ** 未配对！共 ${openBold} 个 **`);
}
if (!hasBug) console.log('  ✅ 无 Markdown 安全问题');

console.log('\n=== 完整输出 ===');
console.log(r);
console.log('=== END ===');
