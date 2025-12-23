import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Cpu, Brain, BarChart3, CheckCircle, Activity, Server, Lock, 
  Code, Wifi, Battery, FileText, Video, Image, Volume2, Globe, 
  Database, Rocket, ShieldCheck, Folder, Key, Eye, Send, Palette, 
  Box, Wind, Atom, Search, ArrowLeft, ChevronLeft, X, Play, 
  Loader2, FileText as DocIcon, Filter, Download, Upload, RefreshCw,
  Grid, List, ChevronRight, ChevronLeft as ChevronLeftIcon, Hash,
  Cloud, Zap, Users, Bell, Clock, Shield, TrendingUp, Layers,
  AlertCircle
} from 'lucide-react'
import './index.css'
// ایمپورت ماژول منطق آزمون‌پذیر و مدیریت خطا
import { 
  AppError, 
  handleApiError, 
  getStatusColor, 
  getStatusText, 
  getPriorityColor, 
  getPriorityText, 
  formatDate, 
  formatResponseTime, 
  mockServiceExecution,
  calculatePerformanceMetrics 
} from './utils/testableLogic'

// ==================== انواع (Types) ====================
interface Service {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive' | 'warning'
  endpoint: string
  category: string
  icon: string
  usageCount: number
  lastUsed: string
  priority: 'high' | 'medium' | 'low'
  responseTime: number
  successRate: number
}

interface Stats {
  total_services: number
  active_services: number
  total_requests: number
  uptime_percentage: number
  memory_usage: number
  api_status: 'online' | 'offline' | 'checking' | 'degraded'
  daily_active_users: number
  average_response_time: number
  error_rate: number
}

interface ServiceExecutionResult {
  success: boolean
  requestId: string
  processingTime: string
  remaining_credits: number
  data?: any
  error?: AppError
}

interface ExecutionMetric {
  duration: number
  success: boolean
  timestamp: number
}

