export declare function getUserById(userId: string, requestMetadata?: {
    requestId?: string;
    callerService?: string;
}): Promise<{
    success: boolean;
    data?: any;
    error?: import("../errors/AppError").AppError;
    metrics?: any;
}>;
export declare function createUser(userData: {
    name: string;
    email: string;
    tier?: 'free' | 'pro' | 'enterprise';
}, requestMetadata?: any): Promise<{
    success: boolean;
    data?: {
        success: boolean;
        message: string;
        id: string;
        name: string;
        email: string;
        tier: "free" | "pro" | "enterprise";
        createdAt: string;
    } | undefined;
    error?: import("../errors/AppError").AppError;
    metrics?: any;
}>;
export declare function updateUser(userId: string, updates: any, requestMetadata?: any): Promise<{
    success: boolean;
    data?: {
        success: boolean;
        message: string;
        updatedFields: string[];
        id: string;
        name: string;
        email: string;
        tier: "pro";
    } | {
        success: boolean;
        message: string;
        updatedFields: string[];
        id: string;
        name: string;
        email: string;
        tier: "enterprise";
    } | {
        success: boolean;
        message: string;
        updatedFields: string[];
        id: string;
        name: string;
        email: string;
        tier: "free";
    } | undefined;
    error?: import("../errors/AppError").AppError;
    metrics?: any;
}>;
export declare function deleteUser(userId: string, requestMetadata?: any): Promise<{
    success: boolean;
    data?: {
        success: boolean;
        message: string;
        deletedUser: {
            id: string;
            name: string;
            email: string;
            tier: "pro";
        } | {
            id: string;
            name: string;
            email: string;
            tier: "free";
        };
        remainingUsers: number;
    } | undefined;
    error?: import("../errors/AppError").AppError;
    metrics?: any;
}>;
export declare function searchUsers(query: {
    name?: string;
    email?: string;
    tier?: string;
    limit?: number;
}, requestMetadata?: any): Promise<{
    success: boolean;
    data?: {
        success: boolean;
        count: number;
        total: number;
        users: ({
            id: string;
            name: string;
            email: string;
            tier: "pro";
        } | {
            id: string;
            name: string;
            email: string;
            tier: "enterprise";
        } | {
            id: string;
            name: string;
            email: string;
            tier: "free";
        })[];
        query: {
            name?: string;
            email?: string;
            tier?: string;
            limit?: number;
        };
        executedAt: string;
    } | undefined;
    error?: import("../errors/AppError").AppError;
    metrics?: any;
}>;
//# sourceMappingURL=UserService.d.ts.map