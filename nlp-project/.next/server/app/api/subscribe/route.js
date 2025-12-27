"use strict";
(() => {
var exports = {};
exports.id = 925;
exports.ids = [925];
exports.modules = {

/***/ 7783:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@edge-runtime/cookies");

/***/ }),

/***/ 8530:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@opentelemetry/api");

/***/ }),

/***/ 4426:
/***/ ((module) => {

module.exports = require("next/dist/compiled/chalk");

/***/ }),

/***/ 252:
/***/ ((module) => {

module.exports = require("next/dist/compiled/cookie");

/***/ }),

/***/ 5856:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "headerHooks": () => (/* binding */ headerHooks),
  "originalPathname": () => (/* binding */ originalPathname),
  "requestAsyncStorage": () => (/* binding */ requestAsyncStorage),
  "routeModule": () => (/* binding */ routeModule),
  "serverHooks": () => (/* binding */ serverHooks),
  "staticGenerationAsyncStorage": () => (/* binding */ staticGenerationAsyncStorage),
  "staticGenerationBailout": () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/subscribe/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (GET),
  "POST": () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(6145);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9532);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(3804);
;// CONCATENATED MODULE: ./app/api/subscribe/route.ts

const subscriptions = new Map();
// سرویس‌های معتبر - حالا هر عددی برای NLP معتبر است
const validServices = {
    "nlp": "پلتفرم پروژه‌های NLP فارسی",
    "chess": "شطرنج هوشمند Tetris-Chess",
    "ocr": "سامانه ضد چندپارگی OCR",
    "garden": "باغ رازآلود",
    "assistant": "دستیار هوشمند فارسی"
};
// تابع جدید: تشخیص اینکه آیا سرویس مربوط به NLP است
function isNLPService(serviceId) {
    // اگر شناسه عددی است یا با 'nlp' شروع می‌شود
    return !isNaN(Number(serviceId)) || serviceId.toLowerCase().startsWith("nlp");
}
async function POST(request) {
    try {
        const body = await request.json();
        console.log("\uD83D\uDCE6 بدنه دریافتی:", JSON.stringify(body));
        const { serviceId , serviceName , userEmail ="user@tetrasaas.ir"  } = body;
        if (!serviceId || !serviceName) {
            console.log("❌ پارامترهای ناقص:", {
                serviceId,
                serviceName
            });
            return next_response/* default.json */.Z.json({
                success: false,
                error: "پارامترهای ورودی ناقص",
                message: "لطفاً شناسه سرویس (serviceId) و نام سرویس (serviceName) را ارسال کنید."
            }, {
                status: 400
            });
        }
        const serviceKey = serviceId.toString().toLowerCase().trim();
        console.log("\uD83D\uDD0D شناسه سرویس:", serviceKey);
        // منطق جدید: اگر سرویس NLP است، بپذیر
        let finalServiceKey = serviceKey;
        let serviceDisplayName = "";
        if (isNLPService(serviceKey)) {
            // این یک پروژه NLP است
            finalServiceKey = "nlp";
            serviceDisplayName = `پروژه NLP شماره ${serviceKey}`;
            console.log("✅ شناسه NLP تشخیص داده شد:", serviceKey);
        } else if (validServices[serviceKey]) {
            // سرویس‌های دیگر (chess, ocr, etc.)
            finalServiceKey = serviceKey;
            serviceDisplayName = validServices[serviceKey];
        } else {
            console.log("❌ سرویس نامعتبر:", serviceKey);
            return next_response/* default.json */.Z.json({
                success: false,
                error: "سرویس نامعتبر",
                message: `سرویس "${serviceId}" پشتیبانی نمی‌شود.`,
                validServices: [
                    "nlp (یا هر عددی)",
                    ...Object.keys(validServices)
                ]
            }, {
                status: 404
            });
        }
        // ایجاد کلید API
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const apiKey = `tetra_${finalServiceKey}_${serviceKey}_${timestamp}_${randomStr}`;
        const expiresAt = new Date(timestamp + 30 * 24 * 60 * 60 * 1000);
        // ذخیره اطلاعات
        const subscriptionId = `sub_${timestamp}`;
        const subscriptionData = {
            id: subscriptionId,
            serviceId: finalServiceKey,
            projectId: serviceKey,
            serviceName: serviceDisplayName || serviceName,
            apiKey,
            userEmail,
            expiresAt,
            createdAt: new Date(timestamp),
            requestCount: 0,
            isActive: true,
            tier: "free"
        };
        subscriptions.set(subscriptionId, subscriptionData);
        console.log("✅ اشتراک ایجاد شد:", subscriptionId);
        // پاسخ
        const responseData = {
            success: true,
            message: `اشتراک "${serviceDisplayName || serviceName}" با موفقیت فعال شد!`,
            data: {
                subscriptionId,
                apiKey,
                projectId: serviceKey,
                expiresAt: expiresAt.toLocaleDateString("fa-IR"),
                endpoint: `https://api.tetrasaas.ir/v1/${finalServiceKey}/${serviceKey}`,
                documentation: `/nlp/${serviceKey}`,
                limits: {
                    dailyRequests: 1000,
                    monthlyRequests: 30000,
                    rateLimit: "10 درخواست در ثانیه"
                }
            }
        };
        console.log("\uD83D\uDCE4 پاسخ ارسالی:", responseData);
        return next_response/* default.json */.Z.json(responseData, {
            status: 201
        });
    } catch (error) {
        console.error("❌ خطا در ایجاد اشتراک:", error);
        return next_response/* default.json */.Z.json({
            success: false,
            error: "خطای سرور",
            message: "سرور در پردازش درخواست با مشکل مواجه شد.",
            details: error instanceof Error ? error.message : "خطای ناشناخته"
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("apiKey");
    if (!apiKey) {
        return next_response/* default.json */.Z.json({
            success: false,
            error: "کلید API الزامی است"
        }, {
            status: 400
        });
    }
    const subscription = Array.from(subscriptions.values()).find((sub)=>sub.apiKey === apiKey);
    if (!subscription) {
        return next_response/* default.json */.Z.json({
            success: false,
            error: "اشتراک یافت نشد"
        }, {
            status: 404
        });
    }
    return next_response/* default.json */.Z.json({
        success: true,
        data: {
            serviceName: subscription.serviceName,
            projectId: subscription.projectId,
            expiresAt: subscription.expiresAt.toLocaleDateString("fa-IR"),
            requestCount: subscription.requestCount,
            isActive: subscription.isActive
        }
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fsubscribe%2Froute&name=app%2Fapi%2Fsubscribe%2Froute&pagePath=private-next-app-dir%2Fapi%2Fsubscribe%2Froute.ts&appDir=%2Fdata%2Fdata%2Fcom.termux%2Ffiles%2Fhome%2Ftetrashop-projects%2Fnlp-project%2Fapp&appPaths=%2Fapi%2Fsubscribe%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/subscribe",
    resolvedPagePath: "/data/data/com.termux/files/home/tetrashop-projects/nlp-project/app/api/subscribe/route.ts",
    nextConfigOutput: undefined,
  })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/api/subscribe/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [636,474], () => (__webpack_exec__(5856)));
module.exports = __webpack_exports__;

})();