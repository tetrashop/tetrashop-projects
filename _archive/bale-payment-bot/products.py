import json
import os
from config import DIGITAL_PRODUCTS_PATH

def load_products():
    """بارگذاری محصولات دیجیتال از فایل JSON"""
    try:
        with open(DIGITAL_PRODUCTS_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        # تبدیل قیمت از تومان به ریال (ضرب در ۱۰)
        for p in data:
            p['price_rial'] = int(p['price']) * 10  # تبدیل تومان به ریال
        return data
    except Exception as e:
        print("Error loading digital products:", e)
        return []

def get_product_by_id(product_id):
    products = load_products()
    for p in products:
        if p['id'] == product_id:
            return p
    return None

def format_price(rials):
    """تبدیل ریال به تومان و فرمت‌بندی"""
    tomans = rials // 10
    return f"{tomans:,} تومان"
