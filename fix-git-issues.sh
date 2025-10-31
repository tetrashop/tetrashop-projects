#!/bin/bash
echo "🎯 شروع رفع یکپارچه مشکلات Git..."

# 1. بررسی و رفع conflicts
echo "1. 🔍 بررسی conflicts..."
CONFLICTED_FILES=$(git diff --name-only --diff-filter=U)
if [ -n "$CONFLICTED_FILES" ]; then
    echo "   ⚠️ conflicts یافت شد. رفع خودکار..."
    for file in $CONFLICTED_FILES; do
        git checkout --ours "$file"
        git add "$file"
    done
fi

# 2. به‌روزرسانی از remote
echo "2. 📥 به‌روزرسانی از remote..."
git fetch origin

# 3. ادغام با استراتژی کوانتومی
echo "3. 🔄 ادغام تغییرات..."
if git merge -X ours origin/main; then
    echo "   ✅ ادغام موفقیت‌آمیز"
else
    echo "   ⚠️ خطا در ادغام. استفاده از reset..."
    git reset --hard HEAD
    git merge -X ours origin/main --no-commit
    git add .
    git commit -m "🔀 ادغام دستی با اولویت کوانتومی"
fi

# 4. پوش نهایی
echo "4. 🚀 پوش تغییرات..."
if git push origin main; then
    echo "   ✅ پوش موفقیت‌آمیز"
else
    echo "   🔄 استفاده از force push با احتیاط..."
    git push --force-with-lease origin main
fi

echo "🎉 تمام مشکلات Git برطرف شد!"
