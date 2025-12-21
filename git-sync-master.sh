#!/bin/bash

echo "🔄 مدیر همگام‌سازی Git - بدون Conflict"
echo "====================================="

# تنظیمات
PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"
GIT_REMOTE="origin"
GIT_BRANCH="main"
BACKUP_DIR="$HOME/git-backups"

# رنگ‌ها برای نمایش
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع نمایش خطا
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}📌 $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }

cd "$PROJECT_DIR" || error "دایرکتوری پروژه یافت نشد"

# تابع ایجاد پشتیبان
create_backup() {
    info "ایجاد پشتیبان از تغییرات فعلی..."
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    mkdir -p "$BACKUP_DIR"
    
    # پشتیبان از وضعیت Git
    git status > "$BACKUP_DIR/git-status-$TIMESTAMP.txt" 2>/dev/null
    git diff > "$BACKUP_DIR/git-diff-$TIMESTAMP.txt" 2>/dev/null
    git log --oneline -10 > "$BACKUP_DIR/git-log-$TIMESTAMP.txt" 2>/dev/null
    
    # پشتیبان از فایل‌های تغییر یافته
    git diff --name-only > "$BACKUP_DIR/changed-files-$TIMESTAMP.txt" 2>/dev/null
    
    success "پشتیبان ایجاد شد: $BACKUP_DIR/git-backup-$TIMESTAMP"
}

# تابع بررسی وضعیت Git
check_git_status() {
    info "بررسی وضعیت Git..."
    
    # بررسی initialized بودن
    if [ ! -d ".git" ]; then
        warning "مخزن Git initialized نیست"
        return 1
    fi
    
    # بررسی remote
    if ! git remote | grep -q "$GIT_REMOTE"; then
        warning "Remote '$GIT_REMOTE' یافت نشد"
        return 2
    fi
    
    # بررسی branch
    if ! git branch --show-current &>/dev/null; then
        warning "Branch فعال یافت نشد"
        return 3
    fi
    
    success "وضعیت Git: OK"
    return 0
}

# تابع تمیزسازی local
clean_local() {
    info "تمیزسازی local repository..."
    
    # ذخیره تغییرات stash
    if git status --porcelain | grep -q "^[ MARC]"; then
        info "ذخیره تغییرات فعلی در stash..."
        git stash push -m "Auto-stash $(date '+%Y-%m-%d %H:%M')"
        success "تغییرات stash شدند"
    fi
    
    # تمیزکاری
    git clean -fd
    git reset --hard HEAD
    success "Local repository تمیز شد"
}

# تابع دریافت تغییرات از remote
pull_from_remote() {
    info "دریافت آخرین تغییرات از remote..."
    
    # اول fetch کنیم تا تغییرات را ببینیم
    git fetch "$GIT_REMOTE"
    
    # بررسی اگر local ahead است
    LOCAL_COMMIT=$(git rev-parse @)
    REMOTE_COMMIT=$(git rev-parse "$GIT_REMOTE/$GIT_BRANCH")
    BASE_COMMIT=$(git merge-base @ "$GIT_REMOTE/$GIT_BRANCH")
    
    if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
        success "Local و remote یکسان هستند"
        return 0
    elif [ "$LOCAL_COMMIT" = "$BASE_COMMIT" ]; then
        info "Remote جلوتر است - انجام fast-forward"
        git pull --ff-only "$GIT_REMOTE" "$GIT_BRANCH"
    elif [ "$REMOTE_COMMIT" = "$BASE_COMMIT" ]; then
        info "Local جلوتر است - نیاز به push"
        return 1
    else
        warning "Branchها diverge شده‌اند"
        return 2
    fi
}

