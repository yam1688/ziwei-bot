// 紫微流年盘模块 — 全面增强版
import { astro } from 'iztro';
const B = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

export function genLiuNian(birthYear, birthMonth, birthDay, birthHour, gender, targetYear) {
  const g = gender === 'male' ? '男' : '女';
  const a = astro.bySolar(`${birthYear}-${birthMonth}-${birthDay}`, birthHour, g, true, 'zh-CN');
  const h = a.horoscope(targetYear);

  let r = `📅 **${targetYear}年流年命盘**\n━━━━━━━━━━━━━━\n`;
  r += `本命：${birthYear}年${birthMonth}月${birthDay}日 ${B[birthHour]}时 ${g}命\n`;
  r += `流年：${h.solarDate || targetYear}\n`;

  // 流年天干地支
  if (h.yearly) {
    r += `\n**流年干支**：${h.yearly.ganZhi || ''}\n`;
    r += `**流年四化**：${(h.yearly.mutagen || []).join('、')}\n`;
  }

  // 流年命宫
  if (h.palace) {
    r += `\n**流年命宫**：${h.palace}\n`;
  }

  // 流年十二宫
  const liunianPalaces = h.palaces || h.palaceArray || [];
  if (liunianPalaces.length > 0) {
    r += `\n**流年十二宫**\n`;
    for (const p of liunianPalaces) {
      const stars = [];
      if (p.majorStars) stars.push(...p.majorStars.map(s => s.name));
      if (p.minorStars) stars.push(...p.minorStars.map(s => s.name));
      if (stars.length) r += `  ${p.name}：${stars.join('、')}\n`;
    }
  }

  // 流年特殊格局
  r += `\n**流年格局**\n`;
  const allStars = [];
  if (Array.isArray(liunianPalaces)) {
    for (const p of liunianPalaces) {
      if (p.majorStars) allStars.push(...p.majorStars.map(s => s.name));
      if (p.minorStars) allStars.push(...p.minorStars.map(s => s.name));
    }
  }
  if (allStars.filter(s => ['七杀','破军','贪狼'].includes(s)).length >= 2) {
    r += `  流年杀破狼格局，变动之年，宜主动求变。\n`;
  }
  if (allStars.some(s => ['左辅','右弼','天魁','天钺','文昌','文曲'].includes(s))) {
    r += `  流年有吉星辅佐，贵人运佳。\n`;
  }
  if (allStars.some(s => ['擎羊','陀罗','火星','铃星','地空','地劫'].includes(s))) {
    r += `  流年煞星入局，注意是非与破财。\n`;
  }

  // 大限信息
  if (h.decadal) {
    r += `\n**当前大限**\n`;
    r += `  大限干支：${h.decadal.heavenlyStem || ''}${h.decadal.earthlyBranch || ''}\n`;
    r += `  大限四化：${(h.decadal.mutagen || []).join('、')}\n`;
  }

  r += `\n━━━━━━━━━━━━━━\n`;
  r += `/zw ${birthYear} ${birthMonth} ${birthDay} ${birthHour} ${gender} 看本命盘`;
  return r;
}
