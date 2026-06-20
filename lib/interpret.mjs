// 高段位 AI 解盘引擎
// 使用 DeepSeek API 生成专业命理解读

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// RAG：古籍原文片段，增强 AI 解读
const RAG_CONTEXT = `以下为紫微斗数古籍原文片段，供解读引用：

《骨髓赋》：
紫微躔午威震边疆，天府临子财丰禄厚。日月并明佐九重，辅弼夹帝位三台。
天机七杀武职峥嵘，太阳在寅卯辰巳官禄峥嵘。太阴在子丑午未福寿绵长。
武曲七杀会擎羊因财持刀，天同太阴会火铃为人淫佚。
紫微居午无杀凑位至公卿，天府临戌有星扶腰金衣紫。
七杀朝斗爵禄荣昌，紫府朝垣食禄万钟。
巨门会火铃是非日日有，廉贞会破军词讼年年兴。
天机加杀武职立功，太阳会禄文官致富。
文昌文曲聪明多学，左辅右弼贵人扶持。天魁天钺世代为官，禄存天马富贵双全。
擎羊陀罗刑伤破相，火星铃星奔波劳碌。地空地劫破财败家，天哭天虚一生多灾。

《星辰诀》：
紫微：紫微帝座镇中天，文武双全福寿全。三方吉拱多贵助，七杀朝斗掌兵权。
天机：天机智慧属木星，机谋巧妙最通灵。若逢太阴同宫坐，必定文章冠群英。
太阳：太阳属火最光明，官禄宫中显大名。若逢劫杀多破败，金乌西坠暗无明。
武曲：武曲属金是将星，财帛宫中积万金。七杀同临多威武，破军会合定改更。
天同：天同属水是福星，为人厚道有深情。与天梁会多寿考，逢太阴兮福更深。
廉贞：廉贞属火号淫星，在官禄兮掌权柄。会七杀兮多刑戮，逢破军兮定改更。
天府：天府属土是库星，在命宫兮福禄增。会紫微兮多贵助，逢空劫兮库无存。
太阴：太阴属水最清奇，在田宅兮福禄齐。会禄存兮多积畜，逢火铃兮被灾逼。
贪狼：贪狼属木是桃花，在命宫兮多豪华。会火星兮成火贪，逢铃星兮亦堪夸。
巨门：巨门属水主是非，在命宫兮惹是非。会太阳兮能化解，逢火铃兮口舌随。
天相：天相属水是印星，在命宫兮福禄增。会辅弼兮多贵助，逢刑杀兮有灾侵。
天梁：天梁属土是荫星，在命宫兮福寿增。会天同兮多吉庆，逢杀破兮有灾星。
七杀：七杀属金是将星，在命宫兮掌兵权。会紫微兮能化解，逢破军兮定改更。
破军：破军属水是败星，在命宫兮多改更。会武曲兮因财变，逢廉贞兮定飘零。

《十二宫诀》：
命宫宜旺不宜衰，吉星朝拱福寿来。兄弟宫中若逢吉，手足情深多助力。
夫妻宫中吉星照，琴瑟和鸣乐逍遥。子女宫中吉曜临，桂子兰孙满堂春。
财帛宫中吉曜聚，金玉满堂多积蓄。疾厄宫中吉曜多，一生康泰少灾疴。
迁移宫中吉曜临，出门顺利贵人亲。交友宫中吉曜临，朋友相助利功名。
官禄宫中吉曜聚，功名显达位三台。田宅宫中吉曜临，家业丰盈子孙兴。
福德宫中吉曜多，一生快乐无灾疴。父母宫中吉曜临，椿萱并茂福寿深。`;

const SYSTEM_PROMPTS = {
  zw: `你是顶尖紫微斗数命理师，师承倪海厦《天纪》体系。请根据命盘数据给出专业解读，涵盖：
1. 命格总论（命宫主星特质+格局高低）
2. 事业财运（官禄宫+财帛宫）
3. 感情婚姻（夫妻宫）
4. 当前大限运势
5. 建议
要求：语言通俗但有深度，200-300字。

可参考的古籍原文：${RAG_CONTEXT}`,

  bazi: `你是顶尖子平八字命理师。请根据八字排盘数据给出专业解读，涵盖：
1. 日主旺衰与五行喜忌
2. 十神格局分析
3. 大运走势与当前流年
4. 事业/财运/感情方向
5. 建议
要求：结合命理术语但通俗易懂，200-300字。`,

  yijing: `你是顶尖周易大师。请根据卦象解读：
1. 本卦含义与象征
2. 变卦（如有）的启示
3. 动爻的指引
4. 对问卜者的建议
要求：结合《周易》经传，200-300字。`,

  qimen: `你是奇门遁甲高手。请根据奇门盘解读：
1. 时局吉凶总论
2. 值符值使的象意
3. 八门吉凶分布
4. 行动建议（利什么/不利什么）
要求：200-300字，提供明确的时空决策建议。`,

  liuyao: `你是六爻纳甲专家。请根据六爻卦象解读：
1. 本卦与变卦的吉凶
2. 世应关系与用神
3. 动爻的提示
4. 对问卜之事的具体建议
要求：200-300字。`,

  meihua: `你是梅花易数大师。请根据卦象解读：
1. 本卦含义
2. 体用生克关系
3. 互卦与变卦的启示
4. 具体建议
要求：结合体用生克，200-300字。`,

  fengshui: `你是玄空风水专家。请根据九星飞布解读：
1. 当年/月/日九星吉凶
2. 财位/文昌位/桃花位分析
3. 凶方化解建议
4. 催旺布局建议
要求：200-300字，给出可操作的风水建议。`,
};

export async function aiInterpret(system, chartData) {
  if (!DEEPSEEK_KEY) {
    return fallbackInterpret(system, chartData);
  }

  const prompt = SYSTEM_PROMPTS[system] || SYSTEM_PROMPTS.zw;
  const userMsg = `请解读以下命盘数据：\n\`\`\`json\n${JSON.stringify(chartData, null, 2).substring(0, 2000)}\n\`\`\``;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMsg },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || fallbackInterpret(system, chartData);
  } catch(e) {
    console.error('AI interpret error:', e.message);
    return fallbackInterpret(system, chartData);
  }
}

// 备选：AI 不可用时的规则解盘
function fallbackInterpret(system, data) {
  const fb = {
    zw: '命盘已生成。建议咨询专业命理师获取详细解读。',
    bazi: '八字已排定。建议结合大运流年综合判断。',
    yijing: '卦象已显。建议静心体会卦爻之寓意。',
    qimen: '奇门盘已成。值符值使为关键，审时度势。',
    liuyao: '六爻已起。观动爻以察事机。',
    meihua: '梅花易数已起。体用生克定吉凶。',
    fengshui: '九星已布。吉方宜动，凶方宜静。',
  };
  return fb[system] || '解读生成中，请稍后再试。';
}
