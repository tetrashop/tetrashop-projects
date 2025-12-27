"use strict";
(() => {
var exports = {};
exports.id = 34;
exports.ids = [34];
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

/***/ 3289:
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

// NAMESPACE OBJECT: ./app/api/nlp-proxy/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (GET)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(6145);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9532);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(3804);
;// CONCATENATED MODULE: ./app/api/nlp-proxy/route.ts

async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("id");
    const apiUrl = projectId ? `https://tetrashop-projects.vercel.app/api/nlp?id=${projectId}` : "https://tetrashop-projects.vercel.app/api/nlp";
    try {
        const response = await fetch(apiUrl, {
            headers: {
                "User-Agent": "TetraSaaS-NLP-Platform/1.0"
            }
        });
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        return next_response/* default.json */.Z.json(data, {
            status: 200
        });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return next_response/* default.json */.Z.json({
            error: "خطا در ارتباط با سرور خارجی",
            message: error instanceof Error ? error.message : "Unknown error",
            usingFallback: true
        }, {
            status: 502
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fnlp-proxy%2Froute&name=app%2Fapi%2Fnlp-proxy%2Froute&pagePath=private-next-app-dir%2Fapi%2Fnlp-proxy%2Froute.ts&appDir=%2Fdata%2Fdata%2Fcom.termux%2Ffiles%2Fhome%2Ftetrashop-projects%2Fnlp-project%2Fapp&appPaths=%2Fapi%2Fnlp-proxy%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/nlp-proxy",
    resolvedPagePath: "/data/data/com.termux/files/home/tetrashop-projects/nlp-project/app/api/nlp-proxy/route.ts",
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

    const originalPathname = "/api/nlp-proxy/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [636,474], () => (__webpack_exec__(3289)));
module.exports = __webpack_exports__;

})();