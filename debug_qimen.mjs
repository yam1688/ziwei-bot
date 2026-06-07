// Step-by-step debug of the exact qimen flow
import { generateChartByDatetime, chartToJSON } from 'qimen-dunjia';

try {
  console.log('1. Creating datetime...');
  const dt = '2026060810';
  console.log('2. Generating chart...');
  const chart = generateChartByDatetime(dt, 'chaiBu');
  console.log('3. Chart type:', typeof chart, chart instanceof Map);
  
  console.log('4. Converting to JSON...');
  const json = chartToJSON(chart);
  console.log('5. JSON type:', typeof json, 'length:', json?.length);
  console.log('6. JSON preview:', json?.substring(0, 200));
  
  console.log('7. Parsing...');
  const obj = JSON.parse(json);
  console.log('8. Object keys:', Object.keys(obj));
  
  console.log('9. Checking all values...');
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && typeof v === 'object') {
      console.log(`   ⚠️ ${k} is OBJECT(${Array.isArray(v)?'array':'plain'}): ${JSON.stringify(v).substring(0,100)}`);
    } else {
      console.log(`   ✅ ${k}: ${typeof v} = ${String(v).substring(0, 80)}`);
    }
  }
  
  // Now try the exact template literal pattern from genQiMenData
  console.log('\n10. Testing template literals...');
  const year = 2026, month = 6, day = 8, hour = 10;
  const dirs = obj['方位'] || [];
  const stars = obj['九宮'] || obj['九宫'] || [];
  const diPan = obj['地盤'] || obj['地盘'] || [];
  const diMen = obj['地門'] || obj['地门'] || [];
  const tianPan = obj['天盤'] || obj['天盘'] || [];
  const baMen = obj['地門'] || obj['地门'] || obj['天門'] || obj['天门'] || obj['八門'] || obj['八门'] || [];
  const jiuXing = obj['九星'] || [];
  const baShen = obj['八神'] || [];
  
  let r = `🪐 **奇门遁甲** ${year}年${month}月${day}日 ${hour}时\n━━━━━━━━━━━━━━\n`;
  r += `四柱：${obj['年柱']} ${obj['月柱']} ${obj['日柱']} ${obj['时柱']}\n`;
  r += `阴阳：${obj['陰陽'] || obj['阴阳']}遁  局数：${obj['局數'] || obj['局数']}\n`;
  r += `值符：${obj['值符']}  值使：${obj['值使']}\n`;
  r += `符落：${obj['值符落宮'] || obj['值符落宫']}  使落：${obj['值使落宮'] || obj['值使落宫']}\n\n`;
  console.log('✅ Basic info template OK');
  
  r += `🏯 **九宫盘**\n`;
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue;
    const dir = dirs[i] || '';
    const s = stars[i] || '';
    const d = diPan[i] || '';
    const m = diMen[i] || '';
    const t = tianPan[i] || '';
    const bm = baMen[i] || '';
    const jx = jiuXing[i] || '';
    const bs = baShen[i] || '';
    r += `  ${dir}宫：${d}`;
    if (t && t !== d) r += `→${t}`;
    if (bm) r += ` ${bm}`;
    if (jx) r += ` ${jx}`;
    if (bs) r += ` ${bs}`;
    r += '\n';
  }
  console.log('✅ Nine palace loop OK');
  
  // Test the new getBaMenMeanings function
  console.log('\n11. Testing getBaMenMeanings...');
  const BA_MEN_MEANING = {
    '休門':'吉·休养生息·求财婚姻', '生門':'大吉·生机勃勃·求财创业',
    '傷門':'凶·损伤争斗·追捕博弈', '杜門':'平·杜塞不通·隐匿藏形',
    '景門':'平·景色虚华·文书信息', '死門':'大凶·死丧停滞·绝处逢生',
    '驚門':'凶·惊慌恐惧·诉讼口舌', '開門':'大吉·万事亨通·求官求职',
  };
  const JIU_XING_MEANING = {
    '天蓬':'大凶·盗贼破财', '天芮':'凶·疾病交加', '天沖':'凶·冲动破败',
    '天輔':'吉·辅佐文化', '天禽':'大吉·中正平和', '天心':'吉·心计谋略',
    '天柱':'凶·毁败口舌', '天任':'吉·任劳任怨', '天英':'凶·虚荣火爆',
  };
  
  if (baMen?.length) {
    const present = [...new Set(baMen.filter(Boolean))];
    for (const m of present) {
      const info = BA_MEN_MEANING[m];
      if (info === undefined) console.log(`   ⚠️ BaMen "${m}" not in dictionary!`);
    }
  }
  console.log('✅ BaMen meanings OK');
  
  if (jiuXing?.length) {
    const present = [...new Set(jiuXing.filter(Boolean))];
    for (const s of present) {
      const info = JIU_XING_MEANING[s];
      if (info === undefined) console.log(`   ⚠️ JiuXing "${s}" not in dictionary!`);
    }
  }
  console.log('✅ JiuXing meanings OK');
  
  // Test JSON.parse(JSON.stringify(obj)) deep copy
  console.log('\n12. Testing deep copy...');
  const copy = JSON.parse(JSON.stringify(obj));
  console.log('✅ Deep copy OK, keys:', Object.keys(copy).length);
  
  console.log('\n🎉 ALL TESTS PASSED');
  
} catch(e) {
  console.log('❌ FAILED:', e.message);
  console.log(e.stack);
}
