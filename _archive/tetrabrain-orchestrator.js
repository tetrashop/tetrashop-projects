const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 4000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// ============================
//  تنظیمات سرویس‌های واقعی (آدرس‌های خود را جایگزین کن)
// ============================
const SERVICES = {
    ocr: 'http://localhost:5000/api/ocr',          // سرویس OCR (اگر ندارید، بعداً اضافه می‌شود)
    nlp: 'http://localhost:3000/api/nlp/analyze',  // NLP Gateway (پروژه nlp-gateway-system)
    tts: 'http://localhost:3001/api/generate-audio' // Sound-Make-Book (پروژه sound-make-book)
};

// ============================
//  ابزارهای کمکی
// ============================
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
}

function getBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

// تشخیص نوع ورودی
function detectInputType(req) {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) return 'text';
    if (contentType.includes('multipart/form-data')) return 'file';
    return 'unknown';
}

// قانون زنجیره پردازش
const pipelineRules = {
    'text': ['nlp', 'tts'],
    'file': ['ocr', 'nlp', 'tts'],
    'unknown': []
};

// ============================
//  ارتباط با سرویس‌های واقعی (با ماژول http داخلی)
// ============================
function callHttpService(serviceUrl, method, payload, isFileUpload = false, filePath = null) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(serviceUrl);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: method,
            headers: {}
        };

        if (isFileUpload && filePath) {
            // برای ارسال فایل به سرویس OCR (با multipart/form-data)
            const boundary = '----FormBoundary' + Date.now();
            options.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
            const fileData = fs.readFileSync(filePath);
            let body = `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="image"; filename="${path.basename(filePath)}"\r\n`;
            body += `Content-Type: image/jpeg\r\n\r\n`;
            const bodyBuffer = Buffer.concat([
                Buffer.from(body),
                fileData,
                Buffer.from(`\r\n--${boundary}--\r\n`)
            ]);
            options.headers['Content-Length'] = bodyBuffer.length;
            const reqHttp = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try { resolve(JSON.parse(data)); } catch(e) { resolve({ text: data }); }
                });
            });
            reqHttp.on('error', reject);
            reqHttp.write(bodyBuffer);
            reqHttp.end();
        } else {
            // درخواست JSON معمولی
            options.headers['Content-Type'] = 'application/json';
            const bodyData = JSON.stringify(payload);
            options.headers['Content-Length'] = Buffer.byteLength(bodyData);
            const reqHttp = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try { resolve(JSON.parse(data)); } catch(e) { resolve({ text: data }); }
                });
            });
            reqHttp.on('error', reject);
            reqHttp.write(bodyData);
            reqHttp.end();
        }
    });
}

// ============================
//  گرداننده اصلی
// ============================
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // سرویس فایل‌های استاتیک (صفحه وب)
    if (pathname === '/' || pathname === '/index.html') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('404 Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // فقط مسیر API را قبول می‌کنیم
    if (pathname !== '/api/orchestrator/process') {
        sendJSON(res, 404, { error: 'Not found' });
        return;
    }

    if (req.method !== 'POST') {
        sendJSON(res, 405, { error: 'Method not allowed' });
        return;
    }

    const inputType = detectInputType(req);
    const pipeline = pipelineRules[inputType] || [];

    if (pipeline.length === 0) {
        sendJSON(res, 400, { error: 'Unsupported input type' });
        return;
    }

    let intermediateData = {};
    let tempFilePath = null;

    // استخراج داده از درخواست
    if (inputType === 'text') {
        const body = await getBody(req);
        try {
            const json = JSON.parse(body);
            intermediateData.text = json.text || '';
        } catch {
            sendJSON(res, 400, { error: 'Invalid JSON' });
            return;
        }
    } else if (inputType === 'file') {
        // پردازش ساده multipart/form-data (فقط یک فایل)
        const bodyBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', reject);
        });
        const boundary = req.headers['content-type'].split('boundary=')[1];
        if (!boundary) {
            sendJSON(res, 400, { error: 'No boundary found' });
            return;
        }
        // استخراج نام فایل و محتوا
        const fileMatch = bodyBuffer.toString().match(/filename="(.+?)"/);
        if (!fileMatch) {
            sendJSON(res, 400, { error: 'No file found' });
            return;
        }
        const fileName = fileMatch[1];
        const start = bodyBuffer.indexOf('\r\n\r\n') + 4;
        const end = bodyBuffer.lastIndexOf(`--${boundary}--`);
        const fileContent = bodyBuffer.slice(start, end);
        tempFilePath = path.join(UPLOAD_DIR, Date.now() + '_' + fileName);
        fs.writeFileSync(tempFilePath, fileContent);
        intermediateData.filePath = tempFilePath;
        intermediateData.originalName = fileName;
    }

    // اجرای زنجیره
    for (let i = 0; i < pipeline.length; i++) {
        const step = pipeline[i];
        let result;
        try {
            if (step === 'ocr') {
                if (!SERVICES.ocr) throw new Error('OCR service not configured');
                result = await callHttpService(SERVICES.ocr, 'POST', null, true, intermediateData.filePath);
                intermediateData.extractedText = result.text || result.data || '';
            } else if (step === 'nlp') {
                const textToAnalyze = intermediateData.extractedText || intermediateData.text;
                if (!SERVICES.nlp) throw new Error('NLP service not configured');
                result = await callHttpService(SERVICES.nlp, 'GET', { text: textToAnalyze });
                intermediateData.analysis = result;
            } else if (step === 'tts') {
                const textToSpeak = intermediateData.analysis?.summary || intermediateData.extractedText || intermediateData.text;
                if (!SERVICES.tts) throw new Error('TTS service not configured');
                result = await callHttpService(SERVICES.tts, 'POST', { text: textToSpeak });
                intermediateData.audioUrl = result.audioUrl || '/audio-cache/sample.mp3';
            }
        } catch (err) {
            // پاکسازی فایل موقت
            if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            sendJSON(res, 500, { error: `Pipeline failed at step ${step}`, details: err.message });
            return;
        }
    }

    // پاکسازی فایل موقت
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    sendJSON(res, 200, {
        success: true,
        inputType,
        pipeline,
        result: {
            extractedText: intermediateData.extractedText,
            analysis: intermediateData.analysis,
            audioUrl: intermediateData.audioUrl
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 TetraBrain Orchestrator running on port ${PORT}`);
    console.log(`📡 Connected to real services (OCR, NLP, TTS) – adjust URLs in SERVICES object`);
});
