import { useState, useEffect, useMemo } from 'react'
import { 
  Cpu, Brain, BarChart3, CheckCircle, Activity, Server, Lock, 
  Code, Wifi, Battery, FileText, Video, Image, Volume2, Globe, 
  Database, Rocket, ShieldCheck, Folder, Key, Eye, Send, Palette, 
  Box, Wind, Atom, Search, ArrowLeft, ChevronLeft, X, Play, 
  Loader2, FileText as DocIcon, Filter, Download, Upload, RefreshCw,
  Grid, List, ChevronRight, ChevronLeft as ChevronLeftIcon, Hash
} from 'lucide-react'
import './index.css'

interface Service {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive'
  endpoint: string
  category: string
  icon: string
  usageCount: number
  lastUsed: string
  priority: 'high' | 'medium' | 'low'
}

interface Stats {
  total_services: number
  active_services: number
  total_requests: number
  uptime_percentage: number
  memory_usage: number
  api_status: 'online' | 'offline' | 'checking'
  daily_active_users: number
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
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'تحلیلگر محتوا (NLP)', description: 'پردازش متن فارسی با 244 پست آموزشی - پست 244 فعال', status: 'active', endpoint: '/api/content/analyze', category: 'هوش مصنوعی', icon: 'brain', usageCount: 1245, lastUsed: '2024-01-15T10:30:00', priority: 'high' },
    { id: 2, name: 'حل کننده فرمول', description: 'محاسبه فرمول‌های ریاضی پیچیده', status: 'active', endpoint: '/api/formula/solve', category: 'محاسبات', icon: 'cpu', usageCount: 892, lastUsed: '2024-01-14T14:20:00', priority: 'high' },
    { id: 3, name: 'نویسنده هوشمند', description: 'تولید محتوای خودکار با هوش مصنوعی', status: 'active', endpoint: '/api/ai/write', category: 'هوش مصنوعی', icon: 'file-text', usageCount: 1567, lastUsed: '2024-01-15T09:15:00', priority: 'high' },
    { id: 4, name: 'مبدل سه‌بعدی', description: 'تبدیل مدل‌های 2D به 3D', status: 'active', endpoint: '/api/3d/convert', category: 'گرافیک', icon: 'box', usageCount: 543, lastUsed: '2024-01-13T16:45:00', priority: 'medium' },
    { id: 5, name: 'رمزگذار داده', description: 'امنیت پیشرفته برای داده‌های حساس', status: 'active', endpoint: '/api/security/encrypt', category: 'امنیت', icon: 'lock', usageCount: 2109, lastUsed: '2024-01-15T11:20:00', priority: 'high' },
    { id: 6, name: 'پردازشگر تصویر', description: 'پردازش و آنالیز تصاویر', status: 'active', endpoint: '/api/image/process', category: 'رسانه', icon: 'image', usageCount: 1789, lastUsed: '2024-01-14T13:10:00', priority: 'high' },
    { id: 7, name: 'مبدل صوت', description: 'تبدیل و پردازش فایل‌های صوتی', status: 'active', endpoint: '/api/audio/convert', category: 'رسانه', icon: 'volume', usageCount: 987, lastUsed: '2024-01-12T15:30:00', priority: 'medium' },
    { id: 8, name: 'اسکنر شبکه', description: 'بررسی امنیت و وضعیت شبکه', status: 'active', endpoint: '/api/network/scan', category: 'شبکه', icon: 'wifi', usageCount: 654, lastUsed: '2024-01-15T08:45:00', priority: 'medium' },
    { id: 9, name: 'بهینه‌ساز باتری', description: 'مدیریت مصرف انرژی سیستم', status: 'active', endpoint: '/api/system/battery', category: 'سیستم', icon: 'battery', usageCount: 432, lastUsed: '2024-01-11T12:15:00', priority: 'low' },
    { id: 10, name: 'سازماندهی فایل', description: 'مدیریت خودکار فایل‌ها و پوشه‌ها', status: 'active', endpoint: '/api/file/organize', category: 'سیستم', icon: 'folder', usageCount: 1123, lastUsed: '2024-01-15T10:00:00', priority: 'medium' },
    { id: 11, name: 'تولیدکننده رمز', description: 'ایجاد رمزهای عبور امن', status: 'active', endpoint: '/api/security/password', category: 'امنیت', icon: 'key', usageCount: 876, lastUsed: '2024-01-14T17:30:00', priority: 'medium' },
    { id: 12, name: 'مانیتور سیستم', description: 'نظارت بر عملکرد سرور و منابع', status: 'active', endpoint: '/api/system/monitor', category: 'سیستم', icon: 'activity', usageCount: 2101, lastUsed: '2024-01-15T12:00:00', priority: 'high' },
    { id: 13, name: 'نویسنده کوانتومی', description: 'پردازش کوانتومی متن', status: 'active', endpoint: '/api/ai/quantum-write', category: 'هوش مصنوعی', icon: 'atom', usageCount: 321, lastUsed: '2024-01-10T14:45:00', priority: 'low' },
    { id: 14, name: 'تبدیل 2D به 3D', description: 'تبدیل پیشرفته گرافیک', status: 'active', endpoint: '/api/3d/2d-to-3d', category: 'گرافیک', icon: 'box', usageCount: 456, lastUsed: '2024-01-13T11:20:00', priority: 'medium' },
    { id: 15, name: 'گرافیک دو بعدی', description: 'ایجاد و ویرایش گرافیک 2D', status: 'active', endpoint: '/api/graphic/2d', category: 'گرافیک', icon: 'palette', usageCount: 789, lastUsed: '2024-01-14T10:15:00', priority: 'medium' },
    { id: 16, name: 'طراحی تلسکوپ', description: 'شبیه‌سازی و طراحی اپتیک', status: 'active', endpoint: '/api/science/telescope', category: 'علمی', icon: 'eye', usageCount: 234, lastUsed: '2024-01-09T16:30:00', priority: 'low' },
    { id: 17, name: 'سیستم تله‌پورت', description: 'انتقال داده‌های امن', status: 'active', endpoint: '/api/network/teleport', category: 'شبکه', icon: 'send', usageCount: 567, lastUsed: '2024-01-12T09:45:00', priority: 'medium' },
    { id: 18, name: 'ویرایشگر ویدیو', description: 'پردازش ویدیو با هوش مصنوعی', status: 'active', endpoint: '/api/video/edit', category: 'رسانه', icon: 'video', usageCount: 1234, lastUsed: '2024-01-15T13:25:00', priority: 'high' },
    { id: 19, name: 'تمیز کننده کد', description: 'بهینه‌سازی و استانداردسازی کد', status: 'active', endpoint: '/api/code/clean', category: 'توسعه', icon: 'code', usageCount: 1987, lastUsed: '2024-01-15T14:10:00', priority: 'high' },
    { id: 20, name: 'مدیر پشتیبان', description: 'مدیریت خودکار backup سیستم', status: 'active', endpoint: '/api/backup/manage', category: 'سیستم', icon: 'database', usageCount: 765, lastUsed: '2024-01-13T08:20:00', priority: 'medium' },
    { id: 21, name: 'سامانه ضد چندپارگی', description: 'بهینه‌سازی حافظه و منابع', status: 'active', endpoint: '/api/system/anti-fragmentation', category: 'سیستم', icon: 'shield-check', usageCount: 432, lastUsed: '2024-01-11T15:40:00', priority: 'low' },
    { id: 22, name: 'سامانه ضد سیگار', description: 'مدیریت سلامت سیستم', status: 'active', endpoint: '/api/system/anti-smoke', category: 'سیستم', icon: 'wind', usageCount: 298, lastUsed: '2024-01-10T11:30:00', priority: 'low' },
    { id: 23, name: 'باغ راز آلود', description: 'سیستم امنیتی پیشرفته', status: 'active', endpoint: '/api/security/secret-garden', category: 'امنیت', icon: 'shield-check', usageCount: 654, lastUsed: '2024-01-14T18:15:00', priority: 'high' }
  ])

  const [stats, setStats] = useState<Stats>({
    total_services: 23,
    active_services: 23,
    total_requests: 12487,
    uptime_percentage: 99.8,
    memory_usage: 64,
    api_status: 'online',
    daily_active_users: 342
  })

  const [apiKey, setApiKey] = useState<string>('apikey_user_free_123')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gatewayStatus, setGatewayStatus] = useState<'online' | 'offline' | 'checking'>('online')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('همه')
  const [executionHistory, setExecutionHistory] = useState<ServiceExecutionResult[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'recent'>('usage')
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all')
  const [favorites, setFavorites] = useState<number[]>([1, 5, 12, 18])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = useMemo(() => {
    const cats = ['همه', ...Array.from(new Set(services.map(s => s.category)))]
    return cats
  }, [services])

  const filteredServices = useMemo(() => {
    let filtered = services
    
    if (activeTab === 'favorites') {
      filtered = filtered.filter(service => favorites.includes(service.id))
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
      'default': Rocket
    }
    
    const IconComponent = icons[iconName] || icons.default
    return <IconComponent className="w-5 h-5" />
  }

  const getStatusText = (status: string) => {
    const texts = {
      active: 'فعال',
      inactive: 'غیرفعال',
      online: 'آنلاین',
      offline: 'آفلاین',
      checking: 'در حال بررسی'
    }
    return texts[status as keyof typeof texts] || status
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const mockServiceExecution = async (service: Service): Promise<ServiceExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    const isSuccess = Math.random() > 0.1
    const processingTime = `${Math.floor(Math.random() * 500) + 100}ms`
    const remainingCredits = Math.floor(Math.random() * 900) + 100
    
    if (!isSuccess) {
      return {
        success: false,
        requestId: `ERR-${Date.now()}`,
        processingTime,
        remaining_credits: remainingCredits,
        error: 'خطا در پردازش درخواست'
      }
    }
    
    const mockData = {
      id: service.id,
      timestamp: new Date().toISOString(),
      result: `نتیجه پردازش سرویس ${service.name} با موفقیت تولید شد`,
      details: {
        processed: true,
        confidence: (Math.random() * 0.5 + 0.5).toFixed(2),
        version: '1.0.0'
      }
    }
    
    return {
      success: true,
      requestId: `REQ-${Date.now()}-${service.id}`,
      processingTime,
      remaining_credits: remainingCredits,
      data: mockData
    }
  }

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
  }

  const executeService = async () => {
    if (!selectedService) return
    
    setIsLoading(true)
    const result = await mockServiceExecution(selectedService)
    
    if (result.success) {
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)])
      setServices(prev => prev.map(service => 
        service.id === selectedService.id 
          ? { 
              ...service, 
              usageCount: service.usageCount + 1,
              lastUsed: new Date().toISOString()
            }
          : service
      ))
      setStats(prev => ({
        ...prev,
        total_requests: prev.total_requests + 1
      }))
      
      alert(`✅ سرویس "${selectedService.name}" با موفقیت اجرا شد!\n\nشناسه درخواست: ${result.requestId}\nزمان پردازش: ${result.processingTime}\nاعتبار باقی‌مانده: ${result.remaining_credits}`)
    } else {
      alert(`❌ خطا در اجرای سرویس: ${result.error}`)
    }
    
    setIsLoading(false)
  }

  const testGatewayConnection = async () => {
    setGatewayStatus('checking')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setGatewayStatus('online')
    alert('✅ اتصال Gateway برقرار است\nوضعیت: آنلاین\nپینگ: 42ms')
  }

  const toggleFavorite = (serviceId: number) => {
    setFavorites(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const exportServicesData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalServices: services.length,
      services: services.map(s => ({
        name: s.name,
        category: s.category,
        usageCount: s.usageCount,
        status: s.status
      }))
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tetrasaas-services-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('✅ داده سرویس‌ها با موفقیت خروجی گرفته شد')
  }

  const refreshServices = () => {
    setServices(prev => prev.map(service => ({
      ...service,
      usageCount: service.usageCount + Math.floor(Math.random() * 10),
      status: Math.random() > 0.95 ? 'inactive' : 'active'
    })))
    
    alert('🔄 وضعیت سرویس‌ها به‌روزرسانی شد')
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    localStorage.setItem('tetrasaas_api_key', e.target.value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">داشبورد TetraSaaS</h1>
              <p className="text-gray-600 mt-2">
                مدیریت و نظارت بر <span className="font-bold text-blue-600">۲۳ سرویس ابری</span> در یک پلتفرم یکپارچه
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial">
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm w-full"
                placeholder="کلید API خود را وارد کنید"
              />
            </div>
            <div className="flex gap-3">
              <button 
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                onClick={testGatewayConnection}
              >
                <Activity className="w-4 h-4" />
                بررسی اتصال
              </button>
              <button
                onClick={() => alert('📚 مستندات API در حالت نمایشی فعال است')}
                className="px-5 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <DocIcon className="w-4 h-4" />
                مستندات API
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">📊 نمای کلی سامانه</h2>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Hash className="w-4 h-4" />
                ۲۳ سرویس فعال
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">کل سرویس‌ها</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">23</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-50">
              <p className="text-xs text-gray-500">همگی در دسترس</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">سرویس فعال</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">23</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-50">
              <p className="text-xs text-gray-500">بدون مشکل</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">درخواست‌ها</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total_requests.toLocaleString('fa-IR')}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-50">
              <p className="text-xs text-gray-500">امروز: ۲۴۷ درخواست</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">آپ‌تایم</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">99.8%</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-50">
              <p className="text-xs text-gray-500">۳۰ روز گذشته</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rose-600 font-medium">مصرف حافظه</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">64%</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-xl">
                <Database className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-rose-50">
              <p className="text-xs text-gray-500">۱۲.۸ گیگابایت</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">کاربران فعال</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">۳۴۲</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-50">
              <p className="text-xs text-gray-500">امروز</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">وضعیت API</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">آنلاین</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-50">
              <button 
                onClick={testGatewayConnection}
                className="text-xs text-indigo-700 hover:text-indigo-900"
              >
                (بررسی مجدد)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-10">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
              >
                همه سرویس‌ها
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'favorites' ? 'bg-amber-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
              >
                <span>⭐</span>
                مورد علاقه‌ها ({favorites.length})
              </button>
              <button
                onClick={refreshServices}
                className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی سرویس..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm w-full bg-white"
                />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white"
              >
                <option value="usage">پربازدیدترین</option>
                <option value="name">مرتب‌سازی الفبایی</option>
                <option value="recent">آخرین استفاده</option>
              </select>
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-gray-600">
              نمایش <span className="font-bold">{filteredServices.length}</span> سرویس از {services.length} سرویس
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={exportServicesData}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                خروجی JSON
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid/List */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">همه سرویس‌ها</h2>
                <p className="text-gray-600">
                  {services.length} سرویس فعال - {categories.length - 1} دسته‌بندی
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                صفحه {currentPage} از {totalPages}
              </span>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedServices.map(service => (
                <div
                  key={service.id}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl">
                        {getServiceIcon(service.icon)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{service.name}</h3>
                        <div className="mt-1 flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(service.priority)}`}>
                            {getPriorityText(service.priority)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(service.id)
                      }}
                      className={`text-lg ${favorites.includes(service.id) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                    >
                      {favorites.includes(service.id) ? '⭐' : '☆'}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-4 line-clamp-2 h-10">{service.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">دسته‌بندی:</span>
                      <span className="font-medium bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">استفاده:</span>
                      <span className="font-medium">{service.usageCount.toLocaleString('fa-IR')} بار</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                          {service.endpoint.split('/').pop()}
                        </code>
                        <button className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
                          جزئیات
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedServices.map(service => (
                <div
                  key={service.id}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg">
                        {getServiceIcon(service.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">{service.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(service.priority)}`}>
                            {getPriorityText(service.priority)}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            service.status === 'active' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {getStatusText(service.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📁 {service.category}</span>
                          <span>📊 {service.usageCount.toLocaleString('fa-IR')} بار استفاده</span>
                          <span>🕒 {formatDate(service.lastUsed)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(service.id)
                        }}
                        className={`text-xl ${favorites.includes(service.id) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                      >
                        {favorites.includes(service.id) ? '⭐' : '☆'}
                      </button>
                      <ChevronLeftIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                نمایش {Math.min(itemsPerPage, filteredServices.length - (currentPage - 1) * itemsPerPage)} از {filteredServices.length} سرویس
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
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
                      className={`w-10 h-10 rounded-lg font-medium ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">سرویسی یافت نشد</h3>
              <p className="text-gray-500 mb-6">با تغییر فیلترها مجدداً جستجو کنید</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('همه')
                  setActiveTab('all')
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                پاک‌سازی فیلترها
              </button>
            </div>
          )}
        </div>

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl border-2 border-blue-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                      {getServiceIcon(selectedService.icon)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedService.name}</h3>
                      <p className="text-gray-600 mt-1">{selectedService.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">📋 اطلاعات سرویس</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Endpoint</p>
                        <code className="block bg-gray-50 px-3 py-2 rounded text-sm font-mono">
                          {selectedService.endpoint}
                        </code>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">دسته‌بندی</p>
                          <p className="font-medium">{selectedService.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">اولویت</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedService.priority)}`}>
                            {getPriorityText(selectedService.priority)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">وضعیت</p>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              selectedService.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="font-medium">{getStatusText(selectedService.status)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">تعداد استفاده</p>
                          <p className="font-medium">{selectedService.usageCount.toLocaleString('fa-IR')} بار</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">آخرین استفاده</p>
                        <p className="font-medium">{formatDate(selectedService.lastUsed)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">⚡ اجرای سرویس</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">API Key</p>
                        <input
                          type="text"
                          value={apiKey}
                          onChange={handleApiKeyChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                          placeholder="API Key"
                        />
                      </div>
                      <button
                        onClick={executeService}
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                          isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            در حال اجرا...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            اجرای سرویس
                          </>
                        )}
                      </button>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => toggleFavorite(selectedService.id)}
                          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 ${
                            favorites.includes(selectedService.id)
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {favorites.includes(selectedService.id) ? '★' : '☆'}
                          {favorites.includes(selectedService.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {executionHistory.length > 0 && (
                  <div className="bg-white rounded-xl p-5 border border-gray-200 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">📝 تاریخچه اجرا</h4>
                    <div className="space-y-2">
                      {executionHistory.slice(0, 3).map((exec, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${exec.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex justify-between items-center">
                            <code className="text-sm font-mono">{exec.requestId}</code>
                            <span className={`px-2 py-1 rounded text-xs ${exec.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {exec.success ? '✅ موفق' : '❌ ناموفق'}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>زمان: {exec.processingTime}</span>
                            <span>اعتبار: {exec.remaining_credits}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    بستن
                  </button>
                  <button 
                    onClick={() => alert('📚 مستندات API در حالت نمایشی فعال است')}
                    className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
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
      <footer className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <Rocket className="w-6 h-6 text-blue-600" />
              <p className="font-bold text-lg text-gray-900">TetraSaaS Dashboard v2.0</p>
            </div>
            <p className="text-gray-600">توسعه یافته برای پروژه‌های TetraSaaS</p>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium">
                ✅ Gateway در حالت نمایشی فعال است
              </p>
            </div>
            <p className="text-xs text-gray-500">
              نسخه نمایشی - تمام سرویس‌ها شبیه‌سازی شده‌اند
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
