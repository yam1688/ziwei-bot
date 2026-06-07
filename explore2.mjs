import { Solar, Lunar, EightChar, NineStar, LunarUtil } from 'lunar-javascript';

const solar = Solar.fromYmd(1990, 6, 15);
const lunar = solar.getLunar();
const ec = EightChar.fromLunar(lunar);

console.log('=== 八字完整信息 ===');
console.log('八字:', ec.toString());
console.log('年柱:', ec.getYear(), '天干:', ec.getYearGan(), '地支:', ec.getYearZhi(), '五行:', ec.getYearWuXing(), '纳音:', ec.getYearNaYin());
console.log('月柱:', ec.getMonth(), '天干:', ec.getMonthGan(), '地支:', ec.getMonthZhi(), '五行:', ec.getMonthWuXing(), '纳音:', ec.getMonthNaYin());
console.log('日柱:', ec.getDay(), '天干:', ec.getDayGan(), '地支:', ec.getDayZhi(), '五行:', ec.getDayWuXing(), '纳音:', ec.getDayNaYin());
console.log('时柱:', ec.getTime(), '天干:', ec.getTimeGan(), '地支:', ec.getTimeZhi(), '五行:', ec.getTimeWuXing(), '纳音:', ec.getTimeNaYin());

console.log('\n=== 十神 ===');
console.log('年干十神:', ec.getYearShiShenGan());
console.log('月干十神:', ec.getMonthShiShenGan());
console.log('日干十神:', ec.getDayShiShenGan());
console.log('时干十神:', ec.getTimeShiShenGan());

console.log('\n=== 藏干 ===');
console.log('年支藏干:', ec.getYearHideGan());
console.log('月支藏干:', ec.getMonthHideGan());
console.log('日支藏干:', ec.getDayHideGan());
console.log('时支藏干:', ec.getTimeHideGan());

console.log('\n=== 地势 (十二长生) ===');
console.log('年:', ec.getYearDiShi());
console.log('月:', ec.getMonthDiShi());
console.log('日:', ec.getDayDiShi());
console.log('时:', ec.getTimeDiShi());

console.log('\n=== 旬空 ===');
console.log('年旬空:', ec.getYearXunKong());
console.log('月旬空:', ec.getMonthXunKong());
console.log('日旬空:', ec.getDayXunKong());
console.log('时旬空:', ec.getTimeXunKong());

console.log('\n=== 胎元 / 命宫 / 身宫 ===');
console.log('胎元:', ec.getTaiYuan(), '纳音:', ec.getTaiYuanNaYin());
console.log('命宫:', ec.getMingGong(), '纳音:', ec.getMingGongNaYin());
console.log('身宫:', ec.getShenGong(), '纳音:', ec.getShenGongNaYin());

console.log('\n=== 大运 ===');
const yun = ec.getYun();
console.log('Gender:', yun.getGender());
console.log('Start age:', yun.getStartYear());
console.log('顺逆:', yun.getForward() ? '顺排' : '逆排');
const daYunArr = yun.getDaYun();
for (let i = 0; i < Math.min(daYunArr.length, 8); i++) {
  const dy = daYunArr[i];
  console.log(`  ${i+1}. ${dy.getStartAge()}岁-${dy.getEndAge()}岁: ${dy.getGanZhi()} (${dy.getGanZhi()})`);
}

console.log('\n=== 流年 ===');
const liuNian = yun.getLiuNian(2026);
console.log('2026流年:', liuNian.getGanZhi());
console.log('年龄:', liuNian.getAge());
console.log('年干十神:', liuNian.getGanShiShen());
console.log('年支十神:', liuNian.getZhiShiShen());

console.log('\n=== 九星 (三元九运) ===');
console.log('年九星:', lunar.getYearNineStar());
console.log('月九星:', lunar.getMonthNineStar());
console.log('日九星:', lunar.getDayNineStar());
console.log('时九星:', lunar.getTimeNineStar());

const ns = lunar.getYearNineStar();
console.log('年九星对象:', ns);
console.log('Number:', ns.getNumber());
console.log('Name:', ns.getName());
console.log('Color:', ns.getColor());
console.log('Wuxing:', ns.getWuXing());

console.log('\n=== 二十八宿 ===');
console.log('星宿:', lunar.getXiu());
console.log('吉凶:', lunar.getXiuLuck());
console.log('歌诀:', lunar.getXiuSong());

console.log('\n=== 彭祖百忌 ===');
console.log('天干忌:', lunar.getPengZuGan());
console.log('地支忌:', lunar.getPengZuZhi());

console.log('\n=== 节气 ===');
console.log('当前节气:', lunar.getCurrentJieQi());
console.log('节气表:', JSON.stringify(lunar.getJieQiTable()).substring(0, 200));

console.log('\n=== 宜忌 ===');
console.log('日宜:', lunar.getDayYi());
console.log('日忌:', lunar.getDayJi());
console.log('吉神:', lunar.getDayJiShen());
console.log('凶煞:', lunar.getDayXiongSha());

console.log('\n=== 六爻 ===');
console.log('六爻:', lunar.getLiuYao());

console.log('\n=== 值星 ===');
console.log('值星:', lunar.getZhiXing());