# تابع حل conflict
resolve_conflicts() {
    info "بررسی و حل conflicts..."
    
    # بررسی conflicts
    if git status --porcelain | grep -q "^UU"; then
        warning "Conflicts یافت شد!"
        
        # نمایش فایل‌های دارای conflict
        echo "📄 فایل‌های دارای conflict:"
        git diff --name-only --diff-filter=U
        
        # ایجاد backup از فایل‌های conflict
        mkdir -p ".conflict-backup"
        git diff --name-only --diff-filter=U | while read file; do
            cp "$file" ".conflict-backup/$file.$(date +%s)" 2>/dev/null
        done
        
        # پیشنهاد strategies
        echo "🔧 انتخاب strategy برای حل conflict:"
        echo "1. از remote استفاده کن (ours)"
        echo "2. از local استفاده کن (theirs)"
        echo "3. به صورت دستی حل کن"
        echo "4. merge را abort کن"
        
        read -p "انتخاب شما (1-4): " choice
        
        case $choice in
            1)
                info "استفاده از remote changes..."
                git checkout --theirs -- .
                git add -A
                ;;
            2)
                info "استفاده از local changes..."
                git checkout --ours -- .
                git add -A
                ;;
            3)
                info "حل دستی conflicts..."
                echo "لطفا فایل‌های conflict را ویرایش و سپس ادامه دهید"
                read -p "بعد از حل conflicts دکمه Enter را بزنید..." _
                git add -A
                ;;
            4)
                info "Abort کردن merge..."
                git merge --abort
                error "Merge aborted شد"
                ;;
            *)
                warning "انتخاب نامعتبر، abort کردن..."
                git merge --abort
                error "Merge aborted شد"
                ;;
        esac
        
        success "Conflicts حل شدند"
    else
        success "هیچ conflictی یافت نشد"
    fi
}

# تابع commit تغییرات
commit_changes() {
    info "آماده‌سازی commit..."
    
    # بررسی تغییرات
    if ! git status --porcelain | grep -q "^[MADRC]"; then
        warning "هیچ تغییری برای commit وجود ندارد"
        return 1
    fi
    
    # نمایش تغییرات
    echo "📋 تغییرات فعلی:"
    git status --short
    
    # اضافه کردن همه فایل‌ها
    git add -A
    
    # ایجاد commit message
    COMMIT_MSG="🔄 بروزرسانی $(date '+%Y/%m/%d %H:%M')
    
تغییرات شامل:
$(git diff --cached --name-only | sed 's/^/- /')
    
🔄 همگام‌سازی خودکار سیستم TetraSaaS"
    
    # commit
    git commit -m "$COMMIT_MSG"
    
    if [ $? -eq 0 ]; then
        success "Commit با موفقیت ایجاد شد"
        return 0
    else
        error "خطا در ایجاد commit"
    fi
}

# تابع push به remote
push_to_remote() {
    info "ارسال تغییرات به remote..."
    
    # بررسی ahead بودن
    LOCAL_AHEAD=$(git rev-list --count "$GIT_REMOTE/$GIT_BRANCH"..@)
    
    if [ "$LOCAL_AHEAD" -eq 0 ]; then
        warning "هیچ تغییری برای push وجود ندارد"
        return 1
    fi
    
    info "$LOCAL_AHEAD commit برای push وجود دارد"
    
    # force push نکنیم مگر ضروری باشد
    if git push "$GIT_REMOTE" "$GIT_BRANCH" 2>&1 | grep -q "rejected"; then
        warning "Push rejected شد - remote جلوتر است"
        
        # اول pull کنیم
        if git pull --rebase "$GIT_REMOTE" "$GIT_BRANCH"; then
            success "Rebase موفقیت‌آمیز بود"
            git push "$GIT_REMOTE" "$GIT_BRANCH"
        else
            error "خطا در rebase - نیاز به حل دستی"
        fi
    else
        success "Push موفقیت‌آمیز بود"
    fi
}

# تابع همگام‌سازی کامل
full_sync() {
    echo "🚀 شروع همگام‌سازی کامل..."
    echo "=========================="
    
    # مرحله 1: پشتیبان‌گیری
    create_backup
    
    # مرحله 2: بررسی وضعیت
    if ! check_git_status; then
        warning "مشکلی در وضعیت Git وجود دارد"
        read -p "آیا ادامه دهیم؟ (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "همگام‌سازی متوقف شد"
        fi
    fi
    
    # مرحله 3: تمیزسازی
    clean_local
    
    # مرحله 4: دریافت از remote
    PULL_RESULT=$(pull_from_remote; echo $?)
    case $PULL_RESULT in
        0) success "دریافت تغییرات موفق بود" ;;
        1) info "Local جلوتر است" ;;
        2) 
            warning "Branchها diverge شده‌اند"
            resolve_conflicts
            ;;
    esac
    
    # مرحله 5: commit تغییرات local
    if commit_changes; then
        # مرحله 6: push به remote
        push_to_remote
    fi
    
    # مرحله 7: restore stash اگر وجود داشت
    if git stash list | grep -q "Auto-stash"; then
        info "بازیابی تغییرات stash شده..."
        if git stash pop; then
            success "تغییرات بازیابی شدند"
        else
            warning "خطا در بازیابی stash - conflicts وجود دارد"
            git stash show -p > "$BACKUP_DIR/stash-conflict-$(date +%s).patch"
        fi
    fi
    
    echo ""
    success "🎉 همگام‌سازی کامل شد!"
    
    # نمایش وضعیت نهایی
    echo ""
    echo "📊 وضعیت نهایی:"
    echo "├─ Branch: $(git branch --show-current)"
    echo "├─ Last commit: $(git log --oneline -1)"
    echo "├─ Remote: $(git remote get-url origin 2>/dev/null | head -1)"
    echo "└─ Status: $(git status --short | wc -l) تغییر"
}