// ==================== کامپوننت اصلی ====================
function App() {
  const CLOUD_CONFIG = {
    region: 'aws-eu-central-1',
    provider: 'AWS',
    autoScale: true,
    maxInstances: 10,
    minInstances: 2,
    healthCheckInterval: 30000,
    cacheEnabled: true,
    cdnEnabled: true
  }

  // ==================== State ها ====================
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'تحلیلگر محتوا (NLP)', description: 'پردازش متن فارسی با 245 پست آموزشی - پست 245 فعال', status: 'active', endpoint: '/api/content/analyze', category: 'هوش مصنوعی', icon: 'brain', usageCount: 1245, lastUsed: '2024-01-15T10:30:00', priority: 'high', responseTime: 120, successRate: 99.8 },
    { id: 2, name: 'حل کننده فرمول', description: 'محاسبه فرمول‌های ریاضی پیچیده', status: 'active', endpoint: '/api/formula/solve', category: 'محاسبات', icon: 'cpu', usageCount: 892, lastUsed: '2024-01-14T14:20:00', priority: 'high', responseTime: 85, successRate: 99.5 },
    { id: 3, name: 'نویسنده هوشمند', description: 'تولید محتوای خودکار با هوش مصنوعی', status: 'active', endpoint: '/api/ai/write', category: 'هوش مصنوعی', icon: 'file-text', usageCount: 1567, lastUsed: '2024-01-15T09:15:00', priority: 'high', responseTime: 150, successRate: 98.9 },
    { id: 4, name: 'مبدل سه‌بعدی', description: 'تبدیل مدل‌های 2D به 3D', status: 'active', endpoint: '/api/3d/convert', category: 'گرافیک', icon: 'box', usageCount: 543, lastUsed: '2024-01-13T16:45:00', priority: 'medium', responseTime: 220, successRate: 99.2 },
    { id: 5, name: 'رمزگذار داده', description: 'امنیت پیشرفته برای داده‌های حساس', status: 'active', endpoint: '/api/security/encrypt', category: 'امنیت', icon: 'lock', usageCount: 2109, lastUsed: '2024-01-15T11:20:00', priority: 'high', responseTime: 95, successRate: 99.9 },
    { id: 6, name: 'پردازشگر تصویر', description: 'پردازش و آنالیز تصاویر', status: 'active', endpoint: '/api/image/process', category: 'رسانه', icon: 'image', usageCount: 1789, lastUsed: '2024-01-14T13:10:00', priority: 'high', responseTime: 180, successRate: 99.3 },
    { id: 7, name: 'مبدل صوت', description: 'تبدیل و پردازش فایل‌های صوتی', status: 'active', endpoint: '/api/audio/convert', category: 'رسانه', icon: 'volume', usageCount: 987, lastUsed: '2024-01-12T15:30:00', priority: 'medium', responseTime: 160, successRate: 98.7 },
    { id: 8, name: 'اسکنر شبکه', description: 'بررسی امنیت و وضعیت شبکه', status: 'active', endpoint: '/api/network/scan', category: 'شبکه', icon: 'wifi', usageCount: 654, lastUsed: '2024-01-15T08:45:00', priority: 'medium', responseTime: 110, successRate: 99.6 },
    { id: 9, name: 'بهینه‌ساز باتری', description: 'مدیریت مصرف انرژی سیستم', status: 'active', endpoint: '/api/system/battery', category: 'سیستم', icon: 'battery', usageCount: 432, lastUsed: '2024-01-11T12:15:00', priority: 'low', responseTime: 75, successRate: 99.4 },
    { id: 10, name: 'سازماندهی فایل', description: 'مدیریت خودکار فایل‌ها و پوشه‌ها', status: 'active', endpoint: '/api/file/organize', category: 'سیستم', icon: 'folder', usageCount: 1123, lastUsed: '2024-01-15T10:00:00', priority: 'medium', responseTime: 90, successRate: 99.7 },
    { id: 11, name: 'تولیدکننده رمز', description: 'ایجاد رمزهای عبور امن', status: 'active', endpoint: '/api/security/password', category: 'امنیت', icon: 'key', usageCount: 876, lastUsed: '2024-01-14T17:30:00', priority: 'medium', responseTime: 65, successRate: 99.8 },
    { id: 12, name: 'مانیتور سیستم', description: 'نظارت بر عملکرد سرور و منابع', status: 'active', endpoint: '/api/system/monitor', category: 'سیستم', icon: 'activity', usageCount: 2101, lastUsed: '2024-01-15T12:00:00', priority: 'high', responseTime: 70, successRate: 99.9 },
    { id: 13, name: 'نویسنده کوانتومی', description: 'پردازش کوانتومی متن', status: 'active', endpoint: '/api/ai/quantum-write', category: 'هوش مصنوعی', icon: 'atom', usageCount: 321, lastUsed: '2024-01-10T14:45:00', priority: 'low', responseTime: 280, successRate: 97.8 },
    { id: 14, name: 'تبدیل 2D به 3D', description: 'تبدیل پیشرفته گرافیک', status: 'active', endpoint: '/api/3d/2d-to-3d', category: 'گرافیک', icon: 'box', usageCount: 456, lastUsed: '2024-01-13T11:20:00', priority: 'medium', responseTime: 200, successRate: 98.5 },
    { id: 15, name: 'گرافیک دو بعدی', description: 'ایجاد و ویرایش گرافیک 2D', status: 'active', endpoint: '/api/graphic/2d', category: 'گرافیک', icon: 'palette', usageCount: 789, lastUsed: '2024-01-14T10:15:00', priority: 'medium', responseTime: 130, successRate: 99.1 },
    { id: 16, name: 'طراحی تلسکوپ', description: 'شبیه‌سازی و طراحی اپتیک', status: 'active', endpoint: '/api/science/telescope', category: 'علمی', icon: 'eye', usageCount: 234, lastUsed: '2024-01-09T16:30:00', priority: 'low', responseTime: 310, successRate: 96.5 },
    { id: 17, name: 'سیستم تله‌پورت', description: 'انتقال داده‌های امن', status: 'active', endpoint: '/api/network/teleport', category: 'شبکه', icon: 'send', usageCount: 567, lastUsed: '2024-01-12T09:45:00', priority: 'medium', responseTime: 140, successRate: 99.0 },
    { id: 18, name: 'ویرایشگر ویدیو', description: 'پردازش ویدیو با هوش مصنوعی', status: 'active', endpoint: '/api/video/edit', category: 'رسانه', icon: 'video', usageCount: 1234, lastUsed: '2024-01-15T13:25:00', priority: 'high', responseTime: 250, successRate: 98.3 },
    { id: 19, name: 'تمیز کننده کد', description: 'بهینه‌سازی و استانداردسازی کد', status: 'active', endpoint: '/api/code/clean', category: 'توسعه', icon: 'code', usageCount: 1987, lastUsed: '2024-01-15T14:10:00', priority: 'high', responseTime: 100, successRate: 99.6 },
    { id: 20, name: 'مدیر پشتیبان', description: 'مدیریت خودکار backup سیستم', status: 'active', endpoint: '/api/backup/manage', category: 'سیستم', icon: 'database', usageCount: 765, lastUsed: '2024-01-13T08:20:00', priority: 'medium', responseTime: 115, successRate: 99.7 },
    { id: 21, name: 'سامانه ضد چندپارگی', description: 'بهینه‌سازی حافظه و منابع', status: 'warning', endpoint: '/api/system/anti-fragmentation', category: 'سیستم', icon: 'shield-check', usageCount: 432, lastUsed: '2024-01-11T15:40:00', priority: 'low', responseTime: 125, successRate: 95.2 },
    { id: 22, name: 'سامانه ضد سیگار', description: 'مدیریت سلامت سیستم', status: 'active', endpoint: '/api/system/anti-smoke', category: 'سیستم', icon: 'wind', usageCount: 298, lastUsed: '2024-01-10T11:30:00', priority: 'low', responseTime: 95, successRate: 99.4 },
    { id: 23, name: 'باغ راز آلود', description: 'سیستم امنیتی پیشرفته', status: 'active', endpoint: '/api/security/secret-garden', category: 'امنیت', icon: 'shield-check', usageCount: 654, lastUsed: '2024-01-14T18:15:00', priority: 'high', responseTime: 80, successRate: 99.9 }
  ])

  const [stats, setStats] = useState<Stats>({
    total_services: 23,
    active_services: 22,
    total_requests: 12487,
    uptime_percentage: 99.8,
    memory_usage: 64,
    api_status: 'online',
    daily_active_users: 342,
    average_response_time: 145,
    error_rate: 0.2
  })

  const [apiKey, setApiKey] = useState<string>('apikey_user_free_123')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gatewayStatus, setGatewayStatus] = useState<'online' | 'offline' | 'checking'>('online')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('همه')
  const [executionHistory, setExecutionHistory] = useState<ServiceExecutionResult[]>([])
  const [executionMetrics, setExecutionMetrics] = useState<ExecutionMetric[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'recent' | 'response'>('usage')
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'high'>('all')
  const [favorites, setFavorites] = useState<number[]>([1, 5, 12, 18])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)
  const itemsPerPage = 9

  // Cloud environment monitoring
  const [cloudHealth, setCloudHealth] = useState({
    instances: 4,
    cpuUsage: 42,
    memoryUsage: 64,
    networkLatency: 28,
    region: CLOUD_CONFIG.region,
    lastHealthCheck: new Date().toISOString()
  })

  // ==================== Effects ====================
  // Cloud auto-refresh
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setCloudHealth(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(20, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(30, prev.memoryUsage + (Math.random() * 8 - 4))),
        networkLatency: Math.min(100, Math.max(10, prev.networkLatency + (Math.random() * 6 - 3))),
        lastHealthCheck: new Date().toISOString()
      }))
    }, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Notification auto-clear
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // ==================== توابع محاسباتی (Memorized) ====================
  const categories = useMemo(() => {
    const cats = ['همه', ...Array.from(new Set(services.map(s => s.category)))]
    return cats
  }, [services])

  const filteredServices = useMemo(() => {
    let filtered = services
    
    if (activeTab === 'favorites') {
      filtered = filtered.filter(service => favorites.includes(service.id))
    } else if (activeTab === 'high') {
      filtered = filtered.filter(service => service.priority === 'high')
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedCategory !== 'همه') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }
    
    switch (sortBy) {
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'usage':
        filtered = [...filtered].sort((a, b) => b.usageCount - a.usageCount)
        break
      case 'recent':
        filtered = [...filtered].sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
        break
      case 'response':
        filtered = [...filtered].sort((a, b) => a.responseTime - b.responseTime)
        break
    }
    
    return filtered
  }, [services, searchQuery, selectedCategory, sortBy, activeTab, favorites])

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredServices.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredServices, currentPage])

  // محاسبه متریک‌های عملکرد از داده‌های واقعی
  const performanceMetrics = useMemo(() => {
    return calculatePerformanceMetrics(executionMetrics)
  }, [executionMetrics])

  // ==================== توابع سرویس و ابزار ====================
  const getServiceIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'brain': Brain,
      'cpu': Cpu,
      'lock': Lock,
      'file-text': FileText,
      'box': Box,
      'image': Image,
      'volume': Volume2,
      'wifi': Wifi,
      'battery': Battery,
      'folder': Folder,
      'key': Key,
      'activity': Activity,
      'atom': Atom,
      'palette': Palette,
      'eye': Eye,
      'send': Send,
      'video': Video,
      'code': Code,
      'database': Database,
      'shield-check': ShieldCheck,
      'wind': Wind,
      'server': Server,
      'globe': Globe,
      'cloud': Cloud,
      'shield': Shield,
      'layers': Layers,
      'default': Rocket
    }
    
    const IconComponent = icons[iconName] || icons.default
    return <IconComponent className="w-5 h-5" />
  }

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
  }, [])

  // ==================== توابع اصلی کسب‌وکار ====================
  const executeService = useCallback(async (service?: Service) => {
    const serviceToExecute = service || selectedService
    if (!serviceToExecute) return
    
    setIsLoading(true)
    const startTime = performance.now()
    
    try {
      // استفاده از mockServiceExecution واقع‌گرایانه
      const result = await mockServiceExecution(serviceToExecute.name)
      
      const duration = performance.now() - startTime
      // ذخیره متریک عملکرد
      setExecutionMetrics(prev => [...prev, { duration, success: true, timestamp: Date.now() }])
      
      const executionResult: ServiceExecutionResult = {
        success: true,
        requestId: result.requestId,
        processingTime: result.processingTime,
        remaining_credits: result.remaining_credits,
        data: result.data
      }
      
      setExecutionHistory(prev => [executionResult, ...prev.slice(0, 9)])
      setServices(prev => prev.map(s => 
        s.id === serviceToExecute.id 
          ? { 
              ...s, 
              usageCount: s.usageCount + 1,
              lastUsed: new Date().toISOString()
            }
          : s
      ))
      
      setStats(prev => ({
        ...prev,
        total_requests: prev.total_requests + 1,
        error_rate: performanceMetrics.errorCount / (performanceMetrics.totalRequests + 1) * 100
      }))
      
      showNotification('success', 
        `✅ سرویس "${serviceToExecute.name}" اجرا شد. ` +
        `شناسه: ${result.requestId} | زمان: ${result.processingTime}`
      )
      
    } catch (error) {
      const duration = performance.now() - startTime
      // ذخیره متریک خطا
      setExecutionMetrics(prev => [...prev, { duration, success: false, timestamp: Date.now() }])
      
      let appError: AppError
      try {
        handleApiError(error)
        appError = error as AppError
      } catch (handledError) {
        appError = handledError as AppError
      }
      
      const executionResult: ServiceExecutionResult = {
        success: false,
        requestId: `ERR-${Date.now()}`,
        processingTime: `${Math.round(duration)}ms`,
        remaining_credits: Math.floor(Math.random() * 900) + 100,
        error: appError
      }
      
      setExecutionHistory(prev => [executionResult, ...prev.slice(0, 9)])
      
      showNotification('error', 
        `❌ خطا در "${serviceToExecute.name}": ${appError.userMessage || appError.message}`
      )
      
    } finally {
      setIsLoading(false)
    }
  }, [selectedService, performanceMetrics, showNotification])

  const testGatewayConnection = useCallback(async () => {
    setGatewayStatus('checking')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // شبیه‌سازی 10% احتمال خطا
      if (Math.random() < 0.1) {
        throw new Error('Connection timeout to gateway')
      }
      setGatewayStatus('online')
      showNotification('success', '✅ اتصال Gateway برقرار است. وضعیت: آنلاین | پینگ: 42ms')
    } catch (error) {
      setGatewayStatus('offline')
      showNotification('error', '❌ خطا در برقراری اتصال Gateway. لطفاً تنظیمات شبکه را بررسی کنید.')
    }
  }, [showNotification])

  const toggleFavorite = useCallback((serviceId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setFavorites(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
    showNotification('info', favorites.includes(serviceId) 
      ? '★ سرویس از علاقه‌مندی‌ها حذف شد.' 
      : '⭐ سرویس به علاقه‌مندی‌ها اضافه شد.'
    )
  }, [favorites, showNotification])

  const handleExecuteFromCard = useCallback((service: Service, e: React.MouseEvent) => {
    e.stopPropagation()
    executeService(service)
  }, [executeService])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scaleCloudInstance = useCallback((action: 'up' | 'down') => {
    setCloudHealth(prev => ({
      ...prev,
      instances: action === 'up' 
        ? Math.min(CLOUD_CONFIG.maxInstances, prev.instances + 1)
        : Math.max(CLOUD_CONFIG.minInstances, prev.instances - 1)
    }))
    showNotification('success', 
      `✅ مقیاس ${action === 'up' ? 'افزایش' : 'کاهش'} یافت. ` +
      `تعداد نمونه: ${action === 'up' ? cloudHealth.instances + 1 : cloudHealth.instances - 1}`
    )
  }, [cloudHealth.instances])

  // ==================== رندر ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3 md:p-6" dir="rtl">
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        } border rounded-xl p-4 shadow-lg flex items-start gap-3`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
           notification.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
           <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" />}
          <p className="text-sm flex-1">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="mb-6 md:mb-8">
        {/* ... (همان بخش هدر قبلی با تغییرات جزئی در استفاده از توابع جدید) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl md:rounded-2xl shadow-lg">
              <Cloud className="w-7 h-7 md:w-9 md:h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                پلتفرم ابری TetraSaaS v2.3
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base flex flex-wrap items-center gap-1 md:gap-2">
                <span className="flex items-center gap-1">
                  <Server className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="font-bold text-blue-600">{services.length} سرویس ابری</span>
                </span>
                <span> | نرخ موفقیت: <strong>{performanceMetrics.successRate.toFixed(1)}%</strong></span>
                <span> | زمان پاسخ: <strong>{performanceMetrics.averageResponseTime.toFixed(0)}ms</strong></span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
            <div className="relative flex-1 lg:flex-initial min-w-[250px]">
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl bg-white shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="کلید API خود را وارد کنید"
              />
            </div>
            <div className="flex gap-2 md:gap-3">
              <button 
                className="px-4 md:px-5 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-md text-sm md:text-base"
                onClick={testGatewayConnection}
              >
                <Activity className="w-4 h-4" />
                بررسی اتصال
              </button>
              <button
                onClick={() => showNotification('info', '📚 مستندات API در حالت نمایشی فعال است')}
                className="px-4 md:px-5 py-2 md:py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-700 transition-all flex items-center gap-2 text-sm md:text-base"
              >
                <DocIcon className="w-4 h-4" />
                مستندات API
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Environment Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6 md:mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 bg-white rounded-lg md:rounded-xl shadow-sm">
                <Cloud className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">محیط ابری فعال</h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                  <span className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    منطقه: <span className="font-bold">{CLOUD_CONFIG.region}</span>
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-500" />
                    نمونه‌ها: <span className="font-bold">{cloudHealth.instances}</span>
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-blue-500" />
                    CPU: <span className="font-bold">{cloudHealth.cpuUsage}%</span>
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                    <Database className="w-3 h-3 text-purple-500" />
                    حافظه: <span className="font-bold">{cloudHealth.memoryUsage}%</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <button
                onClick={() => scaleCloudInstance('up')}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-xs md:text-sm"
              >
                افزایش مقیاس +
              </button>
              <button
                onClick={() => scaleCloudInstance('down')}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs md:text-sm"
              >
                کاهش مقیاس -
              </button>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${autoRefresh ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {autoRefresh ? 'توقف اتوماتیک' : 'شروع اتوماتیک'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { 
              title: 'کل سرویس‌ها', 
              value: services.length.toString(), 
              subtitle: `${services.filter(s => s.status === 'active').length}/${services.length} فعال`,
              icon: Server,
              color: 'from-blue-100 to-blue-50',
              iconColor: 'text-blue-600'
            },
            { 
              title: 'درخواست‌ها', 
              value: stats.total_requests.toLocaleString('fa-IR'), 
              subtitle: `امروز: ${Math.floor(Math.random() * 50) + 200} درخواست`,
              icon: BarChart3,
              color: 'from-purple-100 to-purple-50',
              iconColor: 'text-purple-600'
            },
            { 
              title: 'متریک عملکرد', 
              value: `${performanceMetrics.successRate.toFixed(1)}%`, 
              subtitle: `پاسخ: ${performanceMetrics.averageResponseTime.toFixed(0)}ms`,
              icon: TrendingUp,
              color: 'from-emerald-100 to-emerald-50',
              iconColor: 'text-emerald-600'
            },
            { 
              title: 'آپ‌تایم', 
              value: `${(100 - performanceMetrics.errorCount / Math.max(performanceMetrics.totalRequests, 1) * 100).toFixed(1)}%`, 
              subtitle: `وضعیت API: ${gatewayStatus === 'online' ? 'آنلاین' : gatewayStatus === 'checking' ? 'در حال بررسی' : 'آفلاین'}`,
              icon: Activity,
              color: 'from-amber-100 to-amber-50',
              iconColor: 'text-amber-600'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{stat.subtitle}</span>
                  </div>
                </div>
                <div className={`p-2 md:p-3 bg-gradient-to-r ${stat.color} rounded-lg md:rounded-xl`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content - با تغییرات مشابه در استفاده از توابع جدید */}
      {/* ... (بقیه کد مشابه قبل با جایگزینی توابع getStatusColor, getStatusText, getPriorityColor, getPriorityText, formatDate, formatResponseTime با نسخه‌های ایمپورت شده) */}
      
      {/* در بخش کارت سرویس‌ها: */}
      {/* جایگزینی getStatusColor(service.status) با getStatusColor(service.status) */}
      {/* جایگزینی getStatusText(service.status) با getStatusText(service.status) */}
      {/* و تغییرات مشابه دیگر */}

      {/* در مودال جزئیات سرویس: */}
      {/* جایگزینی مشابه توابع و استفاده از system مدیریت خطا */}

      <footer className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-1 md:mb-2">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Cloud className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-base md:text-lg text-gray-900">پلتفرم ابری TetraSaaS v2.3</p>
                <p className="text-gray-600 text-xs md:text-sm">توسعه‌یافته با معیارهای مهندسی نرم‌افزار | مدیریت خطای پیشرفته</p>
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-1 md:gap-2 mb-1 md:mb-2">
              <div className={`w-2 h-2 rounded-full ${gatewayStatus === 'online' ? 'bg-emerald-500' : gatewayStatus === 'checking' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
              <p className="text-xs md:text-sm font-medium">
                {gatewayStatus === 'online' ? '✅ محیط ابری فعال' : 
                 gatewayStatus === 'checking' ? '🔄 در حال بررسی اتصال' : '❌ اتصال قطع'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3" />
                {CLOUD_CONFIG.region}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {cloudHealth.instances} نمونه
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                موفقیت: {performanceMetrics.successRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
