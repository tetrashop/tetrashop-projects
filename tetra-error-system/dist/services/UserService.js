"use strict";
// فایل: src/services/UserService.ts - نسخه نهایی بدون خطا
// نمونه سرویس کاربر با استفاده از سیستم مدیریت خطا
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.searchUsers = searchUsers;
const ErrorHandlerService_1 = require("./ErrorHandlerService");
const AppError_1 = require("../errors/AppError");
// --- شبیه‌سازی پایگاه داده ---
const mockUsers = [
    { id: '123', name: 'Test User', email: 'user@tetrasaas.com', tier: 'pro' },
    { id: '456', name: 'Admin User', email: 'admin@tetrasaas.com', tier: 'enterprise' },
    { id: '789', name: 'Free User', email: 'free@tetrasaas.com', tier: 'free' }
];
async function mockDatabaseAccess(userId) {
    // شبیه‌سازی تاخیر شبکه
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    // شبیه‌سازی خطاهای مختلف
    if (userId === 'trigger-db-error') {
        throw new Error('Database connection timeout: Could not connect to primary replica');
    }
    if (userId === 'trigger-validation') {
        throw new Error('Invalid user data format');
    }
    // پیدا کردن کاربر
    const user = mockUsers.find(u => u.id === userId);
    return user || null;
}
// -----------------------------
async function getUserById(userId, requestMetadata) {
    return (0, ErrorHandlerService_1.executeWithErrorHandling)(async () => {
        // ۱. اعتبارسنجی ورودی
        if (!userId || userId.trim().length === 0) {
            throw new AppError_1.ValidationError('User ID is required and cannot be empty', 'userId', {
                ...requestMetadata,
                inputValue: userId
            });
        }
        if (userId.length < 3) {
            throw new AppError_1.ValidationError('User ID must be at least 3 characters long', 'userId', {
                ...requestMetadata,
                inputValue: userId,
                minLength: 3,
                actualLength: userId.length
            });
        }
        // ۲. اعتبارسنجی فرمت (مثال: باید شامل اعداد باشد)
        if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
            throw new AppError_1.ValidationError('User ID contains invalid characters', 'userId', {
                ...requestMetadata,
                inputValue: userId,
                allowedPattern: 'alphanumeric, dash, underscore'
            });
        }
        // ۳. دسترسی به دیتابیس
        const user = await mockDatabaseAccess(userId);
        if (!user) {
            throw new AppError_1.ResourceNotFoundError('User', userId, {
                ...requestMetadata,
                searchCriteria: { userId },
                attemptedOperation: 'findUser'
            });
        }
        // ۴. پردازش منطق کسب‌وکار
        if (user.tier === 'free' && user.email.includes('tetrasaas.com')) {
            // مثال: اعتبارسنجی کسب‌وکار
            console.log('[BUSINESS] Internal free user detected');
        }
        // ۵. بازگرداندن نتیجه
        return {
            ...user,
            fetchedAt: new Date().toISOString(),
            metadata: {
                requestId: requestMetadata?.requestId,
                processingTime: Date.now()
            }
        };
    }, 'getUserById', {
        userId,
        serviceTier: 'pro'
    });
}
// سرویس ایجاد کاربر
async function createUser(userData, requestMetadata) {
    return (0, ErrorHandlerService_1.executeWithErrorHandling)(async () => {
        // اعتبارسنجی‌ها
        if (!userData.name || userData.name.trim().length < 2) {
            throw new AppError_1.ValidationError('Name must be at least 2 characters', 'name', {
                ...requestMetadata,
                inputValue: userData.name
            });
        }
        if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
            throw new AppError_1.ValidationError('Valid email is required', 'email', {
                ...requestMetadata,
                inputValue: userData.email
            });
        }
        // شبیه‌سازی ذخیره در دیتابیس
        await new Promise(resolve => setTimeout(resolve, 150));
        // شبیه‌سازی خطای تکراری
        if (mockUsers.some(u => u.email === userData.email)) {
            throw new AppError_1.DatabaseError('insertUser', new Error('Duplicate email'), {
                ...requestMetadata,
                constraint: 'unique_email'
            });
        }
        const tier = userData.tier || 'free';
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            name: userData.name,
            email: userData.email,
            tier: tier,
            createdAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
        return {
            ...newUser,
            success: true,
            message: 'User created successfully'
        };
    }, 'createUser', {
        userId: 'system',
        serviceTier: userData.tier || 'free'
    });
}
// سرویس بروزرسانی کاربر
async function updateUser(userId, updates, requestMetadata) {
    return (0, ErrorHandlerService_1.executeWithErrorHandling)(async () => {
        // پیدا کردن کاربر
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new AppError_1.ResourceNotFoundError('User', userId, {
                ...requestMetadata,
                attemptedOperation: 'updateUser'
            });
        }
        const currentUser = mockUsers[userIndex]; // متغیر با نام جدید
        // اعتبارسنجی بروزرسانی‌ها
        if (updates.email && !/\S+@\S+\.\S+/.test(updates.email)) {
            throw new AppError_1.ValidationError('Invalid email format', 'email', {
                ...requestMetadata,
                inputValue: updates.email
            });
        }
        // شبیه‌سازی بروزرسانی
        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        const updatedUser = mockUsers[userIndex];
        return {
            ...updatedUser,
            success: true,
            message: 'User updated successfully',
            updatedFields: Object.keys(updates)
        };
    }, 'updateUser', {
        userId,
        serviceTier: mockUsers.find(u => u.id === userId)?.tier || 'free' // درست شده
    });
}
// سرویس حذف کاربر
async function deleteUser(userId, requestMetadata) {
    return (0, ErrorHandlerService_1.executeWithErrorHandling)(async () => {
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new AppError_1.ResourceNotFoundError('User', userId, {
                ...requestMetadata,
                attemptedOperation: 'deleteUser'
            });
        }
        const userToDelete = mockUsers[userIndex]; // متغیر با نام جدید
        // منطق کسب‌وکار: کاربران enterprise نمی‌توانند حذف شوند
        if (userToDelete.tier === 'enterprise') {
            throw new Error('Enterprise users cannot be deleted');
        }
        // شبیه‌سازی حذف
        mockUsers.splice(userIndex, 1);
        return {
            success: true,
            message: `User ${userId} deleted successfully`,
            deletedUser: userToDelete,
            remainingUsers: mockUsers.length
        };
    }, 'deleteUser', {
        userId,
        serviceTier: mockUsers.find(u => u.id === userId)?.tier || 'free' // درست شده
    });
}
// سرویس جستجوی کاربران
async function searchUsers(query, requestMetadata) {
    return (0, ErrorHandlerService_1.executeWithErrorHandling)(async () => {
        let results = [...mockUsers];
        // اعمال فیلترها
        if (query.name) {
            results = results.filter(u => u.name.toLowerCase().includes(query.name.toLowerCase()));
        }
        if (query.email) {
            results = results.filter(u => u.email.toLowerCase().includes(query.email.toLowerCase()));
        }
        if (query.tier) {
            results = results.filter(u => u.tier === query.tier);
        }
        // محدود کردن نتایج
        const limit = query.limit || 100;
        results = results.slice(0, limit);
        // شبیه‌سازی تاخیر جستجوی پیچیده
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        return {
            success: true,
            count: results.length,
            total: mockUsers.length,
            users: results,
            query,
            executedAt: new Date().toISOString()
        };
    }, 'searchUsers', {
        serviceTier: 'pro'
    });
}
//# sourceMappingURL=UserService.js.map