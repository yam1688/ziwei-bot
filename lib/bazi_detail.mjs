// 八字神煞 + 刑冲合害 + 三合六合 详解

// 地支关系表
const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 地支六合
const LIU_HE = { '子':'丑','丑':'子','寅':'亥','卯':'戌','辰':'酉','巳':'申','亥':'寅','戌':'卯','酉':'辰','申':'巳','午':'未','未':'午' };

// 地支三合
const SAN_HE = {
  '申':['子','辰'], '子':['申','辰'], '辰':['申','子'],
  '亥':['卯','未'], '卯':['亥','未'], '未':['亥','卯'],
  '寅':['午','戌'], '午':['寅','戌'], '戌':['寅','午'],
  '巳':['酉','丑'], '酉':['巳','丑'], '丑':['巳','酉'],
};

// 地支六冲
const LIU_CHONG = { '子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅',
  '卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳' };

// 地支六害
const LIU_HAI = { '子':'未','未':'子','丑':'午','午':'丑','寅':'巳','巳':'寅',
  '卯':'辰','辰':'卯','申':'亥','亥':'申','酉':'戌','戌':'酉' };

// 地支三刑
const SAN_XING = { '寅':'巳','巳':'申','申':'寅', '丑':'戌','戌':'未','未':'丑',
  '子':'卯','卯':'子' };

// 神煞查表（年支/日支 → 神煞方位）
const SHEN_SHA = {
  '天乙贵人': { '甲':['丑','未'],'乙':['子','申'],'丙':['亥','酉'],'丁':['亥','酉'],
    '戊':['丑','未'],'己':['子','申'],'庚':['丑','未'],'辛':['午','寅'],
    '壬':['巳','卯'],'癸':['巳','卯'] },
  '桃花': { '寅':'卯','卯':'子','辰':'酉','巳':'午','午':'卯','未':'子',
    '申':'酉','酉':'午','戌':'卯','亥':'子','子':'酉','丑':'午' },
  '华盖': { '寅':'戌','卯':'未','辰':'辰','巳':'丑','午':'戌','未':'未',
    '申':'辰','酉':'丑','戌':'戌','亥':'未','子':'辰','丑':'丑' },
  '劫煞': { '寅':'巳','卯':'申','辰':'亥','巳':'寅','午':'巳','未':'申',
    '申':'亥','酉':'寅','戌':'巳','亥':'申','子':'亥','丑':'寅' },
  '孤辰': { '寅':'巳','卯':'巳','辰':'巳','巳':'申','午':'申','未':'申',
    '申':'亥','酉':'亥','戌':'亥','亥':'寅','子':'寅','丑':'寅' },
  '寡宿': { '寅':'丑','卯':'丑','辰':'丑','巳':'辰','午':'辰','未':'辰',
    '申':'未','酉':'未','戌':'未','亥':'戌','子':'戌','丑':'戌' },
};

// 提取四柱地支
function getFourZhis(ec) {
  return [
    ec.getYearZhi ? ec.getYearZhi() : '',
    ec.getMonthZhi ? ec.getMonthZhi() : '',
    ec.getDayZhi ? ec.getDayZhi() : '',
    ec.getTimeZhi ? ec.getTimeZhi() : '',
  ];
}

// 分析地支关系
export function getDiZhiRelations(ec) {
  const zhis = getFourZhis(ec);
  const labels = ['年','月','日','时'];
  let r = `🔗 **地支关系**\n`;

  // 冲
  const chong = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      if (LIU_CHONG[zhis[i]] === zhis[j]) {
        chong.push(`${labels[i]}${zhis[i]}冲${labels[j]}${zhis[j]}`);
      }
    }
  }
  if (chong.length) r += `  冲：${chong.join('、')}\n`;
  else r += `  冲：无\n`;

  // 合
  const he = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      if (LIU_HE[zhis[i]] === zhis[j]) {
        he.push(`${labels[i]}${zhis[i]}合${labels[j]}${zhis[j]}`);
      }
    }
  }
  if (he.length) r += `  合：${he.join('、')}\n`;
  else r += `  合：无\n`;

  // 害
  const hai = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      if (LIU_HAI[zhis[i]] === zhis[j]) {
        hai.push(`${labels[i]}${zhis[i]}害${labels[j]}${zhis[j]}`);
      }
    }
  }
  if (hai.length) r += `  害：${hai.join('、')}\n`;

  // 刑
  const xing = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      if (SAN_XING[zhis[i]] === zhis[j]) {
        xing.push(`${labels[i]}${zhis[i]}刑${labels[j]}${zhis[j]}`);
      }
    }
  }
  if (xing.length) r += `  刑：${xing.join('、')}\n`;

  // 三合
  const sanhe = [];
  for (let i = 0; i < 4; i++) {
    const partners = SAN_HE[zhis[i]];
    if (partners) {
      for (let j = i+1; j < 4; j++) {
        if (partners.includes(zhis[j])) {
          sanhe.push(`${labels[i]}${zhis[i]}三合${labels[j]}${zhis[j]}`);
        }
      }
    }
  }
  if (sanhe.length) r += `  三合：${sanhe.join('、')}\n`;

  return r + '\n';
}

// 分析神煞
export function getShenSha(ec) {
  const yearGan = ec.getYearGan ? ec.getYearGan() : '';
  const yearZhi = ec.getYearZhi ? ec.getYearZhi() : '';
  const dayGan = ec.getDayGan ? ec.getDayGan() : '';
  let r = `🙏 **神煞**\n`;

  for (const [name, table] of Object.entries(SHEN_SHA)) {
    // 按年干查
    let found = table[yearGan];
    if (found) {
      const pos = Array.isArray(found) ? found.join('、') : found;
      r += `  ${name}：${pos}\n`;
    }
    // 按日干查（桃花特例按年支查）
    if (name === '桃花') {
      const tao = table[yearZhi];
      if (tao) r = r.replace(`${name}：`, `${name}(年)：${tao} `);
    }
  }

  return r + '\n';
}
