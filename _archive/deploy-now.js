const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 شروع deploy به Vercel...');

// بررسی فایل‌ها
console.log('📁 بررسی فایل‌ها...');
const files = ['api/index.js', 'package.json', 'vercel.json'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} وجود دارد`);
  } else {
    console.log(`❌ ${file} یافت نشد`);
  }
});

// محتوای فایل اصلی
const apiContent = fs.readFileSync('api/index.js', 'utf8');
console.log(`📄 اندازه فایل API: ${apiContent.length} کاراکتر`);

console.log('\n🌐 تست اتصال...');
try {
  execSync('curl -s https://api.vercel.com', { stdio: 'pipe' });
  console.log('✅ اتصال به Vercel برقرار است');
} catch (e) {
  console.log('⚠️  اتصال اینترنت را بررسی کنید');
}

console.log('\n🎯 برای deploy:');
console.log('1. به https://vercel.com بروید');
console.log('2. وارد حساب خود شوید');
console.log('3. پروژه tetrashop-projects را انتخاب کنید');
console.log('4. روی "Redeploy" کلیک کنید');
console.log('5. یا از دستور زیر استفاده کنید:');
console.log('   vercel --prod --token YOUR_TOKEN');
