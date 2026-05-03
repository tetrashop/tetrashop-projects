from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "service": "image2dto3d",
        "name": "تبدیل 2D به 3D",
        "status": "active",
        "port": 5102
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5102, debug=False)
