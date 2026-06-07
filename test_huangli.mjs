import { Solar } from 'lunar-javascript';

const now = new Date();
const hk = new Date(now.getTime() + 8*3600000);
const y = hk.getUTCFullYear(), m = hk.getUTCMonth()+1, d = hk.getUTCDate();

console.log(`Testing date: ${y}/${m}/${d}`);

const solar = Solar.fromYmd(y, m, d);
const lunar = solar.getLunar();

console.log('=== Individual field checks ===');

try {
  const r1 = lunar.getYearInChinese();
  console.log('getYearInChinese:', JSON.stringify(r1));
} catch(e) { console.log('getYearInChinese ERROR:', e.message); }

try {
  const r2 = lunar.getYearShengXiao();
  console.log('getYearShengXiao:', JSON.stringify(r2));
} catch(e) { console.log('getYearShengXiao ERROR:', e.message); }

try {
  const r3 = lunar.getYearInGanZhi();
  console.log('getYearInGanZhi:', JSON.stringify(r3));
} catch(e) { console.log('getYearInGanZhi ERROR:', e.message); }

try {
  const r4 = lunar.getMonthInGanZhiExact();
  console.log('getMonthInGanZhiExact:', JSON.stringify(r4));
} catch(e) { console.log('getMonthInGanZhiExact ERROR:', e.message); }

try {
  const r5 = lunar.getDayInGanZhiExact();
  console.log('getDayInGanZhiExact:', JSON.stringify(r5));
} catch(e) { console.log('getDayInGanZhiExact ERROR:', e.message); }

try {
  const jq = lunar.getCurrentJieQi();
  console.log('getCurrentJieQi:', JSON.stringify(jq));
} catch(e) { console.log('getCurrentJieQi ERROR:', e.message); }

try {
  const jqTable = lunar.getJieQiTable();
  if (jqTable) {
    const entries = Object.entries(jqTable);
    console.log('jieQi entries:', entries.slice(0,4));
  }
} catch(e) { console.log('jieQiTable ERROR:', e.message); }

try {
  const yn = lunar.getYearNineStar();
  console.log('getYearNineStar type:', typeof yn, 'keys:', Object.keys(yn));
  console.log('getName:', yn.getName());
  console.log('getColor:', yn.getColor());
  console.log('getWuXing:', yn.getWuXing());
} catch(e) { console.log('getYearNineStar ERROR:', e.message); }

try {
  const ms = lunar.getMonthNineStar();
  console.log('getMonthNineStar:', JSON.stringify(ms), 'type:', typeof ms);
  if (typeof ms === 'object' && ms?.getName) {
    console.log('  getName:', ms.getName());
    console.log('  toString:', ms.toString());
  }
} catch(e) { console.log('getMonthNineStar ERROR:', e.message); }

try {
  const ds = lunar.getDayNineStar();
  console.log('getDayNineStar:', JSON.stringify(ds), 'type:', typeof ds);
  if (typeof ds === 'object' && ds?.getName) {
    console.log('  getName:', ds.getName());
    console.log('  toString:', ds.toString());
  }
} catch(e) { console.log('getDayNineStar ERROR:', e.message); }

try {
  const ts = lunar.getTimeNineStar();
  console.log('getTimeNineStar:', JSON.stringify(ts), 'type:', typeof ts);
  if (typeof ts === 'object' && ts?.getName) {
    console.log('  getName:', ts.getName());
  }
} catch(e) { console.log('getTimeNineStar ERROR:', e.message); }

try {
  const xiu = lunar.getXiu();
  console.log('getXiu:', JSON.stringify(xiu));
} catch(e) { console.log('getXiu ERROR:', e.message); }

try {
  const luck = lunar.getXiuLuck();
  console.log('getXiuLuck:', JSON.stringify(luck));
} catch(e) { console.log('getXiuLuck ERROR:', e.message); }

try {
  const song = lunar.getXiuSong();
  console.log('getXiuSong:', JSON.stringify(song));
} catch(e) { console.log('getXiuSong ERROR:', e.message); }

try {
  const yi = lunar.getDayYi();
  console.log('getDayYi:', JSON.stringify(yi), 'type:', typeof yi, 'isArray:', Array.isArray(yi));
} catch(e) { console.log('getDayYi ERROR:', e.message); }

try {
  const ji = lunar.getDayJi();
  console.log('getDayJi:', JSON.stringify(ji), 'type:', typeof ji, 'isArray:', Array.isArray(ji));
} catch(e) { console.log('getDayJi ERROR:', e.message); }

try {
  const js = lunar.getDayJiShen();
  console.log('getDayJiShen:', JSON.stringify(js));
} catch(e) { console.log('getDayJiShen ERROR:', e.message); }

try {
  const xs = lunar.getDayXiongSha();
  console.log('getDayXiongSha:', JSON.stringify(xs));
} catch(e) { console.log('getDayXiongSha ERROR:', e.message); }

try {
  const pg = lunar.getPengZuGan();
  console.log('getPengZuGan:', JSON.stringify(pg));
} catch(e) { console.log('getPengZuGan ERROR:', e.message); }

try {
  const pz = lunar.getPengZuZhi();
  console.log('getPengZuZhi:', JSON.stringify(pz));
} catch(e) { console.log('getPengZuZhi ERROR:', e.message); }

try {
  const dc = lunar.getDayChong();
  console.log('getDayChong:', JSON.stringify(dc));
} catch(e) { console.log('getDayChong ERROR:', e.message); }

try {
  const dcs = lunar.getDayChongShengXiao();
  console.log('getDayChongShengXiao:', JSON.stringify(dcs));
} catch(e) { console.log('getDayChongShengXiao ERROR:', e.message); }

try {
  const sha = lunar.getDaySha();
  console.log('getDaySha:', JSON.stringify(sha));
} catch(e) { console.log('getDaySha ERROR:', e.message); }

try {
  const yx = lunar.getYueXiang();
  console.log('getYueXiang:', JSON.stringify(yx));
} catch(e) { console.log('getYueXiang ERROR:', e.message); }

try {
  const zx = lunar.getZhiXing();
  console.log('getZhiXing:', JSON.stringify(zx), 'type:', typeof zx);
} catch(e) { console.log('getZhiXing ERROR:', e.message); }

try {
  const ly = lunar.getLiuYao();
  console.log('getLiuYao:', JSON.stringify(ly));
} catch(e) { console.log('getLiuYao ERROR:', e.message); }