# تابع وضعیت تفصیلی
detailed_status() {
    info "وضعیت تفصیلی Git:"
    echo ""
    
    echo "📁 Local Branch:"
    git branch -vv
    
    echo ""
    echo "📊 وضعیت remote:"
    git remote -v
    
    echo ""
    echo "📈 تاریخچه commits (آخرین ۵):"
    git log --oneline -5 --graph --all
    
    echo ""
    echo "📋 وضعیت فایل‌ها:"
    git status --short
    
    echo ""
    echo "🔍 تغییرات staged:"
    git diff --cached --stat
    
    echo ""
    echo "📦 Stashها:"
    git stash list
}

# تابع reset و شروع جدید
hard_reset() {
    warning "⚠️  این عملیات تمام تغییرات local را حذف می‌کند!"
    read -p "آیا مطمئنید؟ (yes/no): " -r
    if [[ $REPLY != "yes" ]]; then
        error "عملیات لغو شد"
    fi
    
    info "در حال reset سخت..."
    
    # پشتیبان از همه تغییرات
    create_backup
    
    # دریافت آخرین نسخه از remote
    git fetch "$GIT_REMOTE"
    
    # reset سخت به remote
    git reset --hard "$GIT_REMOTE/$GIT_BRANCH"
    
    # تمیزکاری
    git clean -fd
    
    success "Reset کامل شد - local با remote هماهنگ شد"
}

# منوی اصلی
case "$1" in
    "sync")
        full_sync
        ;;
        
    "status")
        detailed_status
        ;;
        
    "pull")
        pull_from_remote
        ;;
        
    "push")
        commit_changes && push_to_remote
        ;;
        
    "commit")
        commit_changes
        ;;
        
    "backup")
        create_backup
        ;;
        
    "clean")
        clean_local
        ;;
        
    "reset")
        hard_reset
        ;;
        
    "conflict")
        resolve_conflicts
        ;;
        
    "init")
        info "راه‌اندازی Git جدید..."
        
        if [ -d ".git" ]; then
            warning "مخزن Git از قبل وجود دارد"
        else
            git init
            git config user.email "tetrasaas@example.com"
            git config user.name "TetraSaaS Team"
            git branch -M main
            success "Git initialized شد"
        fi
        
        read -p "آدرس remote repository را وارد کنید: " remote_url
        if [ -n "$remote_url" ]; then
            git remote add origin "$remote_url"
            success "Remote اضافه شد: $remote_url"
        fi
        ;;
        
    "setup-remote")
        if [ -z "$2" ]; then
            error "لطفا آدرس remote را وارد کنید"
        fi
        
        if git remote | grep -q "origin"; then
            git remote set-url origin "$2"
            info "آدرس remote به‌روزرسانی شد"
        else
            git remote add origin "$2"
            info "Remote جدید اضافه شد"
        fi
        
        success "Remote تنظیم شد: $2"
        ;;
        
    *)
        echo "استفاده: $0 {sync|status|pull|push|commit|backup|clean|reset|conflict|init|setup-remote}"
        echo ""
        echo "دستورات:"
        echo "  sync           - همگام‌سازی کامل (recommended)"
        echo "  status         - وضعیت تفصیلی"
        echo "  pull           - فقط دریافت از remote"
        echo "  push           - فقط ارسال به remote"
        echo "  commit         - فقط ایجاد commit"
        echo "  backup         - ایجاد پشتیبان"
        echo "  clean          - تمیزکاری local"
        echo "  reset          - reset سخت به remote"
        echo "  conflict       - حل conflicts"
        echo "  init           - راه‌اندازی Git جدید"
        echo "  setup-remote URL - تنظیم remote"
        echo ""
        echo "مثال:"
        echo "  $0 sync"
        echo "  $0 setup-remote https://github.com/user/repo.git"
        echo "  $0 status"
        ;;
esac
