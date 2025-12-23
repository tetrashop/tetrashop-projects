export interface ErrorContext {
    originalError?: any;
    userId?: string;
    requestId?: string;
    operationName?: string;
    timestamp?: string;
    [key: string]: any;
}
export declare class AppError extends Error {
    readonly code: string;
    readonly context?: ErrorContext;
    readonly timestamp: Date;
    constructor(code: string, message: string, context?: ErrorContext);
    toJSON(): {
        name: string;
        code: string;
        message: string;
        context: ErrorContext | undefined;
        timestamp: string;
        stack: string | undefined;
    };
    toString(): string;
}
export declare class ValidationError extends AppError {
    field: string;
    constructor(message: string, field: string, context?: ErrorContext);
}
export declare class DatabaseError extends AppError {
    constructor(operation: string, originalError?: any, context?: ErrorContext);
}
export declare class NetworkError extends AppError {
    readonly statusCode?: number | undefined;
    constructor(service: string, statusCode?: number | undefined, originalError?: any, context?: ErrorContext);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string, context?: ErrorContext);
}
export declare class AuthorizationError extends AppError {
    constructor(resource: string, action: string, userId?: string, context?: ErrorContext);
}
export declare class PaymentError extends AppError {
    readonly transactionId?: string | undefined;
    constructor(gateway: string, transactionId?: string | undefined, originalError?: any, context?: ErrorContext);
}
export declare class BusinessLogicError extends AppError {
    constructor(rule: string, message: string, context?: ErrorContext);
}
export declare class ResourceNotFoundError extends AppError {
    constructor(resourceType: string, resourceId: string | number, context?: ErrorContext);
}
export declare class ResourceConflictError extends AppError {
    constructor(resourceType: string, conflictDetails: string, context?: ErrorContext);
}
export declare class RateLimitError extends AppError {
    constructor(limit: number, window: string, retryAfter?: number, context?: ErrorContext);
}
export declare function createError(code: string, message: string, context?: ErrorContext): AppError;
export declare function isAppError(error: any): error is AppError;
//# sourceMappingURL=AppError.d.ts.map