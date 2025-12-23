export interface ErrorRecord {
    id: string;
    errorCode: string;
    operationName: string;
    timestamp: Date;
    resolved: boolean;
    resolutionTime?: number;
    userId?: string;
    serviceTier?: string;
    impactScore?: number;
    actualMTTR?: number;
    metadata?: Record<string, any>;
}
export declare class ErrorHistoryService {
    private static errors;
    private static readonly MAX_HISTORY;
    static recordError(error: Omit<ErrorRecord, 'id' | 'resolved'>): Promise<string>;
    static markAsResolved(errorId: string, resolutionTime: number): Promise<boolean>;
    static getErrorStats(errorCode?: string, operation?: string): Promise<{
        totalOccurrences: number;
        recentOccurrences: number;
        avgResolutionTime: number;
        resolvedCount: number;
        unresolvedCount: number;
        mostCommonOperations: string[];
    }>;
    static getMTTRAnalysis(days?: number): Promise<{
        period: string;
        totalErrors: number;
        avgMTTR: number;
        byErrorCode: Array<{
            errorCode: string;
            count: number;
            avgMTTR: number;
        }>;
        trend: 'improving' | 'stable' | 'worsening';
        recommendations: string[];
    }>;
    static getErrors(filters?: {
        errorCode?: string;
        operationName?: string;
        resolved?: boolean;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<ErrorRecord[]>;
    static clearOldRecords(daysToKeep?: number): Promise<number>;
    private static generateId;
}
//# sourceMappingURL=ErrorHistoryService.d.ts.map