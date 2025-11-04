/**
 * 🔌 سیستم پلاگین‌پذیر برای توسعه ماژولار
 * 🎯 قابلیت‌های: dependency injection، hot reload، isolation
 */

class PluginSystem {
    constructor() {
        this.plugins = new Map();
        this.dependencyGraph = new DependencyGraph();
        this.eventBus = new EventBus();
        this.sandbox = new SandboxEnvironment();
        
        this._initCoreServices();
    }

    async registerPlugin(pluginConfig) {
        const { id, name, version, dependencies = [], factory } = pluginConfig;

        // بررسی وابستگی‌ها
        await this._resolveDependencies(dependencies);

        // ایجاد instance پلاگین در sandbox
        const pluginInstance = await this.sandbox.createPlugin(factory);
        
        // ثبت پلاگین
        this.plugins.set(id, {
            id,
            name,
            version,
            instance: pluginInstance,
            dependencies,
            status: 'active'
        });

        // به‌روزرسانی گراف وابستگی
        this.dependencyGraph.addNode(id, dependencies);

        // emit event ثبت پلاگین
        this.eventBus.emit('plugin:registered', { pluginId: id });

        console.log(`✅ پلاگین "${name}" v${version} ثبت شد`);

        return pluginInstance;
    }

    async unregisterPlugin(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`پلاگین با شناسه ${pluginId} یافت نشد`);
        }

        // بررسی وابستگی‌های معکوس
        const dependents = this.dependencyGraph.getDependents(pluginId);
        if (dependents.length > 0) {
            throw new Error(`پلاگین توسط ${dependents.join(', ')} وابسته است`);
        }

        // غیرفعال کردن پلاگین
        if (plugin.instance.deactivate) {
            await plugin.instance.deactivate();
        }

        // حذف از سیستم
        this.plugins.delete(pluginId);
        this.dependencyGraph.removeNode(pluginId);

        this.eventBus.emit('plugin:unregistered', { pluginId });

        console.log(`🗑️ پلاگین "${pluginId}" حذف شد`);
    }

    getPlugin(pluginId) {
        return this.plugins.get(pluginId)?.instance;
    }

    async callPluginMethod(pluginId, methodName, ...args) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`پلاگین ${pluginId} یافت نشد`);
        }

        if (typeof plugin.instance[methodName] !== 'function') {
            throw new Error(`متد ${methodName} در پلاگین ${pluginId} وجود ندارد`);
        }

        try {
            return await plugin.instance[methodName](...args);
        } catch (error) {
            console.error(`❌ خطا در اجرای ${methodName} روی ${pluginId}:`, error);
            throw error;
        }
    }

    async _resolveDependencies(dependencies) {
        for (const dep of dependencies) {
            if (!this.plugins.has(dep)) {
                throw new Error(`وابستگی ${dep} یافت نشد`);
            }
        }
    }

    _initCoreServices() {
        // ثبت سرویس‌های هسته
        this.coreServices = {
            stateManager: stateManager,
            connectionManager: connectionManager,
            eventBus: this.eventBus
        };
    }

    // توسعه سیستم با پلاگین‌های جدید
    async extendSystem(extensionPoints) {
        for (const point of extensionPoints) {
            await this._applyExtension(point);
        }
    }

    async _applyExtension(extension) {
        const { target, method, wrapper } = extension;
        
        const original = this.coreServices[target]?.[method];
        if (typeof original !== 'function') {
            throw new Error(`هدف توسعه ${target}.${method} یافت نشد`);
        }

        // wrap کردن متد اصلی
        this.coreServices[target][method] = wrapper(original);

        console.log(`🔧 ${target}.${method} با موفقیت extend شد`);
    }
}

class DependencyGraph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(nodeId, dependencies = []) {
        this.nodes.set(nodeId, { id: nodeId });
        
        for (const dep of dependencies) {
            this.addEdge(nodeId, dep);
        }
    }

    addEdge(fromNode, toNode) {
        if (!this.edges.has(fromNode)) {
            this.edges.set(fromNode, new Set());
        }
        this.edges.get(fromNode).add(toNode);
    }

    removeNode(nodeId) {
        this.nodes.delete(nodeId);
        this.edges.delete(nodeId);
        
        // حذف لبه‌های ورودی
        for (const [fromNode, edges] of this.edges) {
            if (edges.has(nodeId)) {
                edges.delete(nodeId);
            }
        }
    }

    getDependents(nodeId) {
        const dependents = [];
        
        for (const [fromNode, edges] of this.edges) {
            if (edges.has(nodeId)) {
                dependents.push(fromNode);
            }
        }
        
        return dependents;
    }

    hasCycle() {
        // بررسی وجود cycle در گراف
        const visited = new Set();
        const recursionStack = new Set();

        const dfs = (nodeId) => {
            if (recursionStack.has(nodeId)) return true;
            if (visited.has(nodeId)) return false;

            visited.add(nodeId);
            recursionStack.add(nodeId);

            const edges = this.edges.get(nodeId) || new Set();
            for (const neighbor of edges) {
                if (dfs(neighbor)) return true;
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const nodeId of this.nodes.keys()) {
            if (dfs(nodeId)) return true;
        }

        return false;
    }
}

class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.delete(callback);
        }
    }

    emit(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ خطا در اجرای listener برای ${event}:`, error);
                }
            });
        }
    }
}

class SandboxEnvironment {
    constructor() {
        this.sandbox = this._createSandbox();
    }

    _createSandbox() {
        // ایجاد محیط ایزوله برای پلاگین‌ها
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        return iframe.contentWindow;
    }

    async createPlugin(factory) {
        // اجرای factory پلاگین در sandbox
        const pluginCode = `
            (function() {
                ${factory.toString()}
                return factory();
            })();
        `;

        try {
            const result = this.sandbox.eval(pluginCode);
            return await result;
        } catch (error) {
            console.error('❌ خطا در ایجاد پلاگین:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const pluginSystem = new PluginSystem();
export default PluginSystem;
