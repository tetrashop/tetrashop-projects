from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "service": "ocr",
        "name": "سرویس OCR فارسی",
        "status": "active",
        "port": 5101,
        "endpoints": ["/process", "/languages", "/export"]
    })

@app.route('/process', methods=['POST'])
def process():
    return jsonify({
        "status": "success",
        "message": "تصویر پردازش شد",
        "text": "این متن از تصویر استخراج شد",
        "confidence": 0.95
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5101, debug=False)
