/**
 * 紫微斗数 Telegram Bot v2 — 多命理聚合
 *
 * 主题：紫微斗数 · 八字 · 易经 · 黄历 · 三元九运
 *
 * 引擎：iztro / lunar-javascript / iching-shifa
 * 体系：倪海夏《天纪》· 子平八字 · 周易
 */
import TelegramBot from 'node-telegram-bot-api';
import { astro } from 'iztro';
import { Solar, Lunar, EightChar } from 'lunar-javascript';
import {
  dayan, lueshifa, timeQiGua, threeNumberQiGua, manualQiGua, numberArrayQiGua,
  getGuaName, decodeGua, getHuGua, getZhiGua, getMovingYaoPositions,
  getCurrentSolarTerm, GUA_DESCRIPTIONS, BAGUA_XIANG, NAYIN_60,
} from 'iching-shifa';
import { genQiMen, genQiMenData } from './lib/qimen.mjs';
import { genLiuYao, genLiuYaoData } from './lib/liuyao.mjs';
import { genMeiHua, genMeiHuaData } from './lib/meihua.mjs';
import { genFengShui, genFengShuiData } from './lib/fengshui.mjs';
import { aiInterpret } from './lib/interpret.mjs';
import { genSanYuanText, genJiuYunList } from './lib/sanyuan.mjs';
import { detectPatterns, getSanFangAnalysis, getStarBrightnessTable, getCareerSuggestion } from './lib/zw_patterns.mjs';
import { genWuXing } from './lib/wuxing.mjs';
import { genBaMen } from './lib/bamen.mjs';
import { genShiShen } from './lib/shishen.mjs';
import { genJieQi } from './lib/jieqi.mjs';
import { genBaZhai } from './lib/bazhai.mjs';
import { genJiRi } from './lib/jiri.mjs';

const TOKEN = process.env.BOT_TOKEN || '8936592956:AAE1h-S8HSHaQu66aQWtXLCPvWJyq1c3FQU';

// ─── 常量 ────────────────────────────────────────
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING = ['金','木','水','火','土'];
const SHICHEN_NAMES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const STAR_INFO = {
  '紫微': { kw:'帝王·尊贵·独立', el:'土', nature:'帝王星', desc:'北斗主星，统率群星。入命宫主领导力强，自尊心重，喜掌权。' },
  '天机': { kw:'智慧·机变·谋略', el:'木', nature:'智慧星', desc:'南斗第三星，主智慧与谋略。入命宫主聪明善变，思维敏捷。' },
  '太阳': { kw:'阳刚·官贵·慷慨', el:'火', nature:'贵人星', desc:'中天主星，主贵气与光明。入命宫主慷慨大方，热心助人。' },
  '武曲': { kw:'财富·刚毅·果断', el:'金', nature:'财帛星', desc:'北斗第六星，正财星。入命宫主刚毅果决，擅长理财。' },
  '天同': { kw:'温和·享福·随缘', el:'水', nature:'福德星', desc:'南斗第四星，福星。入命宫主性情温和，知足常乐。' },
  '廉贞': { kw:'才艺·刑囚·桃花', el:'火', nature:'桃花星', desc:'北斗第五星，次桃花。入命宫主多才多艺，情感丰富。' },
  '天府': { kw:'财库·稳重·保守', el:'土', nature:'财库星', desc:'南斗主星，财库。入命宫主稳重保守，善守成。' },
  '太阴': { kw:'柔美·财富·细腻', el:'水', nature:'财富星', desc:'中天主星，主财富与田宅。入命宫主性格温柔细腻。' },
  '贪狼': { kw:'欲望·桃花·多才', el:'木', nature:'桃花星', desc:'北斗第一星，正桃花。入命宫主多才多艺，交际广阔。' },
  '巨门': { kw:'口舌·是非·善辩', el:'水', nature:'是非星', desc:'北斗第二星，主口舌。入命宫主善辩多思。' },
  '天相': { kw:'辅佐·行政·印绶', el:'水', nature:'印绶星', desc:'南斗第五星，辅佐之星。入命宫主稳重守信。' },
  '天梁': { kw:'荫护·医药·长辈', el:'土', nature:'荫庇星', desc:'南斗第二星，主荫护。入命宫主慈悲正直。' },
  '七杀': { kw:'将星·果决·孤克', el:'金', nature:'将帅星', desc:'南斗第六星，将星。入命宫主果断勇猛。' },
  '破军': { kw:'开创·变动·破坏', el:'水', nature:'变动星', desc:'北斗第七星，主变动。入命宫主开创性强。' },
};

