#!/bin/bash

echo "🤖 بروزرسانی خودکار Git - $(date '+%Y/%m/%d %H:%M')"
echo "=========================================="

PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"
LOG_FILE="$PROJECT_DIR/git-auto-update.log"

# تنظیم لاگ
exec >> "$LOG_FILE" 2>&1

cd "$PROJECT_DIR" || {
    echo "❌ خطا: دایرکتوری پروژه یافت نشد"
    exit 1
}

# بررسی وجود Git
if [ ! -d ".git" ]; then
    echo "⚠️ مخزن Git یافت نشد. ایجاد مخزن جدید..."
    git init
    git config user.email "tetrasaas@example.com"
    git config user.name "TetraSaaS Auto-Updater"
    git branch -M main
fi

# بررسی remote
if ! git remote | grep -q "origin"; then
    echo "⚠️ Remote تنظیم نشده است."
    echo "لطفا remote را تنظیم کنید:"
    echo "git remote add origin https://github.com/YOUR-USERNAME/tetrashop-projects.git"
    exit 1
fi

# تابع لاگ
log() {
    echo "[$(date '+%Y/%m/%d %H:%M:%S')] $1"
}

log "شروع بروزرسانی خودکار..."

# 1. دریافت تغییرات از remote
log "دریافت تغییرات از remote..."
git fetch origin

# بررسی وضعیت
LOCAL_COMMIT=$(git rev-parse @)
REMOTE_COMMIT=$(git rev-parse origin/main)

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    log "✅ هیچ تغییری در remote وجود ندارد"
else
    log "🔄 تغییرات جدید در remote یافت شد"
    
    # سعی در pull بدون conflict
    if git pull --rebase origin main; then
        log "✅ Pull موفقیت‌آمیز بود"
    else
        log "⚠️ Conflict در pull - ذخیره تغییرات..."
        
        # stash تغییرات local
        git stash push -m "Auto-stash before merge $(date '+%Y-%m-%d %H:%M')"
        
        # reset و pull مجدد
        git reset --hard origin/main
        
        # بازیابی stash (اگر ممکن باشد)
        if git stash pop; then
            log "✅ تغییرات local بازیابی شدند"
        else
            log "⚠️ خطا در بازیابی stash - نگهداری در stash"
            git stash list
        fi
    fi
fi

# 2. اضافه کردن فایل‌های جدید
log "بررسی فایل‌های جدید..."
NEW_FILES=$(git status --porcelain | grep "^??" | cut -c4-)

if [ -n "$NEW_FILES" ]; then
    log "📁 فایل‌های جدید یافت شد:"
    echo "$NEW_FILES" | while read file; do
        echo "  - $file"
    done
    
    git add -A
    log "✅ همه فایل‌ها اضافه شدند"
fi

# 3. بررسی تغییرات
CHANGES=$(git status --porcelain | grep -v "^??")

if [ -n "$CHANGES" ]; then
    log "📝 تغییرات برای commit:"
    git status --short
    
    # ایجاد commit
    COMMIT_MSG="🤖 بروزرسانی خودکار $(date '+%Y/%m/%d %H:%M')
    
تغییرات شامل:
$(git diff --cached --name-only | sed 's/^/- /')
    
Auto-update توسط سیستم TetraSaaS"
    
    git commit -m "$COMMIT_MSG"
    log "✅ Commit ایجاد شد"
    
    # 4. Push به remote
    log "ارسال تغییرات به remote..."
    if git push origin main; then
        log "✅ Push موفقیت‌آمیز بود"
    else
        log "⚠️ خطا در push - سعی مجدد با force"
        if git push --force-with-lease origin main; then
            log "✅ Push با force موفق بود"
        else
            log "❌ خطا در push - نیاز به بررسی دستی"
        fi
    fi
else
    log "✅ هیچ تغییراتی برای commit وجود ندارد"
fi

# 5. لاگ وضعیت نهایی
log "وضعیت نهایی:"
echo "├─ Branch: $(git branch --show-current)"
echo "├─ آخرین commit: $(git log --oneline -1)"
echo "├─ فایل‌های تغییر یافته: $(git status --short | wc -l)"
echo "└─ زمان: $(date '+%Y/%m/%d %H:%M:%S')"

log "✅ بروزرسانی خودکار کامل شد"
echo "=========================================="
