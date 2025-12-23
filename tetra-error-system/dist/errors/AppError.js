"use strict";
// فایل: src/errors/AppError.ts
// کلاس‌های خطای اصلی سیستم
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = exports.ResourceConflictError = exports.ResourceNotFoundError = exports.BusinessLogicError = exports.PaymentError = exports.AuthorizationError = exports.AuthenticationError = exports.NetworkError = exports.DatabaseError = exports.ValidationError = exports.AppError = void 0;
exports.createError = createError;
exports.isAppError = isAppError;
class AppError extends Error {
    constructor(code, message, context) {
        super(message);
        this.code = code;
        this.name = 'AppError';
        this.context = context;
        this.timestamp = new Date();
        // حفظ stack trace اصلی
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack
        };
    }
    toString() {
        return `[${this.code}] ${this.message} (${this.timestamp.toISOString()})`;
    }
}
exports.AppError = AppError;
// خطاهای اعتبارسنجی
class ValidationError extends AppError {
    constructor(message, field, context) {
        super('VALIDATION_FAILED', `Validation error in ${field}: ${message}`, {
            ...context,
            field
        });
        this.field = field;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
// خطاهای پایگاه داده
class DatabaseError extends AppError {
    constructor(operation, originalError, context) {
        super('DATABASE_ERROR', `DB operation '${operation}' failed`, {
            ...context,
            operation,
            originalError
        });
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
// خطاهای شبکه و ارتباطات خارجی
class NetworkError extends AppError {
    constructor(service, statusCode, originalError, context) {
        const message = statusCode
            ? `Network error calling ${service}: HTTP ${statusCode}`
            : `Network error calling ${service}`;
        super('NETWORK_ERROR', message, {
            ...context,
            service,
            statusCode,
            originalError
        });
        this.statusCode = statusCode;
        this.name = 'NetworkError';
    }
}
exports.NetworkError = NetworkError;
// خطاهای مجوز و احراز هویت
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', context) {
        super('AUTHENTICATION_FAILED', message, context);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(resource, action, userId, context) {
        super('AUTHORIZATION_FAILED', `User ${userId || 'unknown'} not authorized to ${action} ${resource}`, { ...context, resource, action, userId });
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
// خطاهای پرداخت
class PaymentError extends AppError {
    constructor(gateway, transactionId, originalError, context) {
        super('PAYMENT_FAILED', `Payment via ${gateway} failed`, {
            ...context,
            gateway,
            transactionId,
            originalError
        });
        this.transactionId = transactionId;
        this.name = 'PaymentError';
    }
}
exports.PaymentError = PaymentError;
// خطاهای منطق کسب‌وکار
class BusinessLogicError extends AppError {
    constructor(rule, message, context) {
        super('BUSINESS_LOGIC_ERROR', `Business rule violation [${rule}]: ${message}`, {
            ...context,
            rule
        });
        this.name = 'BusinessLogicError';
    }
}
exports.BusinessLogicError = BusinessLogicError;
// خطاهای منابع
class ResourceNotFoundError extends AppError {
    constructor(resourceType, resourceId, context) {
        super('RESOURCE_NOT_FOUND', `${resourceType} with ID ${resourceId} not found`, { ...context, resourceType, resourceId });
        this.name = 'ResourceNotFoundError';
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class ResourceConflictError extends AppError {
    constructor(resourceType, conflictDetails, context) {
        super('RESOURCE_CONFLICT', `${resourceType} conflict: ${conflictDetails}`, { ...context, resourceType, conflictDetails });
        this.name = 'ResourceConflictError';
    }
}
exports.ResourceConflictError = ResourceConflictError;
// خطاهای محدودیت نرخ
class RateLimitError extends AppError {
    constructor(limit, window, retryAfter, context) {
        const message = `Rate limit exceeded: ${limit} requests per ${window}`;
        super('RATE_LIMIT_EXCEEDED', message, {
            ...context,
            limit,
            window,
            retryAfter
        });
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
// Utility function for creating custom errors
function createError(code, message, context) {
    return new AppError(code, message, context);
}
// Type guard for AppError
function isAppError(error) {
    return error instanceof AppError;
}
//# sourceMappingURL=AppError.js.map