// 高段位 AI 解盘引擎
// 使用 DeepSeek API 生成专业命理解读

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// RAG：古籍原文片段，增强 AI 解读
const RAG_CONTEXT = `以下为紫微斗数古籍原文片段，可参考：
《骨髓赋》：紫微躔午威震边疆，天府临子财丰禄厚。日月并明佐九重，辅弼夹帝位三台。
《十二宫诀》：命宫宜旺不宜衰，吉星朝拱福寿来。夫妻宫中吉星照，琴瑟和鸣乐逍遥。
《星辰诀》：紫微帝座镇中天，文武双全福寿全。天机智慧属木星，机谋巧妙最通灵。`;

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
