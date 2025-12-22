import { useState, useEffect, useMemo } from 'react'
import { 
  Cpu, Brain, BarChart3, CheckCircle, Activity, Server, Lock, 
  Code, Wifi, Battery, FileText, Video, Image, Volume2, Globe, 
  Database, Rocket, ShieldCheck, Folder, Key, Eye, Send, Palette, 
  Box, Wind, Atom, Search, ArrowLeft, ChevronLeft, X, Play, 
  Loader2, FileText as DocIcon, Filter, Download, Upload, RefreshCw
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
    { id: 1, name: 'تحلیلگر محتوا (NLP)', description: 'پردازش متن فارسی با 244 پست آموزشی - پست 244 فعال', status: 'active', endpoint: '/api/content/analyze', category: 'ai', icon: 'brain', usageCount: 1245, lastUsed: '2024-01-15T10:30:00' },
    { id: 2, name: 'حل کننده فرمول', description: 'محاسبه فرمول‌های ریاضی پیچیده', status: 'active', endpoint: '/api/formula/solve', category: 'compute', icon: 'cpu', usageCount: 892, lastUsed: '2024-01-14T14:20:00' },
    { id: 3, name: 'نویسنده هوشمند', description: 'تولید محتوای خودکار با هوش مصنوعی', status: 'active', endpoint: '/api/ai/write', category: 'ai', icon: 'file-text', usageCount: 1567, lastUsed: '2024-01-15T09:15:00' },
    { id: 4, name: 'مبدل سه‌بعدی', description: 'تبدیل مدل‌های 2D به 3D', status: 'active', endpoint: '/api/3d/convert', category: 'graphics', icon: 'box', usageCount: 543, lastUsed: '2024-01-13T16:45:00' },
    { id: 5, name: 'رمزگذار داده', description: 'امنیت پیشرفته برای داده‌های حساس', status: 'active', endpoint: '/api/security/encrypt', category: 'security', icon: 'lock', usageCount: 2109, lastUsed: '2024-01-15T11:20:00' },
    { id: 6, name: 'پردازشگر تصویر', description: 'پردازش و آنالیز تصاویر', status: 'active', endpoint: '/api/image/process', category: 'media', icon: 'image', usageCount: 1789, lastUsed: '2024-01-14T13:10:00' },
    { id: 7, name: 'مبدل صوت', description: 'تبدیل و پردازش فایل‌های صوتی', status: 'active', endpoint: '/api/audio/convert', category: 'media', icon: 'volume', usageCount: 987, lastUsed: '2024-01-12T15:30:00' },
    { id: 8, name: 'اسکنر شبکه', description: 'بررسی امنیت و وضعیت شبکه', status: 'active', endpoint: '/api/network/scan', category: 'network', icon: 'wifi', usageCount: 654, lastUsed: '2024-01-15T08:45:00' },
    { id: 9, name: 'بهینه‌ساز باتری', description: 'مدیریت مصرف انرژی سیستم', status: 'active', endpoint: '/api/system/battery', category: 'system', icon: 'battery', usageCount: 432, lastUsed: '2024-01-11T12:15:00' },
    { id: 10, name: 'سازماندهی فایل', description: 'مدیریت خودکار فایل‌ها و پوشه‌ها', status: 'active', endpoint: '/api/file/organize', category: 'system', icon: 'folder', usageCount: 1123, lastUsed: '2024-01-15T10:00:00' },
    { id: 11, name: 'تولیدکننده رمز', description: 'ایجاد رمزهای عبور امن', status: 'active', endpoint: '/api/security/password', category: 'security', icon: 'key', usageCount: 876, lastUsed: '2024-01-14T17:30:00' },
    { id: 12, name: 'مانیتور سیستم', description: 'نظارت بر عملکرد سرور و منابع', status: 'active', endpoint: '/api/system/monitor', category: 'system', icon: 'activity', usageCount: 2101, lastUsed: '2024-01-15T12:00:00' },
    { id: 13, name: 'نویسنده کوانتومی', description: 'پردازش کوانتومی متن', status: 'active', endpoint: '/api/ai/quantum-write', category: 'ai', icon: 'atom', usageCount: 321, lastUsed: '2024-01-10T14:45:00' },
    { id: 14, name: 'تبدیل 2D به 3D', description: 'تبدیل پیشرفته گرافیک', status: 'active', endpoint: '/api/3d/2d-to-3d', category: 'graphics', icon: 'box', usageCount: 456, lastUsed: '2024-01-13T11:20:00' },
    { id: 15, name: 'گرافیک دو بعدی', description: 'ایجاد و ویرایش گرافیک 2D', status: 'active', endpoint: '/api/graphic/2d', category: 'graphics', icon: 'palette', usageCount: 789, lastUsed: '2024-01-14T10:15:00' },
    { id: 16, name: 'طراحی تلسکوپ', description: 'شبیه‌سازی و طراحی اپتیک', status: 'active', endpoint: '/api/science/telescope', category: 'science', icon: 'eye', usageCount: 234, lastUsed: '2024-01-09T16:30:00' },
    { id: 17, name: 'سیستم تله‌پورت', description: 'انتقال داده‌های امن', status: 'active', endpoint: '/api/network/teleport', category: 'network', icon: 'send', usageCount: 567, lastUsed: '2024-01-12T09:45:00' },
    { id: 18, name: 'ویرایشگر ویدیو', description: 'پردازش ویدیو با هوش مصنوعی', status: 'active', endpoint: '/api/video/edit', category: 'media', icon: 'video', usageCount: 1234, lastUsed: '2024-01-15T13:25:00' },
    { id: 19, name: 'تمیز کننده کد', description: 'بهینه‌سازی و استانداردسازی کد', status: 'active', endpoint: '/api/code/clean', category: 'development', icon: 'code', usageCount: 1987, lastUsed: '2024-01-15T14:10:00' },
    { id: 20, name: 'مدیر پشتیبان', description: 'مدیریت خودکار backup سیستم', status: 'active', endpoint: '/api/backup/manage', category: 'system', icon: 'database', usageCount: 765, lastUsed: '2024-01-13T08:20:00' },
    { id: 21, name: 'سامانه ضد چندپارگی', description: 'بهینه‌سازی حافظه و منابع', status: 'active', endpoint: '/api/system/anti-fragmentation', category: 'system', icon: 'shield-check', usageCount: 432, lastUsed: '2024-01-11T15:40:00' },
    { id: 22, name: 'سامانه ضد سیگار', description: 'مدیریت سلامت سیستم', status: 'active', endpoint: '/api/system/anti-smoke', category: 'system', icon: 'wind', usageCount: 298, lastUsed: '2024-01-10T11:30:00' },
    { id: 23, name: 'باغ راز آلود', description: 'سیستم امنیتی پیشرفته', status: 'active', endpoint: '/api/security/secret-garden', category: 'security', icon: 'shield-check', usageCount: 654, lastUsed: '2024-01-14T18:15:00' }
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
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')
  const [favorites, setFavorites] = useState<number[]>([1, 5, 12, 18])

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

  const topServices = useMemo(() => {
    return [...services]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 6)
  }, [services])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6" dir="rtl">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">داشبورد TetraSaaS</h1>
              <p className="text-gray-600 mt-2">
                مدیریت و نظارت بر ۲۳ سرویس ابری در یک پلتفرم یکپارچه
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 نمای کلی سامانه</h2>
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
                <p className="text-sm text-green-600 font-medium">وضعیت API</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">آنلاین</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-50">
              <button 
                onClick={testGatewayConnection}
                className="text-xs text-green-700 hover:text-green-900"
              >
                (بررسی مجدد)
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-10">
        <div className="flex gap-4">
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
          <button
            onClick={exportServicesData}
            className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            خروجی
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">سرویس‌های برتر</h2>
              </div>
              <p className="text-gray-600">پربازدیدترین سرویس‌های پلتفرم</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.slice(0, 6).map(service => (
              <div
                key={service.id}
                className={`group bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 ${
                  selectedService?.id === service.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{service.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {service.endpoint}
                        </code>
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
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                    service.status === 'active' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-5 line-clamp-2">{service.description}</p>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">{service.category}</span>
                    <span className="text-xs text-gray-500">
                      {service.usageCount.toLocaleString('fa-IR')} بار استفاده
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      آخرین استفاده: {formatDate(service.lastUsed)}
                    </span>
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleServiceClick(service)
                      }}
                    >
                      اجرای سرویس
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">سرویسی با مشخصات جستجو یافت نشد</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('همه')
                }}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                پاک‌سازی فیلترها
              </button>
            </div>
          )}
        </div>

        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl border-2 border-blue-200 shadow-2xl max-w-2xl w-full p-6 md:p-8">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">اطلاعات سرویس</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Endpoint</p>
                      <code className="block mt-1 bg-gray-50 px-3 py-2 rounded text-sm">
                        {selectedService.endpoint}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">دسته‌بندی</p>
                      <p className="mt-1 font-medium">{selectedService.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">وضعیت</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          selectedService.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="font-medium">{getStatusText(selectedService.status)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تعداد استفاده</p>
                      <p className="mt-1 font-medium">{selectedService.usageCount.toLocaleString('fa-IR')} بار</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">آخرین استفاده</p>
                      <p className="mt-1 font-medium">{formatDate(selectedService.lastUsed)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">اجرای سرویس</h4>
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
                  <h4 className="font-semibold text-gray-800 mb-3">تاریخچه اجرا</h4>
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
        )}
      </main>

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
