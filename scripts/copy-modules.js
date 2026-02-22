const fs = require('fs');
const path = require('path');

// 定义需要复制的文件
const filesToCopy = [
  'database.js',
  'ipcHandler.js',
  'userDao.js'
];

// 源目录和目标目录
const srcDir = path.join(__dirname, '../src/main');
const destDir = path.join(__dirname, '../out/main');

// 确保目标目录存在
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 复制文件
filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ 已复制 ${file}`);
  } else {
    console.warn(`⚠ 文件不存在: ${srcPath}`);
  }
});

console.log('模块文件复制完成');