import os

# پسوندهای معادل زبان برنامه‌نویسی
EXT_LANG_MAP = {
    "py": "Python",
    "js": "JavaScript",
    "ts": "TypeScript",
    "java": "Java",
    "rb": "Ruby",
    "go": "Go",
    "cs": "C#",
    "cpp": "C++",
    "c": "C",
    "php": "PHP",
    "swift": "Swift",
    "rs": "Rust"
}

# پوشه‌هایی که معمولاً پروژه مستقل نیستند
IGNORED_FOLDERS = {'.git', 'node_modules', 'build', 'dist', 'coverage', '__pycache__', '.vscode', '.idea'}

def detect_language_by_files(files):
    """زبان پروژه را بر اساس پسوند فایل‌ها و فایل‌های پیکربندی تشخیص می‌دهد"""
    languages = set()

    for f in files:
        ext = f.lower().split('.')[-1]
        if ext in EXT_LANG_MAP:
            languages.add(EXT_LANG_MAP[ext])

    # بررسی برخی فایل‌های پیکربندی مهم
    if 'package.json' in files:
        languages.add('JavaScript/TypeScript')
    if 'requirements.txt' in files or 'setup.py' in files:
        languages.add('Python')
    if 'pom.xml' in files:
        languages.add('Java')
    if 'Gemfile' in files:
        languages.add('Ruby')

    return languages

def find_readme(files):
    """فایل‌های README را پیدا می‌کند و نام آن را برمی‌گرداند"""
    for f in files:
        if f.lower().startswith("readme"):
            return f
    return None

def extract_project_info(root_path):
    projects = []

    for dirpath, dirnames, filenames in os.walk(root_path):
        # حذف پوشه‌های نادیده گرفته شده از جستجو
        dirnames[:] = [d for d in dirnames if d not in IGNORED_FOLDERS]

        # در هر فولدر، اگر حداقل یک فایل کد هست، آن را به عنوان پروژه می‌شناسیم
        languages = detect_language_by_files(filenames)
        if not languages:
            continue  # ممکن است پوشه صرفاً کمک‌فایل باشد

        readme_file = find_readme(filenames)
        readme_content = ""
        has_readme = False

        if readme_file:
            has_readme = True
            try:
                with open(os.path.join(dirpath, readme_file), encoding="utf-8") as f:
                    readme_content = f.read(500)  # ۵۰۰ کاراکتر اول
            except Exception as e:
                readme_content = f"خطا در خواندن README: {e}"

        projects.append({
            "path": dirpath,
            "name": os.path.relpath(dirpath, root_path),
            "languages": sorted(languages),
            "has_readme": has_readme,
            "readme_content": readme_content
        })

    return projects

def print_projects_summary(projects):
    for p in projects:
        langs = ", ".join(p['languages']) if p['languages'] else "نامشخص"
        print(f"نام پروژه: {p['name']}")
        print(f"زبان‌ها: {langs}")
        print(f"وجود فایل README: {'بله' if p['has_readme'] else 'خیر'}")
        if p['has_readme']:
            print(f"خلاصه README:\n{p['readme_content']}")
        print("-" * 60)

if __name__ == "__main__":
    repo_path = "/data/data/com.termux/files/home/tetrashop-projects"  # مسیر خود را اینجا بگذارید
    projects = extract_project_info(repo_path)
    print_projects_summary(projects)
