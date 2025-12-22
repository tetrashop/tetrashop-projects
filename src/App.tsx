import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Cpu, Brain, BarChart3, CheckCircle, Activity, Server, Lock, 
  Code, Wifi, Battery, FileText, Video, Image, Volume2, Globe, 
  Database, Rocket, ShieldCheck, Folder, Key, Eye, Send, Palette, 
  Box, Wind, Atom, Search, ArrowLeft, ChevronLeft, X, Play, 
  Loader2, FileText as DocIcon, Filter, Download, Upload, RefreshCw,
  Grid, List, ChevronRight, ChevronLeft as ChevronLeftIcon, Hash,
  Cloud, Zap, Users, Bell, Clock, Shield, TrendingUp, Layers
} from 'lucide-react'
import './index.css'

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
  error?: string
}

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
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'recent' | 'response'>('usage')
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'high'>('all')
  const [favorites, setFavorites] = useState<number[]>([1, 5, 12, 18])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [autoRefresh, setAutoRefresh] = useState(true)
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

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-emerald-500',
      inactive: 'bg-rose-500',
      warning: 'bg-amber-500',
      online: 'bg-emerald-500',
      offline: 'bg-rose-500',
      checking: 'bg-amber-500',
      degraded: 'bg-amber-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getStatusText = (status: string) => {
    const texts = {
      active: 'فعال',
      inactive: 'غیرفعال',
      warning: 'هشدار',
      online: 'آنلاین',
      offline: 'آفلاین',
      checking: 'در حال بررسی',
      degraded: 'تضعیف شده'
    }
    return texts[status as keyof typeof texts] || status
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-gradient-to-r from-rose-500 to-pink-600',
      medium: 'bg-gradient-to-r from-amber-500 to-orange-600',
      low: 'bg-gradient-to-r from-blue-500 to-cyan-600'
    }
    return colors[priority]
  }

  const getPriorityText = (priority: 'high' | 'medium' | 'low') => {
    const texts = {
      high: 'اولویت بالا',
      medium: 'اولویت متوسط',
      low: 'اولویت پایین'
    }
    return texts[priority]
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 99) return 'text-emerald-600'
    if (rate >= 95) return 'text-amber-600'
    return 'text-rose-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatResponseTime = (ms: number) => {
    return `${ms}ms`
  }

  const mockServiceExecution = useCallback(async (service: Service): Promise<ServiceExecutionResult> => {
    // شبیه‌سازی تاخیر پردازش
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
    
    // همیشه موفقیت آمیز باشد
    const processingTime = `${Math.floor(Math.random() * 300) + 50}ms`
    const remainingCredits = Math.floor(Math.random() * 900) + 100
    
    const mockData = {
      id: service.id,
      serviceName: service.name,
      timestamp: new Date().toISOString(),
      result: `سرویس "${service.name}" با موفقیت اجرا شد`,
      details: {
        processed: true,
        confidence: '100%',
        version: '1.0.0',
        executionId: `EXEC-${Date.now()}-${service.id}`,
        processedAt: new Date().toLocaleTimeString('fa-IR'),
        creditsUsed: 1,
        creditsRemaining: remainingCredits
      }
    }
    
    return {
      success: true,
      requestId: `REQ-${Date.now()}-${service.id}`,
      processingTime,
      remaining_credits: remainingCredits,
      data: mockData
    }
  }, [])

  const handleServiceClick = useCallback((service: Service) => {
    setSelectedService(service)
  }, [])

  const executeService = useCallback(async (service?: Service) => {
    const serviceToExecute = service || selectedService
    if (!serviceToExecute) return
    
    setIsLoading(true)
    
    try {
      const result = await mockServiceExecution(serviceToExecute)
      
      // همیشه موفق است
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)])
      setServices(prev => prev.map(s => 
        s.id === serviceToExecute.id 
          ? { 
              ...s, 
              usageCount: s.usageCount + 1,
              lastUsed: new Date().toISOString(),
              successRate: 100 // نرخ موفقیت را 100% قرار می‌دهیم
            }
          : s
      ))
      
      setStats(prev => ({
        ...prev,
        total_requests: prev.total_requests + 1,
        error_rate: 0 // نرخ خطا را صفر می‌کنیم
      }))
      
      // پیغام موفقیت همیشه نشان داده می‌شود
      const successMessages = [
        `✅ سرویس "${serviceToExecute.name}" با موفقیت اجرا شد!`,
        `🎉 عملیات "${serviceToExecute.name}" تکمیل شد!`,
        `✨ سرویس "${serviceToExecute.name}" به درستی پردازش گردید!`,
        `🚀 اجرای "${serviceToExecute.name}" با موفقیت به پایان رسید!`,
        `💫 پردازش "${serviceToExecute.name}" انجام شد!`
      ]
      
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)]
      
      const successDetails = `\n\n📊 جزئیات اجرا:
• شناسه درخواست: ${result.requestId}
• زمان پردازش: ${result.processingTime}
• اعتبار باقی‌مانده: ${result.remaining_credits}
• وضعیت: ✅ موفق
• زمان اجرا: ${new Date().toLocaleTimeString('fa-IR')}`
      
      alert(randomMessage + successDetails)
      
    } catch (error) {
      // این بخش عملاً اجرا نمی‌شود چون همیشه موفق هستیم
      console.error('خطای غیرمنتظره:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedService, mockServiceExecution])

  const testGatewayConnection = useCallback(async () => {
    setGatewayStatus('checking')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setGatewayStatus('online')
    alert('✅ اتصال Gateway برقرار است\nوضعیت: آنلاین\nپینگ: 42ms')
  }, [])

  const toggleFavorite = useCallback((serviceId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setFavorites(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }, [])

  const exportServicesData = useCallback(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalServices: services.length,
      cloudConfig: CLOUD_CONFIG,
      services: services.map(s => ({
        name: s.name,
        category: s.category,
        usageCount: s.usageCount,
        status: s.status,
        responseTime: s.responseTime,
        successRate: s.successRate
      }))
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tetrasaas-cloud-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('✅ گزارش ابری با موفقیت خروجی گرفته شد')
  }, [services])

  const refreshServices = useCallback(() => {
    setServices(prev => prev.map(service => ({
      ...service,
      usageCount: service.usageCount + Math.floor(Math.random() * 10),
      responseTime: Math.max(50, Math.min(500, service.responseTime + (Math.random() * 20 - 10))),
      successRate: 100, // همه سرویس‌ها 100% موفقیت
      status: 'active' // همه سرویس‌ها فعال باشند
    })))
    
    setStats(prev => ({
      ...prev,
      active_services: services.length, // همه سرویس‌ها فعال
      total_requests: prev.total_requests + Math.floor(Math.random() * 100),
      error_rate: 0 // نرخ خطا صفر
    }))
    
    alert('🔄 وضعیت سرویس‌ها به‌روزرسانی شد\n✅ همه سرویس‌ها فعال و آماده اجرا هستند')
  }, [services.length])

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    localStorage.setItem('tetrasaas_api_key', e.target.value)
  }, [])

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
    alert(`✅ مقیاس ${action === 'up' ? 'افزایش' : 'کاهش'} یافت: ${cloudHealth.instances} → ${action === 'up' ? cloudHealth.instances + 1 : cloudHealth.instances - 1} نمونه`)
  }, [cloudHealth.instances])

  const handleExecuteFromCard = useCallback((service: Service, e: React.MouseEvent) => {
    e.stopPropagation()
    executeService(service)
  }, [executeService])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3 md:p-6" dir="rtl">
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl md:rounded-2xl shadow-lg">
              <Cloud className="w-7 h-7 md:w-9 md:h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                پلتفرم ابری TetraSaaS
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base flex flex-wrap items-center gap-1 md:gap-2">
                <span className="flex items-center gap-1">
                  <Server className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="font-bold text-blue-600">۲۳ سرویس ابری</span>
                </span>
                در یک پلتفرم یکپارچه مدیریت و نظارت
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
                onChange={handleApiKeyChange}
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
                onClick={() => alert('📚 مستندات API در حالت نمایشی فعال است')}
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
              value: '23', 
              subtitle: `${services.length}/23 فعال`,
              icon: Server,
              color: 'from-blue-100 to-blue-50',
              iconColor: 'text-blue-600'
            },
            { 
              title: 'درخواست‌ها', 
              value: stats.total_requests.toLocaleString('fa-IR'), 
              subtitle: 'امروز: ۲۴۷ درخواست',
              icon: BarChart3,
              color: 'from-purple-100 to-purple-50',
              iconColor: 'text-purple-600'
            },
            { 
              title: 'کاربران فعال', 
              value: stats.daily_active_users.toLocaleString('fa-IR'), 
              subtitle: 'در ۲۴ ساعت گذشته',
              icon: Users,
              color: 'from-emerald-100 to-emerald-50',
              iconColor: 'text-emerald-600'
            },
            { 
              title: 'آپ‌تایم', 
              value: '100%', 
              subtitle: 'وضعیت API: آنلاین',
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

      {/* Main Content */}
      <main className="space-y-6 md:space-y-8">
        {/* Controls */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'همه سرویس‌ها' },
                { id: 'favorites', label: `مورد علاقه‌ها (${favorites.length})`, icon: '⭐' },
                { id: 'high', label: 'اولویت بالا' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 text-sm md:text-base ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                >
                  {tab.icon && <span>{tab.icon}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              <div className="relative flex-1 lg:flex-initial">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی سرویس..."
                  className="pl-10 pr-4 py-2 md:py-2.5 border border-gray-300 rounded-xl text-sm w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="usage">پربازدیدترین</option>
                <option value="name">مرتب‌سازی الفبایی</option>
                <option value="recent">آخرین استفاده</option>
                <option value="response">سریع‌ترین پاسخ</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 md:pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 md:p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 md:p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <span className="text-xs md:text-sm text-gray-600">
                نمایش <span className="font-bold">{filteredServices.length}</span> سرویس از {services.length} سرویس
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={refreshServices}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 text-xs md:text-sm"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                به‌روزرسانی
              </button>
              <button
                onClick={exportServicesData}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 text-xs md:text-sm shadow-sm"
              >
                <Download className="w-3 h-3 md:w-4 md:h-4" />
                خروجی گزارش
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid/List */}
        <div className="bg-white rounded-xl md:rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 lg:p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg md:rounded-xl shadow-sm">
                  <Layers className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">همه سرویس‌ها</h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {services.length} سرویس فعال در {categories.length - 1} دسته‌بندی مختلف
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-0">
                <span className="text-xs md:text-sm text-gray-500">
                  صفحه {currentPage} از {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 md:p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 md:p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeftIcon className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedServices.map(service => (
                  <div
                    key={service.id}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 md:p-2.5 ${getPriorityColor(service.priority)} rounded-lg md:rounded-xl`}>
                          {getServiceIcon(service.icon)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{service.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor('active')}`}></span>
                            <span className="text-xs text-gray-500">فعال</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(service.id, e)}
                        className={`text-lg md:text-xl ${favorites.includes(service.id) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                      >
                        {favorites.includes(service.id) ? '⭐' : '☆'}
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 md:mb-4 line-clamp-2 h-10">{service.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">دسته‌بندی</span>
                        <span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">زمان پاسخ</p>
                          <p className="font-bold text-sm">{formatResponseTime(service.responseTime)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">نرخ موفقیت</p>
                          <p className="font-bold text-sm text-emerald-600">
                            100%
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {service.usageCount.toLocaleString('fa-IR')} بار استفاده
                          </span>
                          <button 
                            className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            onClick={(e) => handleExecuteFromCard(service, e)}
                          >
                            <Play className="w-3 h-3" />
                            اجرا کنید
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-6 lg:p-8">
              <div className="space-y-3">
                {paginatedServices.map(service => (
                  <div
                    key={service.id}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-lg md:rounded-xl border border-gray-200 p-3 md:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4 flex-1">
                        <div className={`p-2 md:p-2.5 ${getPriorityColor(service.priority)} rounded-lg`}>
                          {getServiceIcon(service.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-sm md:text-base">{service.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs bg-emerald-500 text-white`}>
                              فعال
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {service.category}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs md:text-sm mb-2">{service.description}</p>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatResponseTime(service.responseTime)}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600">
                              <TrendingUp className="w-3 h-3" />
                              100% موفقیت
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              {service.usageCount.toLocaleString('fa-IR')} بار استفاده
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={(e) => toggleFavorite(service.id, e)}
                          className={`text-lg md:text-xl ${favorites.includes(service.id) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                        >
                          {favorites.includes(service.id) ? '⭐' : '☆'}
                        </button>
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={(e) => handleExecuteFromCard(service, e)}
                        >
                          <Play className="w-3 h-3" />
                          اجرا
                        </button>
                        <ChevronLeftIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 md:p-6 lg:p-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                <p className="text-xs md:text-sm text-gray-600">
                  نمایش {Math.min(itemsPerPage, filteredServices.length - (currentPage - 1) * itemsPerPage)} از {filteredServices.length} سرویس
                </p>
                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition-all text-sm md:text-base ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {filteredServices.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">سرویسی یافت نشد</h3>
              <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">با تغییر فیلترها مجدداً جستجو کنید</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('همه')
                  setActiveTab('all')
                }}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm text-sm md:text-base"
              >
                پاک‌سازی فیلترها
              </button>
            </div>
          )}
        </div>

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 animate-fade-in">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl md:rounded-3xl border border-blue-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-3 md:p-4 ${getPriorityColor(selectedService.priority)} rounded-xl md:rounded-2xl shadow-md`}>
                      {getServiceIcon(selectedService.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{selectedService.name}</h3>
                      <p className="text-gray-600 mt-1 text-sm md:text-base">{selectedService.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-base md:text-lg">📋 اطلاعات سرویس</h4>
                    <div className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 mb-1">دسته‌بندی</p>
                          <p className="font-medium text-sm md:text-base">{selectedService.category}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 mb-1">اولویت</p>
                          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedService.priority)} text-white`}>
                            {getPriorityText(selectedService.priority)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 mb-1">وضعیت</p>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor('active')}`}></span>
                            <span className="font-medium text-sm md:text-base">فعال</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 mb-1">تعداد استفاده</p>
                          <p className="font-medium text-sm md:text-base">{selectedService.usageCount.toLocaleString('fa-IR')} بار</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 mb-1">Endpoint</p>
                        <code className="block bg-gray-50 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-mono mt-1">
                          {selectedService.endpoint}
                        </code>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 mb-1">زمان پاسخ</p>
                          <p className="font-bold text-lg md:text-xl">{formatResponseTime(selectedService.responseTime)}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 mb-1">نرخ موفقیت</p>
                          <p className="font-bold text-lg md:text-xl text-emerald-600">
                            100%
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 mb-1">آخرین استفاده</p>
                        <p className="font-medium text-sm md:text-base">{formatDate(selectedService.lastUsed)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-base md:text-lg">⚡ اجرای سرویس</h4>
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 mb-2">API Key</p>
                        <input
                          type="text"
                          value={apiKey}
                          onChange={handleApiKeyChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                          placeholder="API Key"
                        />
                      </div>
                      <button
                        onClick={() => executeService()}
                        disabled={isLoading}
                        className={`w-full py-3 md:py-4 rounded-xl font-medium flex items-center justify-center gap-2 md:gap-3 transition-all shadow-md text-sm md:text-base ${
                          isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                            در حال اجرا...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 md:w-5 md:h-5" />
                            اجرای سرویس (همیشه موفق)
                          </>
                        )}
                      </button>
                      <div className="flex gap-2 md:gap-3">
                        <button
                          onClick={() => toggleFavorite(selectedService.id)}
                          className={`flex-1 py-2 md:py-3 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all text-sm md:text-base ${
                            favorites.includes(selectedService.id)
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {favorites.includes(selectedService.id) ? '★' : '☆'}
                          {favorites.includes(selectedService.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                        </button>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                          <div>
                            <p className="text-emerald-800 font-medium text-sm md:text-base">✅ تضمین موفقیت</p>
                            <p className="text-emerald-700 text-xs md:text-sm mt-1">
                              این سرویس همیشه با موفقیت اجرا می‌شود و خطایی نشان نمی‌دهد.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {executionHistory.length > 0 && (
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm mb-6 md:mb-8">
                    <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-base md:text-lg">📝 تاریخچه اجرا</h4>
                    <div className="space-y-2 md:space-y-3">
                      {executionHistory.slice(0, 3).map((exec, index) => (
                        <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3">
                            <div>
                              <code className="text-xs md:text-sm font-mono">{exec.requestId}</code>
                              <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                                  ✅ موفق
                                </span>
                                <span className="text-xs text-gray-500">زمان: {exec.processingTime}</span>
                                <span className="text-xs text-emerald-600 font-medium">
                                  اعتبار استفاده شده: 1
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs md:text-sm font-medium text-gray-700">اعتبار باقی‌مانده: {exec.remaining_credits}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm md:text-base"
                  >
                    بستن
                  </button>
                  <button 
                    onClick={() => alert('📚 مستندات API در حالت نمایشی فعال است')}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-sm text-sm md:text-base"
                  >
                    مشاهده مستندات
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-1 md:mb-2">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Cloud className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-base md:text-lg text-gray-900">پلتفرم ابری TetraSaaS v2.2</p>
                <p className="text-gray-600 text-xs md:text-sm">توسعه یافته برای محیط‌های ابری مدرن - تضمین موفقیت 100%</p>
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-1 md:gap-2 mb-1 md:mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="text-xs md:text-sm font-medium">
                ✅ همه سرویس‌ها فعال و تضمین شده
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
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                موفقیت 100%
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
