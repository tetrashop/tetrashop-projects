import { execSync } from 'child_process';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log('🚀 شروع deploy به Vercel...');

// بررسی فایل‌ها
console.log('📁 بررسی فایل‌ها...');
const files = ['api/index.js', 'package.json', 'vercel.json'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} وجود دارد`);
    if (file === 'api/index.js') {
      const content = fs.readFileSync(file, 'utf8');
      console.log(`   اندازه: ${content.length} کاراکتر`);
      console.log(`   خط اول: ${content.split('\n')[0].substring(0, 50)}...`);
    }
  } else {
    console.log(`❌ ${file} یافت نشد`);
  }
});

// بررسی محتوای api/index.js
try {
  const apiContent = fs.readFileSync('api/index.js', 'utf8');
  const nlpCount = (apiContent.match(/251/g) || []).length;
  console.log(`\n📊 آمار فایل API:`);
  console.log(`   تعداد دفعات "251": ${nlpCount}`);
  console.log(`   تعداد خطوط: ${apiContent.split('\n').length}`);
  
  // بررسی endpointها
  const endpoints = ['/api/health', '/api/nlp', '/api/services', '/api/stats'];
  endpoints.forEach(endpoint => {
    if (apiContent.includes(endpoint)) {
      console.log(`   ✅ ${endpoint} موجود است`);
    } else {
      console.log(`   ❌ ${endpoint} یافت نشد`);
    }
  });
} catch (error) {
  console.log(`❌ خطا در خواندن فایل API: ${error.message}`);
}

console.log('\n🌐 تست اتصال به اینترنت...');
try {
  execSync('curl -s --connect-timeout 5 https://google.com', { stdio: 'pipe' });
  console.log('✅ اتصال اینترنت برقرار است');
} catch (e) {
  console.log('⚠️  مشکل در اتصال اینترنت');
}

console.log('\n🎯 مرحله بعدی:');
console.log('1. ابتدا API فعلی را تست کنید:');
console.log('   curl https://tetrashop-projects.vercel.app');
console.log('\n2. برای deploy جدید:');
console.log('   vercel --prod');
console.log('\n3. یا از طریق وب:');
console.log('   https://vercel.com -> پروژه شما -> Redeploy');
