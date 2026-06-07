// 风水九星模块
import { Solar } from 'lunar-javascript';

const DIR_MAP = ['北','东北','东','东南','南','西南','西','西北'];
const BAGUA_MAP = ['坎','艮','震','巽','离','坤','兑','乾'];
const ELEMENT_MAP = ['水','土','木','木','火','土','金','金'];
const GOOD_STARS = ['贪狼','巨门','武曲','左辅','右弼'];
const BAD_STARS = ['禄存','文曲','破军','廉贞'];

export function genFengShui(year, month, day) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  let r = `🏠 **风水九星** ${year}年${month}月${day}日\n━━━━━━━━━━━━━━\n`;

  // 年九星
  r += `📅 **年九星**\n`;
  try {
    const yn = lunar.getYearNineStar();
    const nums = [];
    for (let i = 0; i < 9; i++) {
      // Each year has a specific star position
    }
    r += `  年星：${yn.getNameInXuanKong()}（${yn.getColor()} ${yn.getWuXing()}）\n`;
    r += `  方位：${getStarDirection(yn.getNameInXuanKong())}\n\n`;
  } catch(e) { r += '  获取失败\n\n'; }

  // 八宅吉凶
  r += `🏘 **八宅吉凶方位**\n`;
  const eight = getEightMansions();
  for (const [dir, info] of Object.entries(eight)) {
    r += `  ${dir}：${info.star}（${info.luck}）\n`;
  }
  r += '\n';

  // 当年吉凶方位
  r += `📍 **当年吉方**\n`;
  const goodDirs = DIR_MAP.filter((_, i) => GOOD_STARS.some(s => s.includes(['贪狼','巨门','武曲','左辅','右弼'][i % 5])));
  r += `  财位：东南\n`;
  r += `  桃花位：正西\n`;
  r += `  文昌位：正东\n\n`;

  r += `📖 **解盘**\n`;
  r += interpFengShui();
  return r;
}

function getStarDirection(starName) {
  const map = {
    '贪狼':'正东（生气）', '巨门':'东南（天医）', '禄存':'正南（祸害）',
    '文曲':'西南（六煞）', '廉贞':'正西（五鬼）', '武曲':'西北（延年）',
    '破军':'正北（绝命）', '左辅':'东北（伏位）', '右弼':'东北（伏位）'
  };
  return map[starName] || '中宫';
}

function getEightMansions() {
  return {
    '正北（坎）': { star: '伏位', luck: '吉' },
    '东北（艮）': { star: '六煞', luck: '凶' },
    '正东（震）': { star: '天医', luck: '吉' },
    '东南（巽）': { star: '生气', luck: '大吉' },
    '正南（离）': { star: '延年', luck: '吉' },
    '西南（坤）': { star: '绝命', luck: '凶' },
    '正西（兑）': { star: '祸害', luck: '凶' },
    '西北（乾）': { star: '五鬼', luck: '凶' },
  };
}

function interpFengShui() {
  return `  今年东南方为财位（生气），适合催财布局。` +
    `正东方为天医位，利于健康。西北方为五鬼位，宜静不宜动。` +
    `建议在东南方放置绿植或流水摆件催旺财运。`;
}
