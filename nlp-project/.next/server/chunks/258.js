"use strict";
exports.id = 258;
exports.ids = [258];
exports.modules = {

/***/ 9704:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "No": () => (/* binding */ searchProjects),
/* harmony export */   "Rp": () => (/* binding */ getProjectById),
/* harmony export */   "Yw": () => (/* binding */ getAllProjects)
/* harmony export */ });
/* unused harmony exports nlpProjects, getProjectsByCategory, getLatestProjects, getPopularProjects, totalProjects, lastProjectId */
/**
 * داده‌های پروژه‌های NLP - 256 پروژه
 * تولید شده به صورت دینامیک
 */ // پروژه‌های نمونه (20 پروژه اول با جزئیات کامل)
const sampleProjects = [
    {
        id: 1,
        title: "پردازشگر هوشمند متن فارسی",
        description: "سیستم جامع تحلیل و پردازش متن‌های فارسی با قابلیت‌های پیشرفته",
        detailedDescription: "این پروژه یک چارچوب کامل برای پردازش متن‌های فارسی ارائه می‌دهد که شامل توکنایزینگ، نرمال‌سازی، ریشه‌یابی و استخراج ویژگی‌های زبانی می‌شود. از معماری‌های مبتنی بر Transformer استفاده می‌کند.",
        author: "دکتر علی محمدی",
        category: "پردازش متن",
        rating: 4.7,
        progress: 100,
        features: [
            "توکنایزینگ پیشرفته فارسی",
            "ریشه‌یابی کلمات",
            "حذف حروف ربط",
            "استخراج ویژگی‌های نحوی",
            "پشتیبانی از دیتاست‌های بزرگ"
        ],
        apiEndpoint: "/api/v1/text-processor",
        documentationUrl: "/docs/text-processor",
        githubUrl: "https://github.com/tetrashop/text-processor",
        lastUpdated: "2024-03-15",
        tags: [
            "پردازش متن",
            "فارسی",
            "هوش مصنوعی"
        ],
        usageExamples: [
            "پیش‌پردازش داده‌های متنی",
            "آماده‌سازی برای مدل‌های NLP"
        ],
        apiKeyRequired: false,
        starCount: 1245,
        downloadCount: 8900,
        version: "v2.1.0"
    },
    // 19 پروژه نمونه دیگر...
    {
        id: 20,
        title: "تحلیلگر احساسات پیشرفته",
        description: "سیستم تحلیل احساسات متن‌های فارسی با دقت بالا",
        detailedDescription: "مدل تحلیل احساسات مبتنی بر BERT که روی دیتاست بزرگی از نظرات فارسی آموزش دیده و قادر به تشخیص ۷ حالت احساسی مختلف است.",
        author: "پژوهشگاه علوم انسانی",
        category: "تحلیل احساسات",
        rating: 4.8,
        progress: 95,
        features: [
            "تشخیص ۷ حالت احساسی",
            "پشتیبانی از اصطلاحات محاوره",
            "تحلیل لحن متن",
            "خروجی احتمالاتی",
            "API ریست‌فول"
        ],
        apiEndpoint: "/api/v1/sentiment",
        documentationUrl: "/docs/sentiment",
        lastUpdated: "2024-03-10",
        tags: [
            "تحلیل احساسات",
            "فارسی",
            "BERT"
        ],
        usageExamples: [
            "تحلیل نظرات کاربران",
            "مانیتورینگ برند"
        ],
        apiKeyRequired: true,
        starCount: 876,
        downloadCount: 5400
    }
];
// تابع تولید پروژه‌های دینامیک (پروژه‌های 21 تا 256)
function generateDynamicProjects() {
    const projects = [];
    const categories = [
        "پردازش متن",
        "ترجمه ماشینی",
        "تحلیل احساسات",
        "پاسخ‌گویی به سوالات",
        "تولید متن",
        "خلاصه‌سازی",
        "تشخیص موجودیت",
        "دسته‌بندی متن"
    ];
    const featuresPool = [
        "API کامل RESTful",
        "مستندات فارسی",
        "پشتیبانی بلندمدت",
        "مقیاس‌پذیر",
        "امنیت بالا",
        "سرعت پردازش بالا",
        "پشتیبانی از فرمت‌های مختلف",
        "داکت‌شده",
        "قابل استقرار روی سرور داخلی"
    ];
    for(let i = 21; i <= 256; i++){
        const category = categories[Math.floor(Math.random() * categories.length)];
        const progress = Math.floor(Math.random() * 30) + 70; // 70-100%
        projects.push({
            id: i,
            title: `پروژه NLP شماره ${i}`,
            description: `توضیحات مختصر برای پروژه پردازش زبان طبیعی شماره ${i}`,
            detailedDescription: `این پروژه یک سیستم ${category} است که برای کاربردهای مختلف صنعتی و تحقیقاتی توسعه یافته.`,
            author: `تیم تحقیقاتی ${Math.floor(Math.random() * 100) + 1}`,
            category,
            rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
            progress,
            features: featuresPool.slice(0, Math.floor(Math.random() * 4) + 3),
            apiEndpoint: `/api/v1/project-${i}`,
            documentationUrl: `/docs/project-${i}`,
            githubUrl: `https://github.com/tetrashop/project-${i}`,
            lastUpdated: `2024-0${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 28) + 1}`,
            tags: [
                "NLP",
                "هوش مصنوعی",
                category
            ],
            usageExamples: [
                "پردازش متن",
                "تحلیل داده",
                "اتوماسیون"
            ],
            apiKeyRequired: Math.random() > 0.4,
            starCount: Math.floor(Math.random() * 1000),
            downloadCount: Math.floor(Math.random() * 10000)
        });
    }
    return projects;
}
// پروژه ویژه 256
const specialProject256 = {
    id: 256,
    title: "سامانه هوشمند پاسخ‌گویی به پرسش‌های پیچیده",
    description: "پیشرفته‌ترین سیستم QA برای پاسخ به سوالات تخصصی با دقت ۹۵٪",
    detailedDescription: "آخرین و پیشرفته‌ترین پروژه NLP ما که از معماری Mixture of Experts استفاده می‌کند. این سیستم قادر به پاسخ‌گویی به سوالات پیچیده در حوزه‌های پزشکی، حقوقی، فنی و علوم انسانی است.",
    author: "آزمایشگاه هوش مصنوعی پیشرفته تتراشاپ",
    category: "پاسخ‌گویی به سوالات",
    rating: 4.9,
    progress: 98,
    features: [
        "پاسخ‌گویی چندحوزه‌ای",
        "ارجاع به منابع معتبر",
        "یادگیری تطبیقی",
        "پشتیبانی از ۵ زبان",
        "سیستم اعتبارسنجی پاسخ‌ها",
        "لاگ‌گیری کامل"
    ],
    apiEndpoint: "/api/v1/qa-advanced",
    documentationUrl: "/docs/qa-advanced",
    githubUrl: "https://github.com/tetrashop/qa-advanced",
    lastUpdated: "2024-03-20",
    tags: [
        "QA",
        "پیشرفته",
        "چندحوزه‌ای",
        "هوش مصنوعی",
        "فارسی"
    ],
    usageExamples: [
        "پاسخ به سوالات پزشکی",
        "مشاوره حقوقی اولیه",
        "پاسخ به سوالات فنی",
        "آموزش تعاملی",
        "پشتیبانی مشتریان"
    ],
    apiKeyRequired: true,
    starCount: 2547,
    downloadCount: 18500,
    version: "v3.0.0"
};
// ترکیب همه پروژه‌ها
const dynamicProjects = generateDynamicProjects();
const nlpProjects = [
    ...sampleProjects,
    ...dynamicProjects.slice(0, 235),
    specialProject256 // پروژه 256
];
// توابع کمکی
function getProjectById(id) {
    return nlpProjects.find((project)=>project.id === id) || null;
}
function getAllProjects() {
    return nlpProjects;
}
function getProjectsByCategory(category) {
    return nlpProjects.filter((project)=>project.category === category);
}
function searchProjects(query) {
    const searchTerm = query.toLowerCase();
    return nlpProjects.filter((project)=>project.title.toLowerCase().includes(searchTerm) || project.description.toLowerCase().includes(searchTerm) || project.tags.some((tag)=>tag.toLowerCase().includes(searchTerm)));
}
function getLatestProjects(count = 10) {
    return [
        ...nlpProjects
    ].sort((a, b)=>b.id - a.id).slice(0, count);
}
function getPopularProjects(count = 10) {
    return [
        ...nlpProjects
    ].sort((a, b)=>(b.starCount || 0) - (a.starCount || 0)).slice(0, count);
}
const totalProjects = nlpProjects.length;
const lastProjectId = 256;