const PALACE_INFO = {
  '命宫':   { desc:'一生整体运势、性格特质、格局高低。命宫主星决定人生基本走向。', aka:'本命' },
  '兄弟宫': { desc:'兄弟姐妹缘分、朋友关系、母亲状况。', aka:'手足' },
  '夫妻宫': { desc:'婚姻状况、配偶特质、感情模式、婚姻早晚。', aka:'婚姻' },
  '子女宫': { desc:'子女缘分、子女数量与成就、桃花运。', aka:'子女' },
  '财帛宫': { desc:'财运好坏、赚钱方式、消费习惯、理财能力。', aka:'财运' },
  '疾厄宫': { desc:'健康状况、易患疾病类型、体质强弱。', aka:'健康' },
  '迁移宫': { desc:'外出发展、社交能力、旅行运、移民运。', aka:'外出' },
  '交友宫': { desc:'交友状况、合作伙伴、下属关系。', aka:'交友' },
  '官禄宫': { desc:'事业发展、学业运、工作态度、职业方向。', aka:'事业' },
  '田宅宫': { desc:'房产运、居住环境、积蓄能力、家族遗产。', aka:'房产' },
  '福德宫': { desc:'精神生活、内心世界、福气深浅、晚年运。', aka:'福气' },
  '父母宫': { desc:'父母关系、遗传特质、长辈缘、社会背景。', aka:'父母' },
};

const SI_HUA_TABLE = [
  ['廉贞','破军','武曲','太阳'], ['天机','天梁','紫微','太阴'],
  ['天同','天机','文昌','廉贞'], ['太阴','天同','天机','巨门'],
  ['贪狼','太阴','右弼','天机'], ['武曲','贪狼','天梁','文曲'],
  ['太阳','武曲','太阴','天同'], ['巨门','太阳','文曲','文昌'],
  ['天梁','紫微','左辅','武曲'], ['破军','巨门','太阴','贪狼'],
];

const SHI_SHEN_MAP = {
  '比肩':'同辈竞争', '劫财':'破财损耗', '食神':'才华享受', '伤官':'傲气才艺',
  '正财':'稳定收入', '偏财':'横财投资', '正官':'官运管理', '七杀':'权柄压力',
  '正印':'学业长辈', '偏印':'偏门天赋',
};

// ─── 会话 ────────────────────────────────
const sessions = new Map();

function getSess(chatId) {
  if (!sessions.has(chatId)) sessions.set(chatId, {});
  return sessions.get(chatId);
}
function resetSess(chatId) { sessions.delete(chatId); }

// ─── Bot ──────────────────────────────────
const bot = new TelegramBot(TOKEN, { polling: true });
bot.setMyCommands([
  { command: 'zw',     description: '紫微斗数排盘 /zw 1990 1 1 6 男' },
  { command: 'bazi',   description: '八字排盘 /bazi 1990 1 1 6 男' },
  { command: 'yijing', description: '易经占卜起卦' },
  { command: 'qimen',  description: '奇门遁甲 /qimen 2026 6 8 10' },
  { command: 'liuyao', description: '六爻纳甲起卦' },
  { command: 'meihua', description: '梅花易数占卜' },
  { command: 'today',  description: '今日黄历·宜忌·九星·星宿' },
  { command: 'sanyuan',  description: '三元九运详解·当前离火运' },
  { command: 'wuxing',   description: '五行生克详解' },
  { command: 'shishen',  description: '十神详解·八字十神表' },
  { command: 'jieqi',    description: '二十四节气·月令分界' },
  { command: 'bamen',    description: '奇门八门九星八神详解' },
  { command: 'bazhai',   description: '八宅风水吉凶方位' },
  { command: 'jiri',     description: '择日宜忌·彭祖百忌' },
  { command: 'fengshui', description: '风水九星 年/月/日飞星' },
  { command: 'star',     description: '查主星含义 /star 紫微' },
  { command: 'gua',      description: '查卦象 /gua 乾' },
  { command: 'help',     description: '使用帮助' },
]).then(() => console.log('✅ 命令菜单已设置'))
 .catch(e => console.error('⚠️ 命令菜单失败:', e.message));
console.log('🤖 紫微斗数 Bot v2 已启动...');

// ─── 工具 ─────────────────────────────────
function bEmoji(b) {
  if (!b) return '⭐';
  if (b === '庙') return '🌟';
  if (b === '旺') return '⭐';
  if (b === '陷'||b === '不') return '🌑';
  if (b === '利') return '🌙';
  return '⭐';
}
function mLabel(m) {
  if (!m) return '';
  return { '禄':'🟢禄','权':'🔵权','科':'🟣科','忌':'🔴忌' }[m] || '';
}

function parseArgs(args, allowHour=true) {
  const p = args?.trim().split(/\s+/);
  if (!p || p.length < (allowHour ? 5 : 3)) return null;
  const y=parseInt(p[0]), m=parseInt(p[1]), d=parseInt(p[2]);
  let h=0, g='male';
  if (allowHour) {
    h = parseInt(p[3]); if (isNaN(h)||h<0||h>11) return null;
    g = (p[4]==='女'||p[4]==='female') ? 'female' : 'male';
  }
  if (isNaN(y)||isNaN(m)||isNaN(d)) return null;
  return { year:y, month:m, day:d, hour:h, gender:g };
}

