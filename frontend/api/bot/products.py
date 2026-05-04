import json
import os
from .config import DIGITAL_PRODUCTS_PATH

def load_products():
    try:
        with open(DIGITAL_PRODUCTS_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for p in data:
            p['price_rial'] = int(p['price']) * 10
        return data
    except Exception as e:
        return []

def get_product_by_id(product_id):
    products = load_products()
    for p in products:
        if p['id'] == product_id:
            return p
    return None

def format_price(rials):
    tomans = rials // 10
    return f"{tomans:,} تومان"
