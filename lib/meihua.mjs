// 梅花易数模块
import { numberArrayQiGua, getGuaName, getHuGua, getZhiGua, GUA_DESCRIPTIONS } from 'iching-shifa';

const WU_XING = { '乾':'金','兑':'金','离':'火','震':'木','巽':'木','坎':'水','艮':'土','坤':'土' };
const TI_YONG_REL = {
  '金金':'比和','金木':'相克','金水':'相生','金火':'相克','金土':'相生',
  '木木':'比和','木水':'相生','木火':'相生','木土':'相克','木金':'相克',
  '水水':'比和','水火':'相克','水土':'相克','水金':'相生','水木':'相生',
  '火火':'比和','火土':'相生','火金':'相克','火水':'相克','火木':'相生',
  '土土':'比和','土金':'相生','土水':'相克','土火':'相生','土木':'相克',
};

export function genMeiHua(method = 'number') {
  return genMeiHuaData(method).text;
}

export function genMeiHuaData(method = 'number') {
  let nums, yaoStr;
  if (method === 'number') {
    nums = [Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1];
    yaoStr = numberArrayQiGua(nums);
  } else {
    nums = [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()];
    yaoStr = numberArrayQiGua(nums);
  }

  const lines = yaoStr.split('').map(c => parseInt(c));
  const guaName = getGuaName?.(yaoStr) || '?';
  const huGua = getHuGua?.(yaoStr);
  const bienGua = getZhiGua?.(yaoStr);

  // 体用分析
  const tiYao = lines.slice(3,6); // 上三爻为体
  const yongYao = lines.slice(0,3); // 下三爻为用
  const tiGua = getGuaFromLines(tiYao);
  const yongGua = getGuaFromLines(yongYao);
  const tiName = getTrigramName(tiYao);
  const yongName = getTrigramName(yongYao);
  const rel = TI_YONG_REL[`${WU_XING[tiName]||''}${WU_XING[yongName]||''}`] || '未知';

  let r = `🌺 **梅花易数**\n━━━━━━━━━━━━━━\n`;
  r += `起卦：${nums.join(',')}\n\n`;
  r += `**本卦**：${guaName}\n`;
  if (huGua) r += `**互卦**：${typeof huGua === 'string' ? huGua : huGua.name || ''}\n`;
  if (bienGua) r += `**变卦**：${typeof bienGua === 'string' ? bienGua : bienGua.name || ''}\n\n`;

  r += `**体用生克**\n`;
  r += `  体（${tiName}${WU_XING[tiName]||''}）：${tiYao.join('')}\n`;
  r += `  用（${yongName}${WU_XING[yongName]||''}）：${yongYao.join('')}\n`;
  r += `  关系：${rel}\n\n`;

  r += `📖 **解盘**\n`;
  r += interpMeiHua(rel, guaName);
  return { text: r, data: { guaName, nums, tiName, yongName, rel } };
}

function getGuaFromLines(lines) {
  return lines.map(c => c >= 7 ? 1 : 0).join('');
}

function getTrigramName(lines) {
  const bin = lines.map(c => c >= 7 ? 1 : 0).join('');
  const num = parseInt(bin, 2);
  const map = {7:'艮',6:'坎',5:'巽',4:'震',3:'离',2:'兑',1:'乾',0:'坤'};
  return map[num] || '?';
}

function interpMeiHua(rel, guaName) {
  let s = '';
  if (rel === '比和') s += '体用比和，主事顺利，内外一致。';
  else if (rel === '相生') s += '体用相生，主吉，有贵人相助。';
  else if (rel === '相克') s += '体用相克，主凶，阻力较大。';
  else s += '体用关系不甚明朗。';

  const goodGua = ['泰','谦','豫','同人','大有','既济','小畜','复'];
  if (goodGua.some(g => guaName?.includes(g))) s += '卦象吉利。';
  return s;
}
