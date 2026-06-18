// 紫微流年盘模块
import { astro } from 'iztro';
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const B = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

export function genLiuNian(birthYear, birthMonth, birthDay, birthHour, gender, targetYear) {
  const g = gender === 'male' ? '男' : '女';
  const a = astro.bySolar(`${birthYear}-${birthMonth}-${birthDay}`, birthHour, g, true, 'zh-CN');
  const h = a.horoscope(targetYear);
  
  let r = `📅 **${targetYear}年流年命盘**\n`;
  r += `━━━━━━━━━━━━━━\n`;
  r += `本命：${birthYear}年${birthMonth}月${birthDay}日 ${B[birthHour]}时 ${g}命\n`;
  r += `流年：${h.solarDate || targetYear}\n`;
  
  // 流年天干地支
  if (h.yearly) {
    r += `流年干支：${h.yearly.ganZhi || ''}\n`;
    r += `流年四化：${(h.yearly.mutagen || []).join('、')}\n`;
  }
  
  // 流年命宫
  if (h.palace) {
    r += `\n**流年命宫**：${h.palace}\n`;
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
