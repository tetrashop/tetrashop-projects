/**
 * توابع ابزار منطق کسب‌وکار - نسخه آزمون‌پذیر و با مدیریت خطا
 */

// 1. سرویس مدیریت خطا (متمرکز)
export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public userMessage?: string,
        public originalError?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleApiError = (error: any): never => {
    console.error('[API Error]', error);
    
    if (error instanceof AppError) {
        throw error;
    }
    
    // طبقه‌بندی خطاهای شناخته شده
    if (error.message?.includes('network') || error.message?.includes('Network')) {
        throw new AppError(
            'خطای شبکه رخ داده است.',
            'NETWORK_ERROR',
            'اتصال اینترنت خود را بررسی کنید و دوباره تلاش نمایید.',
            error
        );
    }
    
    if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
        throw new AppError(
            'درخواست شما به دلیل طولانی شدن زمان پاسخ لغو شد.',
            'TIMEOUT_ERROR',
            'لطفاً کمی بعد مجدداً اقدام کنید.',
            error
        );
    }
    
    // خطای پیش‌فرض
    throw new AppError(
        `خطای سیستمی: ${error.message || 'ناشناخته'}`,
        'UNKNOWN_ERROR',
        'عملیات با مشکل مواجه شد. لطفاً با پشتیبانی تماس بگیرید.',
        error
    );
};

// 2. توابع ابزار اصلی - با منطق قابل تست
export const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        active: 'bg-emerald-500',
        inactive: 'bg-rose-500',
        warning: 'bg-amber-500',
        online: 'bg-emerald-500',
        offline: 'bg-rose-500',
        checking: 'bg-amber-500',
        degraded: 'bg-amber-500'
    };
    
    return colorMap[status] || 'bg-gray-500';
};

export const getStatusText = (status: string): string => {
    const textMap: Record<string, string> = {
        active: 'فعال',
        inactive: 'غیرفعال',
        warning: 'هشدار',
        online: 'آنلاین',
        offline: 'آفلاین',
        checking: 'در حال بررسی',
        degraded: 'تضعیف شده'
    };
    
    return textMap[status] || status;
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return '--';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('تاریخ نامعتبر است');
        }
        
        return date.toLocaleDateString('fa-IR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.warn('[formatDate] خطا در فرمت تاریخ:', dateString, error);
        return 'تاریخ نامعتبر';
    }
};

export const formatResponseTime = (ms: number): string => {
    if (ms < 0) return '0ms';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
};

// 3. شبیه‌سازی اجرای سرویس - نسخه واقع‌گرایانه با حالت‌های خطا
interface MockExecutionConfig {
    successRate: number; // بین 0 تا 1
    minDelay: number;   // حداقل تاخیر بر حسب میلی‌ثانیه
    maxDelay: number;   // حداکثر تاخیر بر حسب میلی‌ثانیه
    errorTypes: Array<{type: string, chance: number, message: string}>;
}

const defaultConfig: MockExecutionConfig = {
    successRate: 0.92, // 92% نرخ موفقیت
    minDelay: 300,
    maxDelay: 2500,
    errorTypes: [
        { type: 'NETWORK_ERROR', chance: 0.03, message: 'خطا در ارتباط با سرور' },
        { type: 'VALIDATION_ERROR', chance: 0.02, message: 'داده‌های ورودی نامعتبر است' },
        { type: 'SERVER_ERROR', chance: 0.02, message: 'خطای داخلی سرور (۵۰۰)' },
        { type: 'TIMEOUT_ERROR', chance: 0.01, message: 'زمان اجرای درخواست به پایان رسید' }
    ]
};

export const mockServiceExecution = async (
    serviceName: string,
    config: Partial<MockExecutionConfig> = {}
): Promise<any> => {
    const finalConfig = { ...defaultConfig, ...config };
    
    // شبیه‌سازی تاخیر شبکه/پردازش
    const delay = finalConfig.minDelay + Math.random() * (finalConfig.maxDelay - finalConfig.minDelay);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // تصمیم‌گیری بر اساس نرخ موفقیت
    const shouldSucceed = Math.random() < finalConfig.successRate;
    
    if (!shouldSucceed) {
        // انتخاب نوع خطا بر اساس احتمال
        const rand = Math.random();
        let cumulativeChance = 0;
        
        for (const errorType of finalConfig.errorTypes) {
            cumulativeChance += errorType.chance;
            if (rand <= cumulativeChance) {
                throw new AppError(
                    `سرویس "${serviceName}" با خطا مواجه شد: ${errorType.message}`,
                    errorType.type,
                    `عملیات "${serviceName}" ناموفق بود. لطفاً دوباره تلاش کنید.`
                );
            }
        }
        
        // خطای پیش‌فرض
        throw new AppError(
            `خطای نامشخص در اجرای سرویس "${serviceName}"`,
            'UNKNOWN_ERROR',
            'عملیات با مشکل مواجه شد. لطفاً دوباره تلاش کنید.'
        );
    }
    
    // شبیه‌سازی نتیجه موفق
    return {
        success: true,
        requestId: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        processingTime: `${Math.round(delay)}ms`,
        remaining_credits: Math.floor(Math.random() * 900) + 100,
        data: {
            serviceName,
            timestamp: new Date().toISOString(),
            result: `سرویس "${serviceName}" با موفقیت پردازش شد.`,
            confidence: (Math.random() * 0.3 + 0.7).toFixed(2) // اطمینان 70% تا 100%
        }
    };
};

// 4. متریک‌های عملکردی (برای گزارش‌گیری)
export const calculatePerformanceMetrics = (entries: Array<{duration: number, success: boolean}>): {
    averageResponseTime: number;
    successRate: number;
    p95ResponseTime: number;
    totalRequests: number;
    errorCount: number;
} => {
    if (entries.length === 0) {
        return {
            averageResponseTime: 0,
            successRate: 0,
            p95ResponseTime: 0,
            totalRequests: 0,
            errorCount: 0
        };
    }
    
    const successfulEntries = entries.filter(e => e.success);
    const durations = entries.map(e => e.duration).sort((a, b) => a - b);
    
    return {
        averageResponseTime: durations.reduce((sum, d) => sum + d, 0) / durations.length,
        successRate: (successfulEntries.length / entries.length) * 100,
        p95ResponseTime: durations[Math.floor(durations.length * 0.95)],
        totalRequests: entries.length,
        errorCount: entries.length - successfulEntries.length
    };
};
