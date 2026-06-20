// 命盘综合评级系统
const BRIGHT = { '庙':20, '旺':15, '利':10, '平':5, '陷':-5 };
const LEVELS = { 'excellent':30, 'good':15, 'neutral':0, 'caution':-10 };
const SHA = ['擎羊','陀罗','火星','铃星','地空','地劫'];
const GOOD = ['左辅','右弼','文昌','文曲','天魁','天钺','禄存','天马'];
const RANK = [
  { min:85, label:'至尊命格', emoji:'👑', desc:'格局极高，福泽深厚。' },
  { min:70, label:'上等命格', emoji:'🌟', desc:'命格优良，贵气显达。' },
  { min:55, label:'中等命格', emoji:'⭐', desc:'命格中等，吉凶参半。' },
  { min:40, label:'中下命格', emoji:'🌓', desc:'命格偏弱，波折较多。' },
  { min:0,  label:'末流命格', emoji:'🌑', desc:'命格低弱，当积德行善。' },
];
export function getPalaceRating(palaces, patterns) {
  if (!palaces?.length) return {score:50,detail:'数据不足'};
  let sc = 60, factors = [];
  const all = palaces.flatMap(p=>p.majorStars||[]);
  const names = all.map(s=>s.name);
  const b = all.filter(s=>s.type==='major').reduce((a,s)=>a+(BRIGHT[s.brightness]||0),0);
  sc += b; factors.push(b>=0?'主星庙旺+'+b:'主星陷弱'+b);
  if (patterns) for (const p of patterns) {
    sc += LEVELS[p.level]||0; const sign=LEVELS[p.level]>=0?'+':'';
    factors.push('格局['+p.name+']'+sign+LEVELS[p.level]);
  }
  const lu = all.filter(s=>s.mutagen==='禄').length;
  const ji = all.filter(s=>s.mutagen==='忌').length;
  sc += lu*10 - ji*8; if(lu) factors.push('化禄'+lu+'个+'+lu*10); if(ji) factors.push('化忌'+ji+'个-'+ji*8);
  const sha = names.filter(s=>SHA.includes(s)).length;
  sc -= sha*8; if(sha) factors.push('煞星'+sha+'个-'+sha*8);
  const gd = names.filter(s=>GOOD.includes(s)).length;
  sc += gd*5; if(gd) factors.push('吉星'+gd+'个+'+gd*5);
  let ep=0; for(const p of palaces){if(!(p.majorStars||[]).length)ep++;}
  if(ep>=4){sc-=10;factors.push('空宫多-10');}
  sc = Math.max(0,Math.min(100,sc));
  const lv = RANK.find(l=>sc>=l.min)||RANK[4];
  return {score:sc, label:lv.label, emoji:lv.emoji, desc:lv.desc,
    detail:lv.emoji+' **'+lv.label+'**（'+sc+'分）\n'+lv.desc,
    factors:factors.join('、')};
}
