import { useState, useEffect } from 'react'
import { 
  Cloud, Cpu, Brain, Shield, Zap, BarChart3, Users, CheckCircle, 
  Activity, Server, Lock, Code, Wifi, Battery, FileText, Video, 
  Image, Database, Settings, Rocket, ShieldCheck, Folder, Key, Eye, Send
} from 'lucide-react'
import './index.css'

// کد ساده‌تر...
cd /data/data/com.termux/files/home/tetrashop-projects
import { useState, useEffect } from 'react'
import { 
  Cloud, Cpu, Brain, Shield, Zap, BarChart3, Users, CheckCircle, 
  Activity, Server, Lock, Code, Wifi, Battery, FileText, Video, 
  Image, Volume2, Globe, Database, Settings, Globe as NetworkIcon,
  Rocket, ShieldCheck, Folder, Key, Eye, Send, Palette, Box, Wind,
  Cube, Atom, Shield as ShieldIcon
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
      description: 'پردازش متن فارسی با 242 پست آموزشی - پست 242 فعال',
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
      icon: 'cube'
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

  // شبیه‌سازی بررسی وضعیت API Gateway
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setIsLoading(true)
        // در حالت واقعی، این آدرس باید به Gateway واقعی اشاره کند
        const response = await fetch('http://localhost:3000/gateway/health')
        if (response.ok) {
          setStats(prev => ({ ...prev, api_status: 'online' }))
        } else {
          setStats(prev => ({ ...prev, api_status: 'offline' }))
        }
      } catch {
        setStats(prev => ({ ...prev, api_status: 'offline' }))
      } finally {
        setIsLoading(false)
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getServiceIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'brain': Brain,
      'cpu': Cpu,
      'lock': Lock,
      'file-text': FileText,
      'cube': Cube,
      'image': Image,
      'volume': Volume2,
      'wifi': Wifi,
      'battery': Battery,
      'folder': Folder,
      'key': Key,
      'activity': Activity,
      'atom': Atom,
      'box': Box,
      'palette': Palette,
      'eye': Eye,
      'send': Send,
      'video': Video,
      'code': Code,
      'database': Database,
      'shield': ShieldIcon,
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

  const executeService = async () => {
    if (!selectedService) return
    
    try {
      setIsLoading(true)
      // در حالت واقعی، این درخواست به Gateway ارسال می‌شود
      alert(`درخواست اجرای سرویس "${selectedService.name}" ارسال شد.\n\nEndpoint: ${selectedService.endpoint}\nAPI Key: ${apiKey}`)
      
      // شبیه‌سازی افزایش تعداد درخواست‌ها
      setStats(prev => ({
        ...prev,
        total_requests: prev.total_requests + 1
      }))
    } catch (error) {
      console.error('خطا در اجرای سرویس:', error)
      alert('خطا در اجرای سرویس. لطفاً دوباره تلاش کنید.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    // در حالت واقعی، این مقدار باید در localStorage ذخیره شود
    localStorage.setItem('tetrasaas_api_key', e.target.value)
  }

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">کل سرویس‌ها</p>
            <p className="text-2xl font-bold text-blue-800">{stats.total_services}</p>
          </div>
          <Server className="w-8 h-8 text-blue-500 opacity-60" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">سرویس فعال</p>
            <p className="text-2xl font-bold text-emerald-800">{stats.active_services}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500 opacity-60" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600">درخواست‌ها</p>
            <p className="text-2xl font-bold text-purple-800">{stats.total_requests.toLocaleString('fa-IR')}</p>
          </div>
          <BarChart3 className="w-8 h-8 text-purple-500 opacity-60" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-600">آپ‌تایم</p>
            <p className="text-2xl font-bold text-amber-800">{stats.uptime_percentage}%</p>
          </div>
          <Activity className="w-8 h-8 text-amber-500 opacity-60" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-rose-600">مصرف حافظه</p>
            <p className="text-2xl font-bold text-rose-800">{stats.memory_usage}%</p>
          </div>
          <Database className="w-8 h-8 text-rose-500 opacity-60" />
        </div>
      </div>

      <div className={`border rounded-xl p-4 ${getStatusColor(stats.api_status)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">وضعیت API</p>
            <p className="text-2xl font-bold">{getStatusText(stats.api_status)}</p>
          </div>
          <Globe className="w-8 h-8 opacity-60" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6" dir="rtl">
      {/* هدر */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">داشبورد TetraSaaS</h1>
            </div>
            <p className="text-gray-600">
              مدیریت و نظارت بر ۲۳ سرویس ابری در یک پلتفرم یکپارچه
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">API Key:</span>
              <input
                type="text"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64"
                placeholder="کلید API خود را وارد کنید"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                <Settings className="w-4 h-4 inline ml-1" />
                تنظیمات
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm">
                مستندات
              </button>
            </div>
          </div>
        </div>

        {renderStatsCards()}
      </header>

      {/* بخش اصلی */}
      <main className="space-y-8">
        {/* سرویس‌های برتر */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              ⭐ سرویس‌های برتر
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="جستجوی سرویس..."
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-48"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>همه دسته‌بندی‌ها</option>
                <option>هوش مصنوعی</option>
                <option>امنیت</option>
                <option>شبکه</option>
                <option>سیستم</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map(service => (
              <div
                key={service.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedService?.id === service.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{service.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{service.endpoint}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* سرویس انتخاب شده */}
        {selectedService && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-lg">
                    {getServiceIcon(selectedService.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedService.name}</h3>
                    <p className="text-sm text-gray-600">{selectedService.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Endpoint:</strong> 
                    <code className="bg-white px-2 py-1 rounded mr-2 text-xs">{selectedService.endpoint}</code>
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>دسته‌بندی:</strong> {selectedService.category}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={executeService}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? 'در حال اجرا...' : '🚀 اجرای سرویس'}
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}

        {/* همه سرویس‌ها */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            🛠️ همه سرویس‌ها ({services.length} سرویس)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map(service => (
              <div
                key={service.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedService?.id === service.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">{service.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{service.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <code className="text-xs bg-gray-50 px-2 py-1 rounded">{service.endpoint}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* اعلان‌ها */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <span className="text-white">⚠️</span>
              </div>
              <h3 className="font-bold text-lg text-amber-900">توجه: محدودیت درخواست</h3>
            </div>
            <p className="text-amber-800 mb-4">
              پلن رایگان شما تنها ۵ درخواست باقی مانده است. 
              برای ادامه استفاده از سرویس‌ها، پلن خود را ارتقا دهید.
            </p>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
              ارتقای پلن
            </button>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <span className="text-white">💡</span>
              </div>
              <h3 className="font-bold text-lg text-emerald-900">راهنمای استفاده</h3>
            </div>
            <ul className="text-emerald-800 space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>برای استفاده از سرویس‌ها، API Key معتبر وارد کنید</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Gateway روی پورت 3000 در حال اجراست</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>NLP با پست 242 آماده ارائه خدمات است</span>
              </li>
            </ul>
            <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition">
              مشاهده مستندات کامل
            </button>
          </div>
        </div>
      </main>

      {/* فوتر */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600">
          <div>
            <p className="font-bold">TetraSaaS Dashboard v2.0</p>
            <p className="text-sm mt-1">توسعه یافته برای پروژه‌های TetraSaaS</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">
              {stats.api_status === 'online' 
                ? '✅ Gateway متصل است' 
                : stats.api_status === 'offline'
                ? '⚠️ اتصال به Gateway برقرار نیست'
                : '🔄 در حال بررسی اتصال...'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              آدرس Gateway: http://localhost:3000
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
