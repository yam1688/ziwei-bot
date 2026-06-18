// 八字用神分析 — 根据日主旺衰定喜忌
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING_GAN = ['木','木','火','火','土','土','金','金','水','水'];
const WUXING_ZHI = ['水','土','木','木','土','火','火','土','金','金','土','水'];

// 月令五行旺衰
const MONTH_WANG = {
  2:'木',3:'木',4:'土',5:'火',6:'火',7:'土',
  8:'金',9:'金',10:'土',11:'水',0:'水',1:'土',
};

// 用神建议
const YONG_SHEN_MAP = {
  '木旺': { xi:'火土金', ji:'水木', desc:'木旺需火泄秀、土培木、金修剪。喜火土金，忌水木。' },
  '火旺': { xi:'土金水', ji:'木火', desc:'火旺需土泄火、金生水、水制火。喜土金水，忌木火。' },
  '土旺': { xi:'金水木', ji:'火土', desc:'土旺需金泄土、水润土、木疏土。喜金水木，忌火土。' },
  '金旺': { xi:'水火木', ji:'土金', desc:'金旺需火克金、水泄金、木耗金。喜水火木，忌土金。' },
  '水旺': { xi:'木火土', ji:'金水', desc:'水旺需木泄水、火暖水、土制水。喜木火土，忌金水。' },
  '木弱': { xi:'水木', ji:'火土金', desc:'木弱需水生木、比助。喜水木，忌火土金。' },
  '火弱': { xi:'木火', ji:'土金水', desc:'火弱需木生火、比助。喜木火，忌土金水。' },
  '土弱': { xi:'火土', ji:'金水木', desc:'土弱需火生土、比助。喜火土，忌金水木。' },
  '金弱': { xi:'土金', ji:'水火木', desc:'金弱需土生金、比助。喜土金，忌水火木。' },
  '水弱': { xi:'金水', ji:'木火土', desc:'水弱需金生水、比助。喜金水，忌木火土。' },
};

export function getYongShen(ec) {
  const dayGan = ec.getDayGan ? ec.getDayGan() : '';
  const dayZhi = ec.getDayZhi ? ec.getDayZhi() : '';
  const monthZhi = ec.getMonthZhi ? ec.getMonthZhi() : '';
  const yearGan = ec.getYearGan ? ec.getYearGan() : '';
  const monthGan = ec.getMonthGan ? ec.getMonthGan() : '';
  const timeGan = ec.getTimeGan ? ec.getTimeGan() : '';
  const timeZhi = ec.getTimeZhi ? ec.getTimeZhi() : '';
  
  // 日主五行
  const dayWx = WUXING_GAN[STEMS.indexOf(dayGan)] || '';
  
  // 月令五行（决定旺衰）
  const monthBranchIdx = BRANCHES.indexOf(monthZhi);
  const monthWx = MONTH_WANG[monthBranchIdx] || '';
  
  // 统计四柱五行数量
  const allGan = [yearGan, monthGan, dayGan, timeGan].filter(Boolean);
  const allZhi = [dayZhi, monthZhi, timeZhi].filter(Boolean);
  const allChars = [...allGan, ...allZhi];
  
  const wxCount = {};
  for (const wx of ['木','火','土','金','水']) wxCount[wx] = 0;
  for (const c of allGan) {
    const idx = STEMS.indexOf(c);
    if (idx >= 0) wxCount[WUXING_GAN[idx]]++;
  }
  for (const c of allZhi) {
    const idx = BRANCHES.indexOf(c);
    if (idx >= 0) wxCount[WUXING_ZHI[idx]]++;
  }
  
  // 判断旺衰（月令为日主五行→旺，同五行≥3→旺）
  let isStrong;
  if (monthWx === dayWx) isStrong = true; // 得月令
  else if (wxCount[dayWx] >= 3) isStrong = true; // 同类多
  else isStrong = false;
  
  const key = isStrong ? `${dayWx}旺` : `${dayWx}弱`;
  const advice = YONG_SHEN_MAP[key];
  
  if (!advice) return '';
  
  let r = `🎯 **用神分析**\n`;
  r += `  日主：${dayGan}（${dayWx}）\n`;
  r += `  月令：${monthZhi}月（${monthWx}旺）\n`;
  r += `  旺衰：${isStrong ? '身旺' : '身弱'}\n`;
  r += `  五行分布：木${wxCount['木']} 火${wxCount['火']} 土${wxCount['土']} 金${wxCount['金']} 水${wxCount['水']}\n\n`;
  r += `  喜神：${advice.xi}\n`;
  r += `  忌神：${advice.ji}\n`;
  r += `  ${advice.desc}\n`;
  
  return r + '\n';
}
