// 紫微斗数格局识别（精选核心格局）
import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';
// 常量由 bot.mjs 统一管理，本模块不重复定义

const SHA = ['擎羊','陀罗','火星','铃星','地空','地劫'];
const ZUO_YOU = ['左辅','右弼'];
const CHANG_QU = ['文昌','文曲'];
const KUI_YUE = ['天魁','天钺'];

// 核心格局库
const PATTERNS = [
  {
    name: '紫府同宫格',
    level: 'excellent',
    desc: '紫微天府同守命宫，帝王+财库组合，格局极高。主大富大贵，文武双全。',
    check: (m) => m.includes('紫微') && m.includes('天府'),
    source: '《紫微斗数全书》'
  },
  {
    name: '日月并明格',
    level: 'excellent',
    desc: '太阳太阴同守或对照命宫，日月光明。主贵气显达，名利双收。',
    check: (m, c) => {
      const sun = m.includes('太阳');
      const moon = m.includes('太阴');
      if (sun && moon) return true;
      // Check opposite palace
      if (!c) return false;
      const opp = c.filter(s => s.type === 'major').map(s => s.name);
      return (m.includes('太阳') && opp.includes('太阴')) || (m.includes('太阴') && opp.includes('太阳'));
    },
    source: '《骨髓赋》'
  },
  {
    name: '七杀朝斗格',
    level: 'good',
    desc: '七杀坐命宫，在寅申宫独坐，对宫有紫微。主大器晚成，威权显赫。',
    check: (m, c, b) => m.includes('七杀') && (b === 2 || b === 8),
    source: '《全书》'
  },
  {
    name: '紫微朝垣格',
    level: 'excellent',
    desc: '紫微坐命，三合有左辅右弼、文昌文曲。君臣庆会，贵不可言。',
    check: (m, c, b, s) => m.includes('紫微') && s.filter(n => ZUO_YOU.includes(n) || CHANG_QU.includes(n)).length >= 2,
  },
  {
    name: '府相朝垣格',
    level: 'good',
    desc: '命宫天府，官禄宫天相。府相得地，主富贵双全。',
    check: (m, c, b, s, palaces) => {
      if (!palaces) return false;
      const ming = palaces.find(p => p.name === '命宫');
      const guan = palaces.find(p => p.name === '官禄宫');
      return ming?.stars.some(s => s.name === '天府') && guan?.stars.some(s => s.name === '天相');
    },
  },
  {
    name: '杀破狼格',
    level: 'neutral',
    desc: '命宫七杀、破军、贪狼之一，三合会齐杀破狼。主变动大，一生多波折但能成大业。',
    check: (m, c, b, s) => s.filter(n => ['七杀','破军','贪狼'].includes(n)).length >= 2,
  },
  {
    name: '机月同梁格',
    level: 'good',
    desc: '天机、太阴（月）、天同、天梁会照命宫。主智慧才艺，适合公职、教育。',
    check: (m, c, b, s) => s.filter(n => ['天机','太阴','天同','天梁'].includes(n)).length >= 3,
  },
  {
    name: '阳梁昌禄格',
    level: 'excellent',
    desc: '太阳、天梁、文昌、禄存会照。主考试第一，官贵显达。',
    check: (m, c, b, s) => ['太阳','天梁'].every(n => s.includes(n)) && s.some(n => n === '文昌' || n === '禄存'),
  },
  {
    name: '火贪格/铃贪格',
    level: 'caution',
    desc: '贪狼会火星或铃星。爆发之格，暴发暴败，大起大落。',
    check: (m, c, b, s) => s.includes('贪狼') && s.some(n => n === '火星' || n === '铃星'),
  },
  {
    name: '巨火擎羊格',
    level: 'caution',
    desc: '巨门、火星、擎羊会照命宫。主是非官非，一生多灾。',
    check: (m, c, b, s) => s.includes('巨门') && s.includes('火星') && s.includes('擎羊'),
  },
  {
    name: '天巫格',
    level: 'good',
    desc: '天机+天梁守命，加会昌曲。主智慧超群，学术有成。',
    check: (m, c, b, s) => m.includes('天机') && s.includes('天梁') && s.some(n => CHANG_QU.includes(n)),
  },
  {
    name: '廉贞七杀格',
    level: 'caution',
    desc: '廉贞七杀同守命宫。刑囚夹印，主牢狱官非。',
    check: (m, c, b, s) => m.includes('廉贞') && m.includes('七杀'),
  },
  {
    name: '武曲天相格',
    level: 'good',
    desc: '武曲天相同守命宫。刚毅掌权，适合军警金融。',
    check: (m, c, b, s) => m.includes('武曲') && m.includes('天相'),
  },
  {
    name: '天同太阴格',
    level: 'good',
    desc: '天同太阴同守命宫。温和文雅，福泽深厚。',
    check: (m, c, b, s) => m.includes('天同') && m.includes('太阴'),
  },
  {
    name: '空宫借星格',
    level: 'neutral',
    desc: '命宫无主星，借对宫星曜。一生受环境影响大，易被他人左右。',
    check: (m, c, b, s, p, palaces) => {
      if (!palaces) return false;
      const ming = palaces.find(p => p.name === '命宫');
      return ming?.stars.filter(s => s.type === 'major').length === 0;
    },
  },
];

