// Post-install: patch qimen-dunjia S2T mapping
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calcPath = join(__dirname, 'node_modules', 'qimen-dunjia', 'calculations.js');

let code = readFileSync(calcPath, 'utf-8');

// The current mapping only has 3 entries
const oldMap = `const SIMPLIFIED_TO_TRADITIONAL = {
    '谷雨': '穀雨',
    '惊蛰': '驚蟄',
    '处暑': '處暑'
};`;

const newMap = `const SIMPLIFIED_TO_TRADITIONAL = {
    '谷雨': '穀雨',
    '惊蛰': '驚蟄',
    '处暑': '處暑',
    '小满': '小滿',
    '芒种': '芒種',
    '立春': '立春',
    '雨水': '雨水',
    '清明': '清明',
    '夏至': '夏至',
    '立秋': '立秋',
    '寒露': '寒露',
    '霜降': '霜降',
    '大雪': '大雪',
    '冬至': '冬至',
    '春分': '春分',
    '白露': '白露',
    '秋分': '秋分',
    '立冬': '立冬',
    '立夏': '立夏',
    '小雪': '小雪',
    '小寒': '小寒',
    '大寒': '大寒',
    '大暑': '大暑',
    '小暑': '小暑'
};`;

code = code.replace(oldMap, newMap);
writeFileSync(calcPath, code, 'utf-8');
console.log('✅ Patched qimen-dunjia S2T mapping');
