# 🎯 Natiq App - سامانه هوشمند

🌐 **Live Demo:** https://natiq-il8gxgxu4-ramin-edjlal-s-projects.vercel.app

## ✨ ویژگی‌ها
- ♟️ موتور شطرنج هوشمند
- ✍️ تولید محتوای هوشمند
- 🎨 رابط کاربری Vue.js 3
- ⚡ APIهای Python

## 🚀 استقرار
```bash
npm run build && npx vercel --prod
git add .
git commit-m "🚀 deploy: complete Natiq app"
git push origin main
ls -la
# 1. به پوشه پروژه برو
cd /data/data/com.termux/files/home/natiq-app

# 2. فایل ساده ایجاد کن
cat > index.html << 'EOF'
<h1>Natiq App - Deployed Successfully 🎉</h1>
<p>System is now live on Vercel</p>
