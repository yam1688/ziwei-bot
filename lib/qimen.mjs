// 奇门遁甲模块 - 全面防御版
import { generateChartByDatetime, chartToJSON } from 'qimen-dunjia';

export function genQiMen(year, month, day, hour, method = 'chaiBu') {
  return genQiMenData(year, month, day, hour, method).text;
}

export function genQiMenData(year, month, day, hour, method = 'chaiBu') {
  try {
    // 构建日期字符串
    const y = Number(year) || new Date().getFullYear();
    const m = String(Number(month) || 1).padStart(2,'0');
    const d = String(Number(day) || 1).padStart(2,'0');
    const h = String(Number(hour) || 0).padStart(2,'0');
    const dt = `${y}${m}${d}${h}`;
    
    if (dt.length !== 10) {
      return { text: '❌ 日期格式错误', data: {} };
    }

    // 生成奇门盘
    const chart = generateChartByDatetime(dt, method);
    if (!chart || !(chart instanceof Map)) {
      return { text: '❌ 无法生成奇门盘', data: {} };
    }

    // 转 JSON
    const json = chartToJSON(chart);
    if (!json || json === '{}') {
      return { text: '❌ 奇门盘数据为空', data: {} };
    }

    // 解析为对象
    const obj = JSON.parse(json);
    
    // 安全取值
    const safe = (key, fallback = '') => {
      const v = obj[key];
      return (v !== null && v !== undefined) ? String(v) : fallback;
    };
    const safeArr = (key, fallback = []) => {
      const v = obj[key];
      return Array.isArray(v) ? v : fallback;
    };

    // 构建输出文本
    let r = `🪐 **奇门遁甲** ${y}年${m}月${d}日 ${h}时\n`;
    r += `━━━━━━━━━━━━━━\n`;
    r += `四柱：${safe('年柱')} ${safe('月柱')} ${safe('日柱')} ${safe('時柱') || safe('时柱')}\n`;
    r += `阴阳：${safe('陰陽') || safe('阴阳')}遁  局数：${safe('局數') || safe('局数')}\n`;
    r += `值符：${safe('值符')}  值使：${safe('值使')}\n`;
    r += `符落：${safe('值符落宮') || safe('值符落宫')}  使落：${safe('值使落宮') || safe('值使落宫')}\n\n`;

    // 九宫盘
    r += `🏯 **九宫盘**\n`;
    const dirs = safeArr('方位');
    const diPan = safeArr('地盤') || safeArr('地盘');
    const tianPan = safeArr('天盤') || safeArr('天盘');
    const diMen = safeArr('地門') || safeArr('地门');
    const jiuXing = safeArr('九星');
    const baShen = safeArr('八神');
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      const parts = [
        (dirs[i] || '') + '宫：' + (diPan[i] || ''),
      ];
      const tp = tianPan[i];
      if (tp && tp !== diPan[i]) parts.push('→' + tp);
      if (diMen[i]) parts.push(' ' + diMen[i]);
      if (jiuXing[i]) parts.push(' ' + jiuXing[i]);
      if (baShen[i]) parts.push(' ' + baShen[i]);
      r += '  ' + parts.join('') + '\n';
    }
    
    // 八门吉凶（仅当有数据时）
    try {
      const baMenArr = safeArr('地門') || safeArr('天門');
      const baMenMean = getBaMenMeanings(baMenArr);
      if (baMenMean) r += `\n📖 **八门吉凶**\n${baMenMean}`;
    } catch(e) { /* skip */ }

    // 九星吉凶
    try {
      const jxMean = getJiuXingMeanings(jiuXing);
      if (jxMean) r += `\n📖 **九星吉凶**\n${jxMean}`;
    } catch(e) { /* skip */ }

    // 简化解盘
    r += `\n📖 **解盘**\n`;
    const zhiShi = safe('值使');
    const yinYang = safe('陰陽') || safe('阴阳');
    const ju = safe('局數') || safe('局数');
    r += `  此时为${yinYang}遁${ju}局。值使${zhiShi}主事。`;
    if (zhiShi.includes('开') || zhiShi.includes('休') || zhiShi.includes('生')) {
      r += '值使为吉门，百事可为。';
    } else if (zhiShi.includes('死') || zhiShi.includes('惊') || zhiShi.includes('伤')) {
      r += '值使为凶门，宜静不宜动。';
    } else {
      r += '值使为中平，审时度势。';
    }

    // 返回安全的数据对象
    const safeData = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        safeData[k] = v;
      } else if (Array.isArray(v)) {
        safeData[k] = v.map(item => String(item));
      }
    }
    
    return { text: r, data: safeData };

  } catch(e) {
    // 任何异常都返回友好的错误信息
    return { 
      text: `❌ 奇门遁甲排盘失败，请稍后再试。\n错误：${e.message}`, 
      data: {} 
    };
  }
}

const BA_MEN_MEANING = {
  '休門':'吉·休养生息', '生門':'大吉·生机勃勃',
  '傷門':'凶·损伤争斗', '杜門':'平·杜塞不通',
  '景門':'平·文书信息', '死門':'大凶·死丧停滞',
  '驚門':'凶·惊慌诉讼', '開門':'大吉·万事亨通',
};

const JIU_XING_MEANING = {
  '天蓬':'大凶·盗贼', '天芮':'凶·疾病', '天沖':'凶·冲动',
  '天輔':'吉·文教', '天禽':'大吉·中正', '天心':'吉·谋略',
  '天柱':'凶·口舌', '天任':'吉·勤劳', '天英':'凶·虚荣',
};

function getBaMenMeanings(men) {
  if (!Array.isArray(men) || !men.length) return '';
  const seen = new Set();
  let r = '';
  for (const m of men) {
    if (!m || seen.has(m)) continue;
    seen.add(m);
    const info = BA_MEN_MEANING[m];
    if (info) r += `  ${m}：${info}\n`;
  }
  return r;
}

function getJiuXingMeanings(stars) {
  if (!Array.isArray(stars) || !stars.length) return '';
  const seen = new Set();
  let r = '';
  for (const s of stars) {
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const info = JIU_XING_MEANING[s];
    if (info) r += `  ${s}：${info}\n`;
  }
  return r;
}
