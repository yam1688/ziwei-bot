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

  r += `\n📖 **八门吉凶**\n${getBaMenMeanings(baMen)}\n`;
  r += `📖 **九星吉凶**\n${getJiuXingMeanings(jiuXing)}\n`;
  r += `📖 **解盘**\n`;
  r += interpQiMen(obj);
  return { text: r, data: obj };
}

const BA_MEN_MEANING = {
  '休門':'吉·休养生息·求财婚姻', '生門':'大吉·生机勃勃·求财创业',
  '傷門':'凶·损伤争斗·追捕博弈', '杜門':'平·杜塞不通·隐匿藏形',
  '景門':'平·景色虚华·文书信息', '死門':'大凶·死丧停滞·绝处逢生',
  '驚門':'凶·惊慌恐惧·诉讼口舌', '開門':'大吉·万事亨通·求官求职',
};

const JIU_XING_MEANING = {
  '天蓬':'大凶·盗贼破财', '天芮':'凶·疾病交加', '天沖':'凶·冲动破败',
  '天輔':'吉·辅佐文化', '天禽':'大吉·中正平和', '天心':'吉·心计谋略',
  '天柱':'凶·毁败口舌', '天任':'吉·任劳任怨', '天英':'凶·虚荣火爆',
};

const BA_SHEN_MEANING = {
  '值符':'大吉·鬼神庇护', '滕蛇':'凶·虚惊缠绕', '太陰':'吉·暗中贵人',
  '六合':'大吉·合和喜庆', '勾陳':'凶·争讼拖延', '朱雀':'凶·口舌是非',
  '九地':'平·缓慢守成', '九天':'大吉·高飞远举',
};

function getBaMenMeanings(men) {
  if (!men || !men.length) return '';
  const present = [...new Set(men.filter(Boolean))];
  let r = '';
  for (const m of present) {
    const info = BA_MEN_MEANING[m] || '';
    r += `  ${m}：${info}\n`;
  }
  return r;
}

function getJiuXingMeanings(stars) {
  if (!stars || !stars.length) return '';
  const present = [...new Set(stars.filter(Boolean))];
  let r = '';
  for (const s of present) {
    const info = JIU_XING_MEANING[s] || '';
    r += `  ${s}：${info}\n`;
  }
  return r;
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
