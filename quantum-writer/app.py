# نگار کوانتا - نسخه پیشرفته
import random
import time
import json
from datetime import datetime

class QuantumWriter:
    def __init__(self):
        self.quantum_states = ['برهم‌نهی', 'درهم‌تنیدگی', 'تونل‌زنی کوانتومی', 'انتقال کوانتومی', 'نوسان کوانتومی']
        self.creative_modes = ['شعری', 'علمی', 'فلسفی', 'داستانی', 'تاریخی', 'فانتزی']
        self.themes = ['عشق', 'زمان', 'فناوری', 'طبیعت', 'انسان', 'کیهان', 'دانش']
        self.generated_content = []
    
    def generate_quantum_text(self, base_text, mode='شعری', creativity_level=0.7):
        quantum_effect = random.choice(self.quantum_states)
        theme = random.choice(self.themes)
        
        templates = {
            'شعری': [
                f"در سکوت کوانتومی، {base_text}\nبا {quantum_effect} در هم می‌آمیزد",
                f"رقص ذرات نور، {base_text}\nدر دل {quantum_effect} جان می‌گیرد"
            ],
            'علمی': [
                f"بر اساس اصل {quantum_effect}، {base_text} قابل تحلیل و بررسی است",
                f"در چهارچوب {quantum_effect}، پدیده {base_text} تبیین می‌شود"
            ],
            'فلسفی': [
                f"آیا {base_text} واقعیت دارد یا تنها {quantum_effect} است؟",
                f"در پرتو {quantum_effect}، مفهوم {base_text} دگرگون می‌شود"
            ]
        }
        
        mode_templates = templates.get(mode, [f"{base_text} - {quantum_effect}"])
        selected_template = random.choice(mode_templates)
        
        # اعمال سطح خلاقیت
        if creativity_level > 0.5:
            enhancements = [
                f"\n✨ در جهانی موازی، این معنا عمق می‌یابد...",
                f"\n🌌 هر ذره روایتی نو می‌سراید...",
                f"\n⚡ انرژی کوانتومی جاری می‌شود..."
            ]
            selected_template += random.choice(enhancements)
        
        result = {
            'text': selected_template,
            'mode': mode,
            'quantum_effect': quantum_effect,
            'theme': theme,
            'creativity_level': creativity_level,
            'timestamp': datetime.now().isoformat(),
            'word_count': len(selected_template.split())
        }
        
        self.generated_content.append(result)
        return result
    
    def multi_universe_story(self, theme, num_universes=3, depth=1):
        print(f"📖 داستان چندجهانی درباره '{theme}' (عمق: {depth}):")
        print("=" * 60)
        
        stories = []
        for i in range(num_universes):
            universe_id = i + 1
            story = self._generate_universe_story(theme, universe_id, depth)
            stories.append(story)
            
            print(f"🌌 جهان {universe_id}:")
            print(f"   {story['description']}")
            print(f"   💫 ویژگی: {story['characteristic']}")
            print(f"   📊 پیچیدگی: {story['complexity']}/10")
            print()
            
            time.sleep(0.3)
        
        return stories
    
    def _generate_universe_story(self, theme, universe_id, depth):
        characteristics = [
            "زمان غیرخطی", "حضور ابعاد اضافی", "انرژی تاریک غالب",
            "ماده و پادمatter در تعادل", "قوانین فیزیکی متفاوت"
        ]
        
        descriptions = [
            f"در این جهان، {theme} با {random.choice(self.quantum_states)} درآمیخته است",
            f"ساکنان این جهان {theme} را از طریق {random.choice(self.quantum_states)} درک می‌کنند",
            f"این جهان فاقد مفهوم متعارف {theme} است و جایگزین کوانتومی دارد"
        ]
        
        return {
            'universe_id': universe_id,
            'theme': theme,
            'description': random.choice(descriptions),
            'characteristic': random.choice(characteristics),
            'complexity': random.randint(3, 10),
            'depth': depth
        }
    
    def quantum_poetry(self, seed_word, style='کلاسیک'):
        print(f"🎭 شعر کوانتومی با کلمه '{seed_word}' (سبک: {style}):")
        print("-" * 50)
        
        poetic_structures = {
            'کلاسیک': [
                f"در برهم‌نهی ذرات نور",
                f"{seed_word} رقص کوانتومی آغاز می‌کند",
                f"هر احتمال جهانی نو می‌سازد",
                f"در درهم‌تنیدگی زمان و مکان",
                f"{seed_word} به ابدیت می‌پیوندد"
            ],
            'مدرن': [
                f"کوانتوم | {seed_word} | احتمال",
                f"موج ذره | فضا زمان | {seed_word}",
                f"برهم‌نهی | {seed_word} | واقعیت‌ها",
                f"ناظر | اندازه‌گیری | {seed_word}"
            ]
        }
        
        poem_lines = poetic_structures.get(style, poetic_structures['کلاسیک'])
        poem = '\n'.join(poem_lines)
        
        print(poem)
        print(f"\n📝 سبک: {style} - تعداد خطوط: {len(poem_lines)}")
        
        return {
            'poem': poem,
            'style': style,
            'seed_word': seed_word,
            'line_count': len(poem_lines),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def get_statistics(self):
        total_words = sum(item['word_count'] for item in self.generated_content)
        return {
            'total_generations': len(self.generated_content),
            'total_words': total_words,
            'average_words': total_words / len(self.generated_content) if self.generated_content else 0,
            'most_used_mode': max(set(item['mode'] for item in self.generated_content), 
                                key=lambda x: list(item['mode'] for item in self.generated_content).count(x)) if self.generated_content else 'None',
            'first_generation': self.generated_content[0]['timestamp'] if self.generated_content else 'None'
        }

print("⚛️ نگار کوانتا - نسخه پیشرفته")
print("=" * 60)

qw = QuantumWriter()

# تولید متن کوانتومی
print("1. تولید متن کوانتومی:")
text_result = qw.generate_quantum_text("نگارش خلاقانه", "شعری", 0.8)
print(f"   📝 {text_result['text']}")
print(f"   🎯 اثر: {text_result['quantum_effect']}")
print(f"   🎨 سبک: {text_result['mode']}")

print("\n2. داستان چندجهانی:")
qw.multi_universe_story("عشق", 2, 2)

print("3. شعر کوانتومی:")
poem_result = qw.quantum_poetry("اندیشه", "مدرن")

print(f"\n4. آمار سیستم:")
stats = qw.get_statistics()
print(f"   📊 تعداد تولیدات: {stats['total_generations']}")
print(f"   📝 کل کلمات: {stats['total_words']}")
print(f"   🎯 پرکاربردترین سبک: {stats['most_used_mode']}")
