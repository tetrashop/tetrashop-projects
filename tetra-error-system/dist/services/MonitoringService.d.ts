export declare class MonitoringService {
    static init(): void;
    static recordSuccess(operation: string, duration: number, metadata?: any): void;
    static recordOperationComplete(operation: string, success: boolean, duration: number, impactScore?: number): void;
    static reportError(log: any): void;
    static sendAlert(channel: 'slack' | 'pagerduty' | 'email', message: any): Promise<void>;
    static getMetrics(): Promise<string>;
    static getErrorReport(timeframe?: '24h' | '7d' | '30d'): Promise<any>;
    private static calculateMTTRFromScore;
    private static logToInternalSystem;
    static healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        checks: Array<{
            service: string;
            status: boolean;
            message?: string;
        }>;
        timestamp: string;
    }>;
}
//# sourceMappingURL=MonitoringService.d.ts.map