// 归一化：iztro 用 majorStars/minorStars，本模块用 stars
function normalizePalaces(palaces) {
  return palaces.map(p => {
    if (p.stars) return p; // 已经是统一格式
    return {
      ...p,
      stars: [
        ...(p.majorStars || []).map(s => ({ ...s, type: s.type || 'major' })),
        ...(p.minorStars || []).map(s => ({ ...s, type: s.type || 'minor' })),
      ],
    };
  });
}

export function detectPatterns(rawPalaces) {
  if (!rawPalaces) return [];
  const palaces = normalizePalaces(rawPalaces);
  const ming = palaces.find(p => p.name === '命宫');
  if (!ming) return [];
  const majorNames = ming.stars.filter(s => s.type === 'major').map(s => s.name);
  const allStarNames = palaces.flatMap(p => p.stars.map(s => s.name));
  
  const found = [];
  for (const p of PATTERNS) {
    try {
      if (p.check(majorNames, allStarNames, ming.branch, allStarNames, palaces)) {
        found.push(p);
      }
    } catch(e) { /* skip pattern if check fails */ }
  }
  return found;
}

export function getSanFangAnalysis(rawPalaces) {
  if (!rawPalaces) return '';
  const palaces = normalizePalaces(rawPalaces);
  const ming = palaces.find(p => p.name === '命宫');
  const caiBo = palaces.find(p => p.name === '财帛宫');
  const guanLu = palaces.find(p => p.name === '官禄宫');
  const qianYi = palaces.find(p => p.name === '迁移宫');
  
  let r = `**三方四正**\n`;
  r += `  命宫：${ming?.stars.filter(s=>s.type==='major').map(s=>s.name).join('、') || '空宫'}\n`;
  r += `  财帛：${caiBo?.stars.filter(s=>s.type==='major').map(s=>s.name).join('、') || '空宫'}\n`;
  r += `  官禄：${guanLu?.stars.filter(s=>s.type==='major').map(s=>s.name).join('、') || '空宫'}\n`;
  r += `  迁移：${qianYi?.stars.filter(s=>s.type==='major').map(s=>s.name).join('、') || '空宫'}\n`;
  return r;
}

export function getStarBrightnessTable(rawPalaces) {
  if (!rawPalaces) return '';
  const palaces = normalizePalaces(rawPalaces);
  let r = `**星曜亮度**\n`;
  for (const p of palaces) {
    for (const s of p.stars) {
      if (s.type !== 'major') continue;
      const bMap = { 'bright': '🌟庙旺', 'normal': '⭐平', 'dim': '🌑陷' };
      r += `  ${s.name}：${bMap[s.brightness] || '⭐平'}（${p.name}）\n`;
    }
  }
  return r;
}

export function getCareerSuggestion(rawPalaces) {
  if (!rawPalaces) return '';
  const palaces = normalizePalaces(rawPalaces);
  const ming = palaces.find(p => p.name === '命宫');
  const allStars = ming?.stars.map(s => s.name) || [];
  
  const careerMap = {
    '紫微': '管理、领导、政界', '天机': '策划、教育、科技',
    '太阳': '公关、公益、传媒', '武曲': '金融、军警、工程',
    '天同': '服务、文化、养生', '廉贞': '艺术、设计、演艺',
    '天府': '财务、仓储、管理', '太阴': '房地产、美容、文艺',
    '贪狼': '娱乐、销售、外交', '巨门': '法律、教育、传播',
    '天相': '行政、秘书、协调', '天梁': '医疗、宗教、慈善',
    '七杀': '军警、体育、创业', '破军': '工程、改造、冒险',
  };
  
  let r = `**适合职业**\n`;
  const majors = ming?.stars.filter(s => s.type === 'major') || [];
  const careers = majors.map(s => careerMap[s.name]).filter(Boolean);
  if (careers.length) {
    r += `  ${careers.join('、')}\n`;
  } else {
    r += `  命宫无主星，借对宫星曜定职业方向\n`;
  }
  return r;
}
