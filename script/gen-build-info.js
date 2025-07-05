// script/gen-build-info.js
const fs = require('fs');
const path = require('path');

const buildTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
const content = `NEXT_PUBLIC_BUILD_TIME=${buildTime}\n`;

fs.writeFileSync(path.join(__dirname, '../.env.local'), content, { flag: 'a' });
console.log('Build time written:', buildTime);