function fmtLunar(lunar) {
  return `${lunar.getYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
}

// ═══════════════════════════════════════════
//  1. 紫微斗数
// ═══════════════════════════════════════════

function genZW(year, month, day, hour, gender) {
  const a = astro.bySolar(`${year}-${month}-${day}`, hour, gender==='male'?'男':'女', true, 'zh-CN');
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const mingB = BRANCHES.indexOf(a.earthlyBranchOfSoulPalace);
  const shenB = BRANCHES.indexOf(a.earthlyBranchOfBodyPalace);
  const stemIdx = STEMS.indexOf(a.heavenlyStemOfBirthYear);
  const sihua = SI_HUA_TABLE[stemIdx] || [];

  let r = `🔮 **紫微斗数命盘**\n━━━━━━━━━━━━━━\n`;
  r += `📋 ${year}年${month}月${day}日  ${BRANCHES[hour]}时  ${gender==='male'?'男命':'女命'}\n`;
  r += `农历 ${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}\n`;
  r += `生肖${lunar.getYearShengXiao()}　${lunar.getYearGan()}${lunar.getYearZhi()}年\n五行局${a.fiveElementsClass}  命${BRANCHES[mingB]} 身${BRANCHES[shenB]}\n\n`;

  r += `⭐ **十四主星**\n`;
  for (const p of a.palaces) {
    const ms = p.majorStars||[];
    if (ms.length) r += `  ${p.name}：${ms.map(s=>`${s.name}${bEmoji(s.brightness)}${mLabel(s.mutagen)}`).join(' ')}\n`;
  }
  r += '\n';
  if (a.palaces.some(p=>(p.minorStars||[]).length)) {
    r += `🪐 **辅煞**\n`;
    for (const p of a.palaces) {
      const ns = p.minorStars||[];
      if (ns.length) r += `  ${p.name}：${ns.map(s=>`${s.name}${mLabel(s.mutagen)}`).join(' ')}\n`;
    }
    r += '\n';
  }
  if (sihua.length===4) {
    r += `🔄 **四化**（${lunar.getYearGan()}干）\n  禄${sihua[0]} 权${sihua[1]}  科${sihua[2]} 忌${sihua[3]}\n\n`;
  }
  const sorted = [...a.palaces].filter(p=>p.decadal?.range).sort((a,b)=>a.decadal.range[0]-b.decadal.range[0]);
  r += `📅 **大限**（${a.age||'?'}岁）\n`;
  for (const p of sorted) {
    const [s,e]=p.decadal.range;
    r += `  ${s}-${e} ${p.name}${a.age>=s&&a.age<=e?' ◀':''}\n`;
  }
  r += '\n🏛 **十二宫**\n';
  for (const p of a.palaces) {
    const all=[...(p.majorStars||[]),...(p.minorStars||[])];
    r += `  ${p.name}：${all.map(s=>s.name).join('、')||'空宫'}\n`;
  }
  r += '\n';

  // ── 细化部分 ──
  r += getSanFangAnalysis(a.palaces) + '\n';
  r += getStarBrightnessTable(a.palaces) + '\n';
  r += getCareerSuggestion(a.palaces) + '\n';
  
  const patterns = detectPatterns(a.palaces);
  if (patterns.length) {
    r += `🏆 **格局识别**\n`;
    for (const pat of patterns) {
      const lv = {excellent:'🏅大吉',good:'✅吉',neutral:'➖平',caution:'⚠️凶'};
      r += `  ${lv[pat.level]||'➖'} ${pat.name}\n`;
      r += `    ${pat.desc}\n`;
    }
  }
  return r;
}

// ═══════════════════════════════════════════
//  2. 八字
// ═══════════════════════════════════════════

function genBaZi(year, month, day, hour, gender) {
  // 用时辰近似时钟小时，用于八字时柱计算
  const clockHour = Math.min(hour * 2 + 1, 23);
  const solar = Solar.fromYmdHms(year, month, day, clockHour, 0, 0);
  const lunar = solar.getLunar();
  const ec = EightChar.fromLunar(lunar);

  let r = `📜 **八字命盘**\n━━━━━━━━━━━━━━\n`;
  r += `📋 ${year}年${month}月${day}日  ${BRANCHES[hour]}时  ${gender==='male'?'男命':'女命'}\n`;
  r += `农历 ${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}\n\n`;

  // 四柱 (use lunar time for ba zi hour)
  const cols = [
    { label:'年', g:ec.getYearGan(), z:ec.getYearZhi(), w:ec.getYearWuXing(), n:ec.getYearNaYin(),
      sg:ec.getYearShiShenGan(), sz:ec.getYearShiShenZhi(), hg:ec.getYearHideGan(), ds:ec.getYearDiShi(), xk:ec.getYearXunKong() },
    { label:'月', g:ec.getMonthGan(), z:ec.getMonthZhi(), w:ec.getMonthWuXing(), n:ec.getMonthNaYin(),
      sg:ec.getMonthShiShenGan(), sz:ec.getMonthShiShenZhi(), hg:ec.getMonthHideGan(), ds:ec.getMonthDiShi(), xk:ec.getMonthXunKong() },
    { label:'日', g:ec.getDayGan(), z:ec.getDayZhi(), w:ec.getDayWuXing(), n:ec.getDayNaYin(),
      sg:ec.getDayShiShenGan(), sz:ec.getDayShiShenZhi(), hg:ec.getDayHideGan(), ds:ec.getDayDiShi(), xk:ec.getDayXunKong() },
    { label:'时', g:ec.getTimeGan(), z:ec.getTimeZhi(), w:ec.getTimeWuXing(), n:ec.getTimeNaYin(),
      sg:ec.getTimeShiShenGan(), sz:ec.getTimeShiShenZhi(), hg:ec.getTimeHideGan(), ds:ec.getTimeDiShi(), xk:ec.getTimeXunKong() },
  ];

  r += `┌────┬────┬────┬────┬──────┐\n`;
  r += `│    │ 年 │ 月 │ 日 │ 时  │\n`;
  r += `├────┼────┼────┼────┼──────┤\n`;
  r += `│天干│`;
  for (const c of cols) r += ` ${c.g}  │`;
  r += `\n│地支│`;
  for (const c of cols) r += ` ${c.z}  │`;
  r += `\n│五行│`;
  for (const c of cols) r += `${c.w}│`;
  r += `\n│纳音│`;
  for (const c of cols) r += `${c.n.padEnd(4,'　')}│`;
  r += `\n└────┴────┴────┴────┴──────┘\n\n`;

  // 日主
  r += `👤 **日主**：${ec.getDayGan()}${ec.getDayZhi()}（${ec.getDayWuXing()}）\n\n`;

  // 十神
  r += `🔠 **十神**\n`;
  const labels = ['年','月','日','时'];
  for (let i=0; i<4; i++) {
    const c=cols[i];
    const hgStr = Array.isArray(c.hg) ? c.hg.join('、') : '';
    r += `  ${labels[i]}干：${c.sg}（${SHI_SHEN_MAP[c.sg]||''}）  支藏：${hgStr} → ${c.sz||''}\n`;
  }
  r += '\n';

  // 地势
  r += `🌱 **十二长生**\n`;
  for (let i=0; i<4; i++) r += `  ${labels[i]}：${cols[i].ds}\n`;
  r += '\n';

  // 旬空
  r += `🌫 **旬空**\n`;
  for (let i=0; i<4; i++) {
    const xk = Array.isArray(cols[i].xk) ? cols[i].xk.join('、') : cols[i].xk||'无';
    r += `  ${labels[i]}：${xk}\n`;
  }
  r += '\n';

  // 胎元、命宫、身宫
  r += `📍 **胎元命身**\n`;
  r += `  胎元：${ec.getTaiYuan()}（${ec.getTaiYuanNaYin()}）\n`;
  r += `  命宫：${ec.getMingGong()}（${ec.getMingGongNaYin()}）\n`;
  r += `  身宫：${ec.getShenGong()}（${ec.getShenGongNaYin()}）\n\n`;

  // 大运
  try {
    const yun = ec.getYun();
    r += `🚀 **大运**（${yun.getStartYear()}岁起运）\n`;
    const dys = yun.getDaYun();
    for (let i=0; i<Math.min(dys.length,8); i++) {
      const dy = dys[i];
      r += `  ${dy.getStartAge()}-${dy.getEndAge()}岁  ${dy.getGanZhi()}\n`;
    }
    r += '\n';

    // 流年
    const curYr = new Date().getFullYear();
    const ln = yun.getLiuNian(curYr);
    r += `📅 **${curYr}年流年**\n`;
    r += `  流年干支：${ln.getGanZhi()}\n`;
    r += `  干十神：${ln.getGanShiShen()}（${SHI_SHEN_MAP[ln.getGanShiShen()]||''}）\n`;
    r += `  支十神：${ln.getZhiShiShen()}\n`;
  } catch(e) {
    r += `  大运计算需具体出生时间\n`;
  }

  return r;
}

// ═══════════════════════════════════════════
//  3. 易经
// ═══════════════════════════════════════════

function genYiJing(method='dayan') {
  let yaoStr;
  if (method === 'dayan') yaoStr = dayan();
  else if (method === 'lueshifa') yaoStr = lueshifa();
  else yaoStr = dayan();

  // yaoStr = e.g. "989898" where 6/8=yin, 7/9=yang, 6/9=moving
  const yinYang = yaoStr.split('').map(c => parseInt(c) >= 7 ? '阳' : '阴');
  const moving = yaoStr.split('').map(c => parseInt(c) === 6 || parseInt(c) === 9);
  const lines = yaoStr.split('').map(c => parseInt(c));

  // 本卦
  const upperBin = lines.slice(0,3).map(c => (c===7||c===9) ? 1 : 0).join('');
  const lowerBin = lines.slice(3,6).map(c => (c===7||c===9) ? 1 : 0).join('');
  const upperGuaNum = parseInt(upperBin, 2) + 1;
  const lowerGuaNum = parseInt(lowerBin, 2) + 1;
  const trigramMap = {7:'艮',6:'坎',5:'巽',4:'震',3:'离',2:'兑',1:'乾',0:'坤'};
  // Actually let me use BAGUA_XIANG which maps 1-8
  const upperName = BAGUA_XIANG[String(upperGuaNum)];
  const lowerName = BAGUA_XIANG[String(lowerGuaNum)];

  // Get hexagram name from GUA64_ORDER
  // We need to know the hexagram ordering. The upper/lower trigrams combine.
  // I'll use decodeGua if available, or construct it.
  // 用 getGuaName 获取卦名（比 decodeGua 更稳定）
  const guaNameFromFn = getGuaName?.(yaoStr) || '未知';
  let benGua = { hexagram: '?', name: guaNameFromFn };
  let bienGua, huGua;

  try {
    const decoded = decodeGua(yaoStr);
    if (decoded?.name) benGua = decoded;
  } catch(e) { /* fallback to getGuaName */ }

  try {
    const hg = getHuGua(yaoStr);
    if (typeof hg === 'string') huGua = { name: hg };
    else huGua = hg;
  } catch(e) { huGua = null; }

  try {
    const bg = getZhiGua(yaoStr);
    if (typeof bg === 'string') bienGua = { name: bg };
    else bienGua = bg;
  } catch(e) { bienGua = null; }

  const movingPositions = getMovingYaoPositions(yaoStr) || [];

  let r = `☯ **易经占卜**\n━━━━━━━━━━━━━━\n`;
  r += `筮法：${method==='dayan'?'大衍筮法':'略筮法'}\n\n`;

  // 画卦
  r += `**爻象**（从下到上）\n`;
  const symbols = ['— 阳','- - 阴'];
  for (let i=5; i>=0; i--) {
    const num = lines[i];
    const isY = num === 7 || num === 9;
    const isM = num === 6 || num === 9;
    const mark = isM ? ' ⚡变' : '';
    const yaoIdx = 6-i;
    r += `  ${isY ? '——' : '— —'}  ${symbols[isY?0:1]}（${num}${mark}）\n`;
  }
  r += '\n';

  // 本卦
  r += `**本卦**：${benGua?.name || upperName+lowerName || '?'}\n`;
  if (benGua?.name) {
    const desc = GUA_DESCRIPTIONS[benGua.name];
    if (desc) r += `  ${desc['0']||''}\n`;
  }

  // 变卦
  if (bienGua?.name && bienGua.name !== benGua?.name) {
    r += `\n**变卦**：${bienGua.name}\n`;
    const d2 = GUA_DESCRIPTIONS[bienGua.name];
    if (d2) r += `  ${d2['0']||''}\n`;
  }

  // 互卦
  if (huGua?.name) {
    r += `\n**互卦**：${huGua.name}\n`;
  }

  // 动爻
  if (movingPositions?.length) {
    r += `\n**动爻**：${movingPositions.map(p=>`${p}爻`).join('、')}\n`;
    for (const pos of movingPositions) {
      const idx = parseInt(pos);
      const guaName = benGua?.name;
      if (guaName && GUA_DESCRIPTIONS[guaName]) {
        const yaoKey = String(idx);
        if (GUA_DESCRIPTIONS[guaName][yaoKey]) {
          r += `  ${pos}爻辞：${GUA_DESCRIPTIONS[guaName][yaoKey]}\n`;
        }
      }
    }
  }

  r += `\n━━━━━━━━━━━━━━\n💡 /yijing 重新起卦  /gua 乾 查卦辞`;
  return r;
}

// ═══════════════════════════════════════════
//  4. 今日黄历 / 择日
// ═══════════════════════════════════════════

function genToday() {
  const now = new Date();
  const hk = new Date(now.getTime() + 8*3600000);
  const y = hk.getUTCFullYear(), m = hk.getUTCMonth()+1, d = hk.getUTCDate();
  return genHuangLi(y, m, d);
}

function genHuangLi(year, month, day) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  let r = `📅 **黄历** ${year}年${month}月${day}日\n━━━━━━━━━━━━━━\n`;
  r += `农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}\n`;
  r += `生肖：${lunar.getYearShengXiao()}  年柱：${lunar.getYearInGanZhi()}\n`;
  r += `月柱：${lunar.getMonthInGanZhiExact()}  日柱：${lunar.getDayInGanZhiExact()}\n\n`;

  // 节气
  const curJq = lunar.getCurrentJieQi();
  if (curJq) r += `🌿 当前节气：${curJq}\n`;
  const prevJq = lunar.getPrevJieQi();
  const nextJq = lunar.getNextJieQi();
  if (prevJq) r += `  前一节气：${prevJq.getName()}（${prevJq.getSolar().toYmd()}）\n`;
  if (nextJq) r += `  后一节气：${nextJq.getName()}（${nextJq.getSolar().toYmd()}）\n`;
  r += '\n';

  // 三元九运
  r += `⭐ **三元九运**\n`;
  try {
    const yn = lunar.getYearNineStar();
    r += `  年九星：${yn.getNameInXuanKong()}（${yn.getColor()} ${yn.getWuXing()}）\n`;
  } catch(e) {}
  try { const ms = lunar.getMonthNineStar(); r += `  月九星：${ms.getNameInXuanKong()}\n`; } catch(e){}
  try { const ds = lunar.getDayNineStar(); r += `  日九星：${ds.getNameInXuanKong()}\n`; } catch(e){}
  try { const ts = lunar.getTimeNineStar(); r += `  时九星：${ts.getNameInXuanKong()}\n`; } catch(e){}
  r += '\n';

  // 二十八宿
  r += `🌌 **二十八宿**\n`;
  r += `  值宿：${lunar.getXiu()}（${lunar.getXiuLuck()}）\n`;
  r += `  歌诀：${lunar.getXiuSong()}\n\n`;

  // 宜忌
  r += `✅ **宜**\n`;
  const yi = lunar.getDayYi();
  r += `  ${Array.isArray(yi) ? yi.join('、') : yi||'无'}\n`;
  r += `❌ **忌**\n`;
  const ji = lunar.getDayJi();
  r += `  ${Array.isArray(ji) ? ji.join('、') : ji||'无'}\n\n`;

  // 吉神凶煞
  r += `🙏 **吉神**\n  ${lunar.getDayJiShen()||'无'}\n`;
  r += `👹 **凶煞**\n  ${lunar.getDayXiongSha()||'无'}\n\n`;

  // 彭祖百忌
  r += `📖 **彭祖百忌**\n`;
  r += `  ${lunar.getPengZuGan()||''}\n`;
  r += `  ${lunar.getPengZuZhi()||''}\n\n`;

  // 冲
  r += `🔀 **冲煞**\n`;
  r += `  冲：${lunar.getDayChong()}（${lunar.getDayChongShengXiao()}）\n`;
  r += `  煞：${lunar.getDaySha()}\n\n`;

  // 值星 / 六爻 / 月相
  r += `🌙 **月相**：${lunar.getYueXiang()||''}\n`;
  r += `🌟 **值星**：${lunar.getZhiXing()||''}\n`;
  try { r += `☯ **六爻**：${lunar.getLiuYao()||''}\n`; } catch(e){}

  return r;
}

// ═══════════════════════════════════════════
//  命令处理
// ═══════════════════════════════════════════

// ── 帮助 ──
bot.onText(/^\/help$/, (msg) => {
  bot.sendMessage(msg.chat.id,
`📚 **紫微斗数 Bot 帮助**

