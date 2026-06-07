// 奇门遁甲模块
import { generateChartByDatetime, chartToJSON, chartToObject } from 'qimen-dunjia';

export function genQiMen(year, month, day, hour, method = 'chaiBu') {
  const { text, data } = genQiMenData(year, month, day, hour, method);
  return text;
}

export function genQiMenData(year, month, day, hour, method = 'chaiBu') {
  const dt = `${year}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}${String(hour).padStart(2,'0')}`;
  const chart = generateChartByDatetime(dt, method);
  const obj = JSON.parse(chartToJSON(chart));

  let r = `🪐 **奇门遁甲** ${year}年${month}月${day}日 ${hour}时\n━━━━━━━━━━━━━━\n`;
  r += `四柱：${obj['年柱']} ${obj['月柱']} ${obj['日柱']} ${obj['时柱']}\n`;
  r += `阴阳：${obj['陰陽'] || obj['阴阳']}遁  局数：${obj['局數'] || obj['局数']}\n`;
  r += `值符：${obj['值符']}  值使：${obj['值使']}\n`;
  r += `符落：${obj['值符落宮'] || obj['值符落宫']}  使落：${obj['值使落宮'] || obj['值使落宫']}\n\n`;

  // 九宫盘
  r += `🏯 **九宫盘**\n`;
  const dirs = obj['方位'] || [];
  const stars = obj['九宮'] || obj['九宫'] || [];
  const diPan = obj['地盤'] || obj['地盘'] || [];
  const diMen = obj['地門'] || obj['地门'] || [];
  const tianPan = obj['天盤'] || obj['天盘'] || [];
  const baMen = obj['八門'] || obj['八门'] || [];
  const jiuXing = obj['九星'] || [];
  const baShen = obj['八神'] || [];

  // 九宫格输出（简版）
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue; // 中宫
    const dir = dirs[i] || '';
    const s = stars[i] || '';
    const d = diPan[i] || '';
    const m = diMen[i] || '';
    const t = tianPan[i] || '';
    const bm = baMen[i] || '';
    const jx = jiuXing[i] || '';
    const bs = baShen[i] || '';
    r += `  ${dir}宫：${d}`;
    if (t && t !== d) r += `→${t}`;
    if (bm) r += ` ${bm}`;
    if (jx) r += ` ${jx}`;
    if (bs) r += ` ${bs}`;
    r += '\n';
  }

  r += `\n📖 **解盘**\n`;
  r += interpQiMen(obj);
  return { text: r, data: obj };
}

function interpQiMen(obj) {
  const zhiFu = obj['值符'] || '';
  const zhiShi = obj['值使'] || '';
  const ju = obj['局數'] || obj['局数'] || '';
  const yinYang = obj['陰陽'] || obj['阴阳'] || '';

  let s = `  此时为${yinYang}遁${ju}局。`;
  s += `值符${zhiFu}当班，值使${zhiShi}主事。`;
  if (zhiShi.includes('开') || zhiShi.includes('休') || zhiShi.includes('生')) {
    s += '值使为吉门，百事可为。';
  } else if (zhiShi.includes('死') || zhiShi.includes('惊') || zhiShi.includes('伤')) {
    s += '值使为凶门，宜静不宜动。';
  } else {
    s += '值使为中平之门，审时度势而行。';
  }
  return s;
}
