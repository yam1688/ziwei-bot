// 紫微合盘模块 — 两人命盘对比
import { astro } from 'iztro';
const B = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

export function genHePan(p1, p2) {
  // p1/p2 = { year, month, day, hour, gender, name? }
  const a1 = astro.bySolar(`${p1.year}-${p1.month}-${p1.day}`, p1.hour, p1.gender==='male'?'男':'女', true, 'zh-CN');
  const a2 = astro.bySolar(`${p2.year}-${p2.month}-${p2.day}`, p2.hour, p2.gender==='male'?'男':'女', true, 'zh-CN');

  const n1 = p1.name || '甲方';
  const n2 = p2.name || '乙方';

  let r = `💞 **紫微合盘**\n━━━━━━━━━━━━━━\n`;

  // 基本信息
  r += `**${n1}**：${p1.year}年${p1.month}月${p1.day}日 ${B[p1.hour]}时 ${p1.gender==='male'?'男':'女'}命\n`;
  r += `**${n2}**：${p2.year}年${p2.month}月${p2.day}日 ${B[p2.hour]}时 ${p2.gender==='male'?'男':'女'}命\n\n`;

  // 命宫对比
  const m1 = a1.palaces.find(p => p.name === '命宫');
  const m2 = a2.palaces.find(p => p.name === '命宫');
  const m1Stars = (m1?.majorStars || []).map(s => s.name).join('、') || '空宫';
  const m2Stars = (m2?.majorStars || []).map(s => s.name).join('、') || '空宫';
  r += `**命宫对比**\n`;
  r += `  ${n1}：${m1Stars}（${B[m1?.branch || 0]}宫）\n`;
  r += `  ${n2}：${m2Stars}（${B[m2?.branch || 0]}宫）\n\n`;

  // 夫妻宫对比
  const fu1 = a1.palaces.find(p => p.name === '夫妻宫');
  const fu2 = a2.palaces.find(p => p.name === '夫妻宫');
  const fu1Stars = (fu1?.majorStars || []).map(s => s.name).join('、') || '空宫';
  const fu2Stars = (fu2?.majorStars || []).map(s => s.name).join('、') || '空宫';
  r += `**夫妻宫对比**\n`;
  r += `  ${n1}：${fu1Stars}\n`;
  r += `  ${n2}：${fu2Stars}\n\n`;

  // 五行局对比
  r += `**五行局**\n`;
  r += `  ${n1}：${a1.fiveElementsClass}\n`;
  r += `  ${n2}：${a2.fiveElementsClass}\n\n`;

  // 命宫地支关系
  const mb1 = m1?.branch ?? -1;
  const mb2 = m2?.branch ?? -1;
  const diff = Math.abs(mb1 - mb2);
  if (mb1 >= 0 && mb2 >= 0) {
    r += `**命宫地支关系**\n`;
    if (mb1 === mb2) r += `  命宫同支，性格相似、有默契\n`;
    else if (diff === 6) r += `  命宫相冲（${B[mb1]}${B[mb2]}），性格互补但易冲突\n`;
    else if (diff === 4 || diff === 8) r += `  命宫三合（${B[mb1]}${B[mb2]}），性格相合、相处融洽\n`;
    else if (diff === 1 || diff === 11) r += `  命宫相邻（${B[mb1]}${B[mb2]}），关系密切\n`;
    else r += `  命宫${B[mb1]}、${B[mb2]}，关系一般\n`;
    r += '\n';
  }

  // 合盘解读
  r += `📖 **合盘解读**\n`;
  const sameStars = (fu1Stars === fu2Stars);
  const hasGood = fu1Stars.includes('紫微') || fu1Stars.includes('天府') || fu1Stars.includes('天相');
  const hasGood2 = fu2Stars.includes('紫微') || fu2Stars.includes('天府') || fu2Stars.includes('天相');
  
  if (hasGood && hasGood2) r += `  双方夫妻宫皆有吉星，婚姻基础良好。`;
  else if (hasGood || hasGood2) r += `  一方夫妻宫有吉星，另一方需多包容。`;
  else r += `  双方夫妻宫皆无吉星，需更多经营感情。`;
  
  if (mb1 === mb2) r += `命宫同支，性格投契。`;
  else if (diff === 6) r += `命宫相冲，性格差异大，需磨合。`;
  else if (diff === 4 || diff === 8) r += `命宫三合，缘分不浅。`;


    let score = 50;
    const reasons = [];
    const wu1 = a1.fiveElementsClass || '';
    const wu2 = a2.fiveElementsClass || '';

    // ── 福德宫互动（精神契合度）──
    const fd1 = a1.palaces.find(p => p.name === '福德宫');
    const fd2 = a2.palaces.find(p => p.name === '福德宫');
    const fd1Stars = (fd1?.majorStars || []).map(s => s.name);
    const fd2Stars = (fd2?.majorStars || []).map(s => s.name);
    const fdGood = ['天同','天梁','太阴','天府','紫微'];
    if (fd1Stars.some(s => fdGood.includes(s)) && fd2Stars.some(s => fdGood.includes(s))) {
      score += 10; reasons.push('双方福德皆吉+10');
    }
    // ── 子女宫同步性 ──
    const zi1 = a1.palaces.find(p => p.name === '子女宫');
    const zi2 = a2.palaces.find(p => p.name === '子女宫');
    const zi1Stars = (zi1?.majorStars || []).map(s => s.name);
    const zi2Stars = (zi2?.majorStars || []).map(s => s.name);
    if (fdGood.some(s => zi1Stars.includes(s)) && fdGood.some(s => zi2Stars.includes(s))) {
      score += 5; reasons.push('子女观契合+5');
    }
    // ── 身宫互动 ──
    const sb1 = B.indexOf(a1.earthlyBranchOfBodyPalace);
    const sb2 = B.indexOf(a2.earthlyBranchOfBodyPalace);
    if (sb1 === sb2 && sb1 >= 0) { score += 5; reasons.push('身宫同宫+5'); }
    // ── 大运同步性 ──
    const age1 = a1.age || 25;
    const age2 = a2.age || 25;
    const ageDiff = Math.abs(age1 - age2);
    if (ageDiff <= 3) { score += 5; reasons.push('年龄相仿大运同步+5'); }
    else if (ageDiff <= 7) { score += 3; reasons.push('年龄相近+3'); }
    // ── 五行互补 ──
    const wxMap = { '水二局':0,'木三局':1,'金四局':2,'土五局':3,'火六局':4 };
    const wx1 = wxMap[wu1], wx2 = wxMap[wu2];
    if (wx1 !== undefined && wx2 !== undefined) {
      const diff = (wx1 - wx2 + 5) % 5;
      if (diff === 1 || diff === 4) { score += 5; reasons.push('五行相生互补+5'); }
    }
  // ── 综合匹配度分析 ──
  r += `\n📊 **匹配度分析**\n`;
  
  // 命宫地支加分
  if (mb1 === mb2) { score += 15; reasons.push('命宫同支+15'); }
  else if (diff === 4 || diff === 8) { score += 10; reasons.push('命宫三合+10'); }
  else if (diff === 6) { score -= 5; reasons.push('命宫相冲-5'); }
  
  // 夫妻宫加分
  if (hasGood && hasGood2) { score += 15; reasons.push('夫妻宫皆吉+15'); }
  else if (hasGood || hasGood2) { score += 5; reasons.push('一方夫妻宫有吉星+5'); }
  
  // 五行局加分
  if (wu1 === wu2) { score += 10; reasons.push('五行局相同+10'); }
  else { score += 5; reasons.push('五行局不同但互补+5'); }
  
  // 命宫主星互动
  const m1Majors = (m1?.majorStars || []).map(s => s.name);
  const m2Majors = (m2?.majorStars || []).map(s => s.name);
  const shareStars = m1Majors.filter(s => m2Majors.includes(s));
  if (shareStars.length > 0) { score += 10; reasons.push(`命宫同星(${shareStars.join()})+10`); }
  
  // 综合评级
  score = Math.min(100, Math.max(0, score));
  const stars = '⭐'.repeat(Math.ceil(score / 20));
  r += `  总分：${score}/100 ${stars}\n`;
  r += `  评级：${score >= 80 ? '🔥 极配' : score >= 60 ? '✅ 相合' : score >= 40 ? '➖ 一般' : '⚠️ 需磨合'}\n`;
  r += `  因素：${reasons.join('、')}\n`;
  
  return r;
}
