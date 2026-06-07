// 六爻纳甲模块
import { 
  decodePan, numberArrayQiGua, getGuaName, getHuGua, getZhiGua,
  getMovingYaoPositions, GUA_DESCRIPTIONS, LIU_QIN, LIU_SHOU
} from 'iching-shifa';

const GUA_NAMES = [
  '乾为天','天泽履','天火同人','天雷无妄','天风姤','天水讼','天山遁','天地否',
  '泽天夬','兑为泽','泽火革','泽雷随','泽风大过','泽水困','泽山咸','地泽临',
  '火天大有','火泽睽','离为火','火雷噬嗑','火风鼎','火水未济','火山旅','火地晋',
  '雷天大壮','雷泽归妹','雷火丰','震为雷','雷风恒','雷水解','雷山小过','雷地豫',
  '风天小畜','风泽中孚','风火家人','风雷益','巽为风','风水涣','风山渐','风地观',
  '水天需','水泽节','水火既济','水雷屯','风水井','坎为水','水山蹇','水地比',
  '山天大畜','山泽损','山火贲','山雷颐','山风蛊','山水蒙','艮为山','山地剥',
  '地天泰','地泽临','地火明夷','地雷复','地风升','地水师','地山谦','坤为地',
];

export function genLiuYao() {
  // 使用数字起卦（3个随机数1-10）
  const nums = [Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1];
  const yaoStr = numberArrayQiGua(nums);
  const lines = yaoStr.split('').map(c => parseInt(c));
  
  // 本卦
  let benGua;
  try {
    benGua = decodePan(yaoStr, { year: 2026, month: 6, day: 8, hour: 10 });
  } catch(e) {
    benGua = { hexagram: '?', name: '未知' };
  }

  const guaName = getGuaName ? getGuaName(yaoStr) : benGua?.name || '?';
  const huGua = getHuGua ? getHuGua(yaoStr) : null;
  const bienGua = getZhiGua ? getZhiGua(yaoStr) : null;
  const moving = getMovingYaoPositions ? getMovingYaoPositions(yaoStr) : [];

  let r = `☯ **六爻纳甲**\n━━━━━━━━━━━━━━\n`;
  r += `起卦：${nums.join(',')} → ${yaoStr}\n\n`;

  // 画爻
  r += `**爻象**（从下到上）\n`;
  for (let i = 5; i >= 0; i--) {
    const num = lines[i];
    const isY = num >= 7;
    const isM = num === 6 || num === 9;
    const mark = isM ? ' ⚡' : '';
    r += `  ${isY ? '———' : '— —'}  ${num}${mark}\n`;
  }
  r += '\n';

  r += `**本卦**：${guaName}\n`;
  if (huGua) r += `**互卦**：${typeof huGua === 'string' ? huGua : huGua.name || ''}\n`;
  if (bienGua) r += `**变卦**：${typeof bienGua === 'string' ? bienGua : bienGua.name || ''}\n`;
  if (moving.length) r += `**动爻**：${moving.join('、')}\n`;
  r += '\n';

  // 卦辞
  const desc = typeof guaName === 'string' ? GUA_DESCRIPTIONS[guaName] : null;
  if (desc) {
    r += `📜 **卦辞**\n  ${desc['0'] || ''}\n\n`;
    if (moving.length) {
      for (const pos of moving) {
        const yaoKey = String(pos);
        if (desc[yaoKey]) {
          const yaoNames = ['初','二','三','四','五','上'];
          r += `  ${yaoNames[parseInt(pos)-1]}爻：${desc[yaoKey]}\n`;
        }
      }
      r += '\n';
    }
  }

  r += `📖 **解盘**\n`;
  r += interpLiuYao(guaName, moving);
  return r;
}

function interpLiuYao(guaName, moving) {
  const goodGua = ['乾','坤','泰','谦','豫','同人','大有','既济'];
  const badGua = ['否','剥','坎','困','未济','明夷','大过'];
  
  let s = '';
  let isGood = goodGua.some(g => guaName?.includes(g));
  let isBad = badGua.some(g => guaName?.includes(g));
  
  if (isGood && !isBad) s += '此卦吉，主顺遂如意。';
  else if (isBad && !isGood) s += '此卦凶，主艰难阻滞。';
  else s += '此卦平，吉凶参半。';
  
  if (moving.length === 0) s += '六爻不动，宜守不宜攻。';
  else if (moving.length === 1) s += `事有转机，关注${moving[0]}爻变化。`;
  else s += `${moving.length}爻动，变化较多，宜多方考量。`;
  
  return s;
}
