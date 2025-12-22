// تعریف انواع TypeScript برای پروژه TetraSaaS

export interface Service {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  endpoint: string;
  category: string;
  icon: string;
  usageCount: number;
  lastUsed: string;
  version?: string;
  documentationUrl?: string;
  rateLimit?: number;
  tags?: string[];
}

export interface Stats {
  total_services: number;
  active_services: number;
  total_requests: number;
  uptime_percentage: number;
  memory_usage: number;
  api_status: 'online' | 'offline' | 'checking' | 'degraded';
  daily_active_users: number;
  average_response_time: number;
  error_rate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  apiKey: string;
  remainingCredits: number;
  lastActive: string;
  permissions: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
  statusCode: number;
}

export interface ExecutionLog {
  id: string;
  serviceId: number;
  serviceName: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'failed' | 'timeout';
  requestSize?: number;
  responseSize?: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  active: number;
  totalUsage: number;
  avgResponseTime: number;
}

export interface DashboardConfig {
  theme: 'light' | 'dark' | 'auto';
  language: 'fa' | 'en';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  defaultView: 'grid' | 'list';
  compactMode: boolean;
}

export interface ServiceExecutionParams {
  serviceId: number;
  input: any;
  options?: {
    timeout?: number;
    priority?: 'low' | 'normal' | 'high';
    format?: 'json' | 'xml' | 'text';
    cache?: boolean;
  };
}

export interface ServiceExecutionResult {
  success: boolean;
  requestId: string;
  processingTime: string;
  remaining_credits: number;
  data?: any;
  error?: string;
  warnings?: string[];
  metadata?: {
    version: string;
    processedBy: string;
    cacheHit: boolean;
  };
}

// انواع برای کامپوننت‌ها
export interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: (service: Service) => void;
  onToggleFavorite: (serviceId: number) => void;
  onExecute?: (service: Service) => void;
  className?: string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
  loading?: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'usage' | 'recent' | 'category';
  viewMode: 'grid' | 'list';
  page: number;
  pageSize: number;
}

// انواع برای API مخصوص
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  version: string;
  uptime: number;
  timestamp: string;
  dependencies: {
    database: boolean;
    cache: boolean;
    queue: boolean;
    storage: boolean;
  };
}

export interface UsageReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalRequests: number;
  uniqueUsers: number;
  topServices: Array<{
    serviceId: number;
    serviceName: string;
    requests: number;
    errors: number;
  }>;
  errorRate: number;
  averageResponseTime: number;
  busiestHour: number;
}