/***/ }),

/***/ 840:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ NPLLayout),
  "metadata": () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(2817);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/react.shared-subset.js
var react_shared_subset = __webpack_require__(4212);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(2585);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(217);
;// CONCATENATED MODULE: ./components/nlp/NLPHeader.tsx




const NLPHeader = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx("header", {
        className: "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm",
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex justify-between items-center h-16",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                        href: "/nlp",
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center",
                                children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Brain */.amH, {
                                    className: "h-6 w-6 text-white"
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("h1", {
                                        className: "text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                                        children: "Tetrashop NLP"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                        className: "text-xs text-gray-500",
                                        children: "پروژه‌های هوش مصنوعی"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("nav", {
                        className: "hidden md:flex items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                href: "/",
                                className: "flex items-center gap-2 text-gray-700 hover:text-blue-600 transition",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Home */.SK8, {
                                        className: "h-4 w-4"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        children: "خانه"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                href: "/nlp",
                                className: "flex items-center gap-2 text-blue-600 font-semibold",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Brain */.amH, {
                                        className: "h-4 w-4"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        children: "پروژه‌ها"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                href: "/docs",
                                className: "flex items-center gap-2 text-gray-700 hover:text-blue-600 transition",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* BookOpen */.p1z, {
                                        className: "h-4 w-4"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        children: "مستندات"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                href: "/api",
                                className: "flex items-center gap-2 text-gray-700 hover:text-blue-600 transition",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* FileCode */.EOp, {
                                        className: "h-4 w-4"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        children: "API"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                href: "/team",
                                className: "flex items-center gap-2 text-gray-700 hover:text-blue-600 transition",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Users */.Qaw, {
                                        className: "h-4 w-4"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        children: "تیم"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                className: "px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition",
                                children: "درخواست API رایگان"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                    className: "font-bold text-gray-700",
                                    children: "\uD83D\uDC64"
                                })
                            })
                        ]
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const nlp_NLPHeader = (NLPHeader);

;// CONCATENATED MODULE: ./components/nlp/NLPFooter.tsx




const NLPFooter = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx("footer", {
        className: "bg-gradient-to-b from-gray-900 to-black text-white mt-16",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-8",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                    className: "text-xl font-bold mb-4",
                                    children: "Tetrashop NLP"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                    className: "text-gray-400 mb-6",
                                    children: "بزرگترین پلتفرم پروژه‌های پردازش زبان طبیعی در ایران، با ۲۵۶ پروژه فعال"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "flex gap-3",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                            href: "#",
                                            className: "w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Github */.Eye, {
                                                className: "h-5 w-5"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                            href: "#",
                                            className: "w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Twitter */.tLe, {
                                                className: "h-5 w-5"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                            href: "#",
                                            className: "w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Linkedin */.n6B, {
                                                className: "h-5 w-5"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                            href: "#",
                                            className: "w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Mail */.Mh9, {
                                                className: "h-5 w-5"
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                                    className: "font-semibold mb-4",
                                    children: "لینک‌های سریع"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/nlp",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "لیست پروژه‌ها"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/docs",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "مستندات"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/api",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "راهنمای API"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/pricing",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "تعرفه‌ها"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/blog",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "بلاگ"
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                                    className: "font-semibold mb-4",
                                    children: "دسته‌بندی‌ها"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/nlp/category/پردازش-متن",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "پردازش متن"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/nlp/category/ترجمه-ماشینی",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "ترجمه ماشینی"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/nlp/category/تحلیل-احساسات",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "تحلیل احساسات"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/nlp/category/پاسخ‌گویی-به-سوالات",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "پاسخ‌گویی به سوالات"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/nlp/category/تولید-متن",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "تولید متن"
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                                    className: "font-semibold mb-4",
                                    children: "تماس با ما"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                    className: "space-y-3 text-gray-400",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("li", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Mail */.Mh9, {
                                                    className: "h-4 w-4"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                    children: "support@tetrashop-nlp.ir"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("li", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    className: "w-4 h-4",
                                                    children: "\uD83D\uDCDE"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                    children: "۰۲۱-۱۲۳۴۵۶۷۸"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                                className: "text-sm",
                                                children: "تهران، خیابان ولیعصر"
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                            children: "\xa9 ۲۰۲۴ Tetrashop NLP. تمامی حقوق محفوظ است."
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                            className: "mt-2",
                            children: "آخرین بروزرسانی: پروژه شماره ۲۵۶ فعال شد"
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const nlp_NLPFooter = (NLPFooter);

;// CONCATENATED MODULE: ./app/nlp/layout.tsx




const metadata = {
    title: "پروژه‌های پردازش زبان طبیعی | Tetrashop",
    description: "مجموعه‌ای جامع از پروژه‌های هوش مصنوعی در حوزه پردازش زبان فارسی و انگلیسی",
    keywords: [
        "NLP",
        "هوش مصنوعی",
        "پردازش متن",
        "فارسی",
        "پروژه"
    ]
};
function NPLLayout({ children  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "min-h-screen flex flex-col",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(nlp_NLPHeader, {}),
            /*#__PURE__*/ jsx_runtime_.jsx("main", {
                className: "flex-grow",
                children: children
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(nlp_NLPFooter, {})
        ]
    });
}


/***/ })

};
;