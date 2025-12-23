export interface PredictionFactors {
    errorCode: string;
    operationName: string;
    timestamp: Date;
    userId?: string;
    requestId?: string;
    serviceTier?: 'free' | 'pro' | 'enterprise';
}
export interface PredictionResult {
    score: number;
    confidence: number;
    recommendations: string[];
    estimatedMTTR: number;
    factors?: {
        errorFrequency: number;
        businessCriticality: number;
        timeSensitivity: number;
        userImpact: number;
    };
}
export declare class AdvancedImpactPredictor {
    private static readonly FACTOR_WEIGHTS;
    private static readonly CRITICAL_OPERATIONS;
    private static readonly IMPORTANT_OPERATIONS;
    private static readonly HIGH_IMPACT_ERRORS;
    private static readonly MEDIUM_IMPACT_ERRORS;
    static predictImpact(factors: PredictionFactors): Promise<PredictionResult>;
    private static calculateErrorFrequencyScore;
    private static calculateBusinessCriticalityScore;
    private static calculateTimeSensitivityScore;
    private static calculateUserImpactScore;
    private static estimateMTTR;
    private static generateRecommendations;
    private static calculateConfidence;
    private static round;
    static trainModel(trainingData: Array<{
        features: PredictionFactors;
        actualImpact: number;
        actualMTTR: number;
    }>): Promise<{
        success: boolean;
        accuracy?: number;
    }>;
}
//# sourceMappingURL=AdvancedImpactPredictor.d.ts.map