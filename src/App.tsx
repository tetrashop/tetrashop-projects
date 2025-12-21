import { useState, useEffect } from 'react'
import { 
  Cloud, Cpu, Brain, Shield, Zap, BarChart3, Users, CheckCircle, 
  Activity, Server, Lock, Code, Wifi, Battery, FileText, Video, 
  Image, Volume2, Globe, Database, Settings, Rocket, ShieldCheck, 
  Folder, Key, Eye, Send, Palette, Box, Wind, Atom, Search, 
  ArrowLeft, ChevronLeft, X, Play, Loader2, FileText as DocIcon
} from 'lucide-react'
import './index.css'

// نوع داده سرویس
interface Service {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive'
  endpoint: string
  category: string
  icon: string
}

// نوع داده آمار
interface Stats {
  total_services: number
  active_services: number
  total_requests: number
  uptime_percentage: number
  memory_usage: number
  api_status: 'online' | 'offline' | 'checking'
}

function App() {
  // لیست کامل ۲۳ سرویس TetraSaaS
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'تحلیلگر محتوا (NLP)',
      description: 'پردازش متن فارسی با 243 پست آموزشی - پست 243 فعال',
      status: 'active',
      endpoint: '/api/content/analyze',
      category: 'ai',
      icon: 'brain'
    },
    {
      id: 2,
      name: 'حل کننده فرمول',
      description: 'محاسبه فرمول‌های ریاضی پیچیده',
      status: 'active',
      endpoint: '/api/formula/solve',
      category: 'compute',
      icon: 'cpu'
    },
    {
      id: 3,
      name: 'نویسنده هوشمند',
      description: 'تولید محتوای خودکار با هوش مصنوعی',
      status: 'active',
      endpoint: '/api/ai/write',
      category: 'ai',
      icon: 'file-text'
    },
    {
      id: 4,
      name: 'مبدل سه‌بعدی',
      description: 'تبدیل مدل‌های 2D به 3D',
      status: 'active',
      endpoint: '/api/3d/convert',
      category: 'graphics',
      icon: 'box'
    },
    {
      id: 5,
      name: 'رمزگذار داده',
      description: 'امنیت پیشرفته برای داده‌های حساس',
      status: 'active',
      endpoint: '/api/security/encrypt',
      category: 'security',
      icon: 'lock'
    },
    {
      id: 6,
      name: 'پردازشگر تصویر',
      description: 'پردازش و آنالیز تصاویر',
      status: 'active',
      endpoint: '/api/image/process',
      category: 'media',
      icon: 'image'
    },
    {
      id: 7,
      name: 'مبدل صوت',
      description: 'تبدیل و پردازش فایل‌های صوتی',
      status: 'active',
      endpoint: '/api/audio/convert',
      category: 'media',
      icon: 'volume'
    },
    {
      id: 8,
      name: 'اسکنر شبکه',
      description: 'بررسی امنیت و وضعیت شبکه',
      status: 'active',
      endpoint: '/api/network/scan',
      category: 'network',
      icon: 'wifi'
    },
    {
      id: 9,
      name: 'بهینه‌ساز باتری',
      description: 'مدیریت مصرف انرژی سیستم',
      status: 'active',
      endpoint: '/api/system/battery',
      category: 'system',
      icon: 'battery'
    },
    {
      id: 10,
      name: 'سازماندهی فایل',
      description: 'مدیریت خودکار فایل‌ها و پوشه‌ها',
      status: 'active',
      endpoint: '/api/file/organize',
      category: 'system',
      icon: 'folder'
    },
    {
      id: 11,
      name: 'تولیدکننده رمز',
      description: 'ایجاد رمزهای عبور امن',
      status: 'active',
      endpoint: '/api/security/password',
      category: 'security',
      icon: 'key'
    },
    {
      id: 12,
      name: 'مانیتور سیستم',
      description: 'نظارت بر عملکرد سرور و منابع',
      status: 'active',
      endpoint: '/api/system/monitor',
      category: 'system',
      icon: 'activity'
    },
    {
      id: 13,
      name: 'نویسنده کوانتومی',
      description: 'پردازش کوانتومی متن',
      status: 'active',
      endpoint: '/api/ai/quantum-write',
      category: 'ai',
      icon: 'atom'
    },
    {
      id: 14,
      name: 'تبدیل 2D به 3D',
      description: 'تبدیل پیشرفته گرافیک',
      status: 'active',
      endpoint: '/api/3d/2d-to-3d',
      category: 'graphics',
      icon: 'box'
    },
    {
      id: 15,
      name: 'گرافیک دو بعدی',
      description: 'ایجاد و ویرایش گرافیک 2D',
      status: 'active',
      endpoint: '/api/graphic/2d',
      category: 'graphics',
      icon: 'palette'
    },
    {
      id: 16,
      name: 'طراحی تلسکوپ',
      description: 'شبیه‌سازی و طراحی اپتیک',
      status: 'active',
      endpoint: '/api/science/telescope',
      category: 'science',
      icon: 'eye'
    },
    {
      id: 17,
      name: 'سیستم تله‌پورت',
      description: 'انتقال داده‌های امن',
      status: 'active',
      endpoint: '/api/network/teleport',
      category: 'network',
      icon: 'send'
    },
    {
      id: 18,
      name: 'ویرایشگر ویدیو',
      description: 'پردازش ویدیو با هوش مصنوعی',
      status: 'active',
      endpoint: '/api/video/edit',
      category: 'media',
      icon: 'video'
    },
    {
      id: 19,
      name: 'تمیز کننده کد',
      description: 'بهینه‌سازی و استانداردسازی کد',
      status: 'active',
      endpoint: '/api/code/clean',
      category: 'development',
      icon: 'code'
    },
    {
      id: 20,
      name: 'مدیر پشتیبان',
      description: 'مدیریت خودکار backup سیستم',
      status: 'active',
      endpoint: '/api/backup/manage',
      category: 'system',
      icon: 'database'
    },
    {
      id: 21,
      name: 'سامانه ضد چندپارگی',
      description: 'بهینه‌سازی حافظه و منابع',
      status: 'active',
      endpoint: '/api/system/anti-fragmentation',
      category: 'system',
      icon: 'shield'
    },
    {
      id: 22,
      name: 'سامانه ضد سیگار',
      description: 'مدیریت سلامت سیستم',
      status: 'active',
      endpoint: '/api/system/anti-smoke',
      category: 'system',
      icon: 'wind'
    },
    {
      id: 23,
      name: 'باغ راز آلود',
      description: 'سیستم امنیتی پیشرفته',
      status: 'active',
      endpoint: '/api/security/secret-garden',
      category: 'security',
      icon: 'shield-check'
    }
  ])

  const [stats, setStats] = useState<Stats>({
    total_services: 23,
    active_services: 23,
    total_requests: 12487,
    uptime_percentage: 99.8,
    memory_usage: 64,
    api_status: 'checking'
  })

  const [apiKey, setApiKey] = useState<string>('apikey_user_free_123')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gatewayStatus, setGatewayStatus] = useState<'online' | 'offline' | 'checking'>('checking')

  // تابع جدید برای تست Gateway
  const testGatewayConnection = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:3000/health')
      if (response.ok) {
        const data = await response.json()
        setGatewayStatus('online')
        setStats(prev => ({ ...prev, api_status: 'online' }))
        console.log('Gateway status:', data)
      } else {
        setGatewayStatus('offline')
        setStats(prev => ({ ...prev, api_status: 'offline' }))
      }
    } catch {
      setGatewayStatus('offline')
      setStats(prev => ({ ...prev, api_status: 'offline' }))
    } finally {
      setIsLoading(false)
    }
  }

  // شبیه‌سازی بررسی وضعیت API Gateway
  useEffect(() => {
    testGatewayConnection()
    const interval = setInterval(testGatewayConnection, 30000)
    return () => clearInterval(interval)
  }, [])

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
      'shield': Shield,
      'wind': Wind,
      'shield-check': ShieldCheck,
      'server': Server,
      'globe': Globe,
      'default': Zap
    }
    
    const IconComponent = icons[iconName] || icons.default
    return <IconComponent className="w-5 h-5" />
  }

  const getStatusColor = (status: 'active' | 'inactive' | 'online' | 'offline' | 'checking') => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      online: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      offline: 'bg-rose-100 text-rose-800 border-rose-200',
      checking: 'bg-amber-100 text-amber-800 border-amber-200'
    }
    return colors[status]
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

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
  }

  // تابع جدید برای اجرای سرویس واقعی
  const executeService = async () => {
    if (!selectedService) return
    
    try {
      setIsLoading(true)
      
      const endpoint = selectedService.endpoint
      const [_, service, action] = endpoint.split('/').filter(Boolean)
      
      // پارامترهای ورودی بر اساس نوع سرویس
      let requestBody = {}
      switch(selectedService.id) {
        case 1: // NLP
          requestBody = { text: 'این یک متن نمونه برای تحلیل سرویس NLP است. این متن به زبان فارسی نوشته شده است.' }
          break
        case 2: // حل فرمول
          requestBody = { formula: 'x^2 + 2*x + 1', variables: { x: 5 } }
          break
        case 3: // نویسنده هوشمند
          requestBody = { prompt: 'مقاله درباره هوش مصنوعی', length: 'medium' }
          break
        default:
          requestBody = { data: 'داده تست', timestamp: new Date().toISOString() }
      }
      
      const response = await fetch(`http://localhost:3000/api/${service}/${action}`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`✅ سرویس "${selectedService.name}" با موفقیت اجرا شد!\n\nشناسه درخواست: ${result.requestId}\nزمان پردازش: ${result.processingTime}\nاعتبار باقی‌مانده: ${result.remaining_credits}`)
        
        // به‌روزرسانی آمار
        setStats(prev => ({
          ...prev,
          total_requests: prev.total_requests + 1
        }))
      } else {
        alert(`❌ خطا در اجرای سرویس: ${result.error}`)
      }
    } catch (error: any) {
      console.error('خطا در اجرای سرویس:', error)
      alert(`خطا در ارتباط با Gateway: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    localStorage.setItem('tetrasaas_api_key', e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6" dir="rtl">
      {/* === بخش هدر === */}
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
              <a 
                href="http://localhost:3000/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <DocIcon className="w-4 h-4" />
                مستندات API
              </a>
            </div>
          </div>
        </div>

        {/* کارت‌های آمار */}
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
                <p className="text-2xl font-bold text-gray-900 mt-2">۱۲٬۴۸۷</p>
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

      {/* === بخش اصلی === */}
      <main className="space-y-10">
        {/* سرویس‌های برتر */}
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
                  placeholder="جستجوی سرویس..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm w-full bg-white"
                />
              </div>
              <select className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
                <option>همه دسته‌بندی‌ها</option>
                <option>هوش مصنوعی</option>
                <option>امنیت</option>
                <option>شبکه</option>
                <option>سیستم</option>
                <option>رسانه</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.slice(0, 6).map(service => (
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
                      <div className="mt-1">
                        <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {service.endpoint}
                        </code>
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
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{service.category}</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                    اجرای سرویس
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* همه سرویس‌ها */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <span className="text-white text-xl">🛠️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">همه سرویس‌ها</h2>
              <p className="text-gray-600">{services.length} سرویس در دسترس</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map(service => (
              <div
                key={service.id}
                className={`group bg-white rounded-xl border p-4 cursor-pointer transition-all duration-250 hover:shadow-lg hover:border-blue-200 ${
                  selectedService?.id === service.id 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{service.name}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    service.status === 'active' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{service.description}</p>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded font-mono">
                      {service.endpoint.split('/').pop()}
                    </code>
                    <button className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
                      جزئیات
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* پنل سرویس انتخاب شده */}
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
                      disabled={isLoading || gatewayStatus === 'offline'}
                      className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        isLoading || gatewayStatus === 'offline'
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
                    {gatewayStatus === 'offline' && (
                      <p className="text-red-600 text-sm text-center">
                        ⚠️ Gateway در دسترس نیست
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  بستن
                </button>
                <a 
                  href={`http://localhost:3000/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  مشاهده مستندات
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* === بخش فوتر === */}
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
              <div className={`w-2 h-2 rounded-full ${
                gatewayStatus === 'online' ? 'bg-green-500' : 
                gatewayStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <p className="text-sm font-medium">
                {gatewayStatus === 'online' 
                  ? '✅ Gateway متصل است' 
                  : gatewayStatus === 'offline'
                  ? '⚠️ اتصال به Gateway برقرار نیست'
                  : '🔄 در حال بررسی اتصال...'}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              آدرس Gateway: 
              <a 
                href="http://localhost:3000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 mr-1"
              >
                http://localhost:3000
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
