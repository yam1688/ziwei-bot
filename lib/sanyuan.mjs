// 三元九运详细解读模块
// 三元 = 上元·中元·下元（各60年）
// 九运 = 一白→九紫（各20年）

const SAN_YUAN = {
  '上元': { years: '1864-1923', desc: '一运1864-1883 坎水 · 二运1884-1903 坤土 · 三运1904-1923 震木' },
  '中元': { years: '1924-1983', desc: '四运1924-1943 巽木 · 五运1944-1963 中土 · 六运1964-1983 乾金' },
  '下元': { years: '1984-2043', desc: '七运1984-2003 兑金 · 八运2004-2023 艮土 · 九运2024-2043 离火' },
};

const JIU_YUN = [
  { num: '一', name: '一白', star: '贪狼', element: '水', color: '白', period: '1864-1883', 
    trigram: '坎', direction: '北', fortune: '吉', domain: '中男·江湖·漂泊·智谋' },
  { num: '二', name: '二黑', star: '巨门', element: '土', color: '黑', period: '1884-1903',
    trigram: '坤', direction: '西南', fortune: '凶', domain: '老母·疾病·田宅·地产' },
  { num: '三', name: '三碧', star: '禄存', element: '木', color: '碧', period: '1904-1923',
    trigram: '震', direction: '东', fortune: '凶', domain: '长男·争斗·官司·工业' },
  { num: '四', name: '四绿', star: '文曲', element: '木', color: '绿', period: '1924-1943',
    trigram: '巽', direction: '东南', fortune: '平', domain: '长女·文教·传播·邮电' },
  { num: '五', name: '五黄', star: '廉贞', element: '土', color: '黄', period: '1944-1963',
    trigram: '中', direction: '中', fortune: '大凶', domain: '帝王·中央·权柄·灾变' },
  { num: '六', name: '六白', star: '武曲', element: '金', color: '白', period: '1964-1983',
    trigram: '乾', direction: '西北', fortune: '吉', domain: '老父·领导·军警·金融' },
  { num: '七', name: '七赤', star: '破军', element: '金', color: '赤', period: '1984-2003',
    trigram: '兑', direction: '西', fortune: '凶', domain: '少女·口才·演艺·科技' },
  { num: '八', name: '八白', star: '左辅', element: '土', color: '白', period: '2004-2023',
    trigram: '艮', direction: '东北', fortune: '吉', domain: '少男·地产·基建·矿藏' },
  { num: '九', name: '九紫', star: '右弼', element: '火', color: '紫', period: '2024-2043',
    trigram: '离', direction: '南', fortune: '吉', domain: '中女·文化·科技·能源·美丽经济' },
];

export function getSanYuanInfo() {
  const now = new Date();
  const year = now.getFullYear();
  
  // 确定当前在哪一运
  let currentYun = null;
  let currentYuan = null;
  for (const yun of JIU_YUN) {
    const [start, end] = yun.period.split('-').map(Number);
    if (year >= start && year <= end) {
      currentYun = yun;
      break;
    }
  }
  
  // 确定当前在哪一元
  for (const [yuanName, yuanInfo] of Object.entries(SAN_YUAN)) {
    const [start, end] = yuanInfo.years.split('-').map(Number);
    if (year >= start && year <= end) {
      currentYuan = { name: yuanName, ...yuanInfo };
      break;
    }
  }
  
  return { currentYun, currentYuan, year };
}

export function genSanYuanText() {
  const { currentYun, currentYuan, year } = getSanYuanInfo();
  
  let r = `☯ **三元九运详解**\n`;
  r += `━━━━━━━━━━━━━━\n\n`;
  
  // 当前三元
  r += `**三元概况**\n`;
  for (const [name, info] of Object.entries(SAN_YUAN)) {
    const isCurrent = currentYuan?.name === name;
    r += `  ${isCurrent ? '▶ ' : '  '}${name}：${info.years}\n`;
    r += `    ${info.desc}\n`;
  }
  r += '\n';
  
  // 九运详表
  r += `**九运详表**\n`;
  r += `┌────┬────┬────┬──────┬────┬──────┐\n`;
  r += `│ 运 │ 星 │ 卦 │ 方向 │ 五行 │ 吉凶 │\n`;
  r += `├────┼────┼────┼──────┼────┼──────┤\n`;
  for (const yun of JIU_YUN) {
    const mark = yun === currentYun ? '◀' : ' ';
    r += `│${yun.name}${mark}│${yun.star}│ ${yun.trigram} │  ${yun.direction}  │ ${yun.element} │ ${yun.fortune}│\n`;
  }
  r += `└────┴────┴────┴──────┴────┴──────┘\n\n`;
  
  // 当前运详细解读
  if (currentYun) {
    r += `🔥 **当前：${currentYun.name}运（${currentYun.period}）**\n\n`;
    r += genCurrentYunDetail(currentYun);
  }
  
  return r;
}

function genCurrentYunDetail(yun) {
  if (yun.num === '九') {
    return (
      `**九紫离火运（2024-2043）**\n\n` +
      `**核心卦象：** 离为火，☲ 离上离下。离者，明也，万物皆相见。\n\n` +
      `**五行属性：** 🔥 火（南方·红色·朱雀）\n\n` +
      `**利好行业：**\n` +
      `  ✅ 文化教育：传统文化复兴、国学热、职业教育\n` +
      `  ✅ 科技互联网：AI人工智能、元宇宙、虚拟现实\n` +
      `  ✅ 新能源：光伏、风电、储能、新能源汽车\n` +
      `  ✅ 美丽经济：医美、化妆、服装设计、形象管理\n` +
      `  ✅ 心理健康：心理咨询、冥想、身心灵疗愈\n` +
      `  ✅ 餐饮食品：火锅、烧烤（火性行业）\n\n` +
      `**禁忌注意：**\n` +
      `  ❌ 房地产继续承压（土被火生→泄气）\n` +
      `  ❌ 火性行业竞争激烈，易有火灾、爆炸事故\n` +
      `  ❌ 心血管疾病、眼疾高发（火对应心、目）\n` +
      `  ❌ 离为中女，中年女性社会角色剧变\n` +
      `  ❌ 火主礼，社会礼仪规范可能被打破重构\n\n` +
      `**吉方：** 南方（离卦本位）、东南（太岁方）\n` +
      `**凶方：** 西北（火克金）、正西（火克金）\n\n` +
      `**趋吉建议：**\n` +
      `  🏠 办公/住宅宜向南，多采光通风\n` +
      `  🔴 宜用红色、紫色、橙色装饰\n` +
      `  🔥 宜从事文化、科技、能源相关行业\n` +
      `  💡 火运利于品牌、IP、影响力变现\n\n` +
      `**总结：** 九紫离火运，文化产业大爆发，AI带来生产力革命，` +
      `但同时社会变革剧烈，中女（30-50岁女性）将迎来前所未有的机遇与挑战。` +
      `火主礼，也是中国传统文化复兴的二十年。`
    );
  }
  
  return `当前为${yun.name}运（${yun.period}），${yun.trigram}卦${yun.element}性，星曜${yun.star}，方向${yun.direction}。`;
}

export function genJiuYunList() {
  let r = `**九运一览**\n\n`;
  for (const yun of JIU_YUN) {
    r += `  ${yun.name}运（${yun.period}）— ${yun.star} ${yun.element} ${yun.trigram}卦 ${yun.direction}方`;
    r += `  [${yun.fortune}]\n`;
    r += `    主事：${yun.domain}\n`;
  }
  return r;
}
