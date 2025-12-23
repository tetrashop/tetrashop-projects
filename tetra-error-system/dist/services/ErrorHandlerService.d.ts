import { AppError } from '../errors/AppError';
export declare function executeWithErrorHandling<T>(operation: () => Promise<T>, operationName: string, metadata?: {
    userId?: string;
    requestId?: string;
    serviceTier?: 'free' | 'pro' | 'enterprise';
}): Promise<{
    success: boolean;
    data?: T;
    error?: AppError;
    metrics?: any;
}>;
export declare function withErrorHandling<T extends (...args: any[]) => Promise<any>>(operation: T, operationName: string): (...args: Parameters<T>) => ReturnType<typeof executeWithErrorHandling>;
//# sourceMappingURL=ErrorHandlerService.d.ts.map