**排盘类**
/zw — 紫微斗数排盘
　/zw 1990 1 1 6 男 — 一行快速排
/bazi — 八字排盘（十神·大运·流年）
　/bazi 1990 1 1 6 男
/yijing — 易经占卜起卦
/qimen — 奇门遁甲排盘
　/qimen 2026 6 8 10
/liuyao — 六爻纳甲起卦
/meihua — 梅花易数占卜
/sanyuan — 三元九运详解（当前离火运）
/wuxing — 五行生克详解
/shishen — 十神详解
/jieqi — 二十四节气
/bamen — 奇门八门九星八神
/bazhai — 八宅风水吉凶
/jiri — 择日宜忌·彭祖百忌
/fengshui — 风水九星飞布
/today — 今日黄历

**查询**
/star 紫微 — 查十四主星
/gua 乾 — 查六十四卦

**其他**
/help
/cancel

**时辰对照**
0子 1丑 2寅 3卯 4辰 5巳
6午 7未 8申 9酉 10戌 11亥
`,
    { parse_mode:'Markdown' }
  );
});

// ── 取消 ──
bot.onText(/^\/cancel$/, (msg) => {
  resetSess(msg.chat.id);
  bot.sendMessage(msg.chat.id, '❌ 已取消。');
});

// ── 紫微斗数 ──
bot.onText(/^\/zw(?:\s+(.+))?$/, async (msg, match) => {
  const c = msg.chat.id;
  const args = parseArgs(match[1]);
  if (args) {
    try {
      const r = genZW(args.year, args.month, args.day, args.hour, args.gender);
      await bot.sendMessage(c, r, { parse_mode:'Markdown' });
    } catch(e) { bot.sendMessage(c, `❌ 紫微排盘失败：${e.message}`); }
    return;
  }
  // 分步
  resetSess(c);
  const s = getSess(c); s.topic='zw'; s.step='yr';
  bot.sendMessage(c, '🔮 **紫微斗数排盘**\n第一步：输入公历出生年份');
});

// ── 八字 ──
bot.onText(/^\/bazi(?:\s+(.+))?$/, async (msg, match) => {
  const c = msg.chat.id;
  const args = parseArgs(match[1]);
  if (args) {
    try {
      const r = genBaZi(args.year, args.month, args.day, args.hour, args.gender);
      await bot.sendMessage(c, r, { parse_mode:'Markdown' });
    } catch(e) { bot.sendMessage(c, `❌ 八字排盘失败：${e.message}`); }
    return;
  }
  resetSess(c);
  const s = getSess(c); s.topic='bazi'; s.step='yr';
  bot.sendMessage(c, '📜 **八字排盘**\n第一步：输入公历出生年份');
});

// ── 易经 ──
bot.onText(/^\/yijing(?:\s+(.+))?$/, async (msg, match) => {
  const c = msg.chat.id;
  const method = match?.[1]?.trim() === 'lue' ? 'lueshifa' : 'dayan';
  try {
    const r = genYiJing(method);
    await bot.sendMessage(c, r, { parse_mode:'Markdown' });
  } catch(e) {
    bot.sendMessage(c, `❌ 起卦失败：${e.message}`);
  }
});

// ── 今日黄历 ──
bot.onText(/^\/today$/, async (msg) => {
  try {
    const r = genToday();
    await bot.sendMessage(msg.chat.id, r, { parse_mode:'Markdown' });
  } catch(e) {
    bot.sendMessage(msg.chat.id, `❌ 获取黄历失败：${e.message}`);
  }
});

// ── 查星 ──
bot.onText(/^\/star(?:\s+(.+))?$/, (msg, match) => {
  const c = msg.chat.id;
  const n = match?.[1]?.trim();
  if (!n) {
    return bot.sendMessage(c, `📖 **十四主星**\n${Object.keys(STAR_INFO).join('、')}\n\n查详情：/star 紫微`, { parse_mode:'Markdown' });
  }
  const info = STAR_INFO[n];
  if (!info) return bot.sendMessage(c, `❌ 未找到「${n}」`);
  bot.sendMessage(c, `⭐ **${n}**（${info.el} ${info.nature}）\n特质：${info.kw}\n━━━━━━━━━━\n${info.desc}`);
});

// ── 奇门遁甲 ──
bot.onText(/^\/qimen(?:\s+(.+))?$/, async (msg, match) => {
  const c = msg.chat.id;
  const args = match[1]?.trim().split(/\s+/);
  const now = new Date();
  const y = parseInt(args?.[0]) || now.getFullYear();
  const m = parseInt(args?.[1]) || now.getMonth() + 1;
  const d = parseInt(args?.[2]) || now.getDate();
  const h = parseInt(args?.[3]) || now.getHours();
  try {
    const { text, data } = genQiMenData(y, m, d, h);
    const ai = await aiInterpret('qimen', data);
    await bot.sendMessage(c, text + '\n\n🤖 **AI 解盘**\n' + ai, { parse_mode:'Markdown' });
  } catch(e) { bot.sendMessage(c, `❌ 奇门失败：${e.message}`); }
});

// ── 六爻纳甲 ──
bot.onText(/^\/liuyao$/, async (msg) => {
  try {
    const { text, data } = genLiuYaoData();
    const ai = await aiInterpret('liuyao', data);
    await bot.sendMessage(msg.chat.id, text + '\n\n🤖 **AI 解盘**\n' + ai, { parse_mode:'Markdown' });
  } catch(e) { bot.sendMessage(msg.chat.id, `❌ 六爻失败：${e.message}`); }
});

// ── 梅花易数 ──
bot.onText(/^\/meihua(?:\s+(.+))?$/, async (msg, match) => {
  const c = msg.chat.id;
  const method = match?.[1]?.trim() === 'time' ? 'time' : 'number';
  try {
    const { text, data } = genMeiHuaData(method);
    const ai = await aiInterpret('meihua', data);
    await bot.sendMessage(c, text + '\n\n🤖 **AI 解盘**\n' + ai, { parse_mode:'Markdown' });
  } catch(e) { bot.sendMessage(c, `❌ 梅花易数失败：${e.message}`); }
});

// ── 五行生克 ──
bot.onText(/^\/wuxing$/, (msg) => {
  bot.sendMessage(msg.chat.id, genWuXing(), { parse_mode:'Markdown' });
});

// ── 十神详解 ──
bot.onText(/^\/shishen$/, (msg) => {
  bot.sendMessage(msg.chat.id, genShiShen(), { parse_mode:'Markdown' });
});

// ── 二十四节气 ──
bot.onText(/^\/jieqi$/, (msg) => {
  bot.sendMessage(msg.chat.id, genJieQi(), { parse_mode:'Markdown' });
});

// ── 奇门八门九星八神 ──
bot.onText(/^\/bamen$/, (msg) => {
  bot.sendMessage(msg.chat.id, genBaMen(), { parse_mode:'Markdown' });
});

// ── 八宅风水 ──
bot.onText(/^\/bazhai$/, (msg) => {
  bot.sendMessage(msg.chat.id, genBaZhai(), { parse_mode:'Markdown' });
});

// ── 择日宜忌 ──
bot.onText(/^\/jiri$/, (msg) => {
  bot.sendMessage(msg.chat.id, genJiRi(), { parse_mode:'Markdown' });
});

// ── 三元九运 ──
bot.onText(/^\/sanyuan$/, async (msg) => {
  try {
    const r = genSanYuanText();
    await bot.sendMessage(msg.chat.id, r, { parse_mode:'Markdown' });
  } catch(e) { bot.sendMessage(msg.chat.id, `❌ 三元九运获取失败：${e.message}`); }
});

// ── 风水九星 ──
bot.onText(/^\/fengshui(?:\s+(.+))?$/, async (msg, match) => {
  const c = msg.chat.id;
  const args = match[1]?.trim().split(/\s+/);
  const now = new Date();
  const y = parseInt(args?.[0]) || now.getFullYear();
  const m = parseInt(args?.[1]) || now.getMonth() + 1;
  const d = parseInt(args?.[2]) || now.getDate();
  try {
    const { text, data } = genFengShuiData(y, m, d);
    const ai = await aiInterpret('fengshui', data);
    await bot.sendMessage(c, text + '\n\n🤖 **AI 解盘**\n' + ai, { parse_mode:'Markdown' });
  } catch(e) { bot.sendMessage(c, `❌ 风水失败：${e.message}`); }
});

// ── 查卦 ──
bot.onText(/^\/gua(?:\s+(.+))?$/, (msg, match) => {
  const c = msg.chat.id;
  const n = match?.[1]?.trim();
  if (!n) return bot.sendMessage(c, '查卦：/gua 乾', { parse_mode:'Markdown' });
  const desc = GUA_DESCRIPTIONS[n];
  if (!desc) return bot.sendMessage(c, `❌ 未找到「${n}卦」`);
  let r = `☯ **${n}卦**\n━━━━━━━━━━\n${desc['0']||''}\n\n`;
  for (let i=1; i<=6; i++) {
    const k = String(i);
    if (desc[k]) r += `  ${['初','二','三','四','五','上'][i-1]}爻：${desc[k]}\n`;
  }
  if (desc['7']) r += `\n${desc['7']}`;
  bot.sendMessage(c, r);
});

// ── 分步输入对话 ──
bot.on('message', async (msg) => {
  const c = msg.chat.id;
  const text = msg.text?.trim();
  if (!text || text.startsWith('/')) return;

  const s = getSess(c);
  if (!s.topic || !s.step) return;

  try {
    if (s.topic === 'zw' || s.topic === 'bazi') {
      // ── year ──
      if (s.step === 'yr') {
        const y = parseInt(text);
        if (isNaN(y)||y<1900||y>2100) return bot.sendMessage(c, '❌ 年份无效，输入1900-2100：');
        s.yr = y; s.step = 'mo';
        return bot.sendMessage(c, `✅ ${y}年\n第二步：输入月份（1-12）`);
      }
      // ── month ──
      if (s.step === 'mo') {
        const m = parseInt(text);
        if (isNaN(m)||m<1||m>12) return bot.sendMessage(c, '❌ 月份无效：');
        s.mo = m; s.step = 'dy';
        return bot.sendMessage(c, `✅ ${s.yr}年${m}月\n第三步：输入日期（1-31）`);
      }
      // ── day ──
      if (s.step === 'dy') {
        const d = parseInt(text);
        if (isNaN(d)||d<1||d>31) return bot.sendMessage(c, '❌ 日期无效：');
        s.dy = d; s.step = 'hr';
        const kb = [];
        for (let i=0;i<12;i+=3) kb.push([{text:`${i} ${BRANCHES[i]}时`},{text:`${i+1} ${BRANCHES[i+1]}时`},{text:`${i+2} ${BRANCHES[i+2]}时`}]);
        return bot.sendMessage(c, `✅ ${s.yr}年${s.mo}月${d}日\n第四步：选择时辰`, { reply_markup:{keyboard:kb, one_time_keyboard:true, resize_keyboard:true} });
      }
      // ── hour ──
      if (s.step === 'hr') {
        const m = text.match(/^(\d{1,2})/);
        if (!m) return bot.sendMessage(c, '❌ 请点击按钮选择：');
        const h = parseInt(m[1]);
        if (h<0||h>11) return bot.sendMessage(c, '❌ 时辰无效：');
        s.hr = h; s.step = 'gen';
        return bot.sendMessage(c, `✅ ${BRANCHES[h]}时\n第五步：选择性别`, { reply_markup:{keyboard:[[{text:'👨 男命'},{text:'👩 女命'}]], one_time_keyboard:true, resize_keyboard:true} });
      }
      // ── gender → 生成 ──
      if (s.step === 'gen') {
        const g = text.includes('男') ? 'male' : text.includes('女') ? 'female' : null;
        if (!g) return bot.sendMessage(c, '❌ 请选择性别：');
        await bot.sendMessage(c, '⏳ 计算中...', { reply_markup:{remove_keyboard:true} });
        const r = s.topic === 'zw'
          ? genZW(s.yr, s.mo, s.dy, s.hr, g)
          : genBaZi(s.yr, s.mo, s.dy, s.hr, g);
        await bot.sendMessage(c, r, { parse_mode:'Markdown' });
        resetSess(c);
      }
    }
  } catch(e) {
    bot.sendMessage(c, `❌ 出错：${e.message}\n/help 查看帮助`);
    resetSess(c);
  }
});

// ── 优雅退出 ──
process.on('SIGINT', () => { console.log('👋 停止'); bot.stopPolling(); process.exit(0); });
process.on('SIGTERM', () => { bot.stopPolling(); process.exit(0); });
