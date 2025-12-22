import { useState } from 'react'
import { 
  Cpu, Brain, BarChart3, CheckCircle, Activity, Server, Lock, 
  Code, Wifi, Battery, FileText, Video, Image, Volume2, Globe, 
  Database, Rocket, ShieldCheck, Folder, Key, Eye, Send, Palette, 
  Box, Wind, Atom, Search, ArrowLeft, ChevronLeft, X, Play, 
  Loader2, FileText as DocIcon
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

function App() {
  // لیست کامل ۲۳ سرویس TetraSaaS
  const [services] = useState<Service[]>([
    {
      id: 1,
      name: 'تحلیلگر محتوا (NLP)',
      description: 'پردازش متن فارسی با 244 پست آموزشی - پست 244 فعال',
      status: 'active',
      endpoint: '/api/content/analyze',
      category: 'ai',
      icon: 'brain'
    },
    // ... بقیه سرویس‌ها (همان ۲۳ سرویس)
  ])

  const [apiKey] = useState<string>('apikey_user_free_123')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gatewayStatus] = useState<'online'>('online')
  const [totalRequests, setTotalRequests] = useState<number>(12487)

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

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
  }

  // تابع شبیه‌سازی شده برای اجرای سرویس
  const executeService = async () => {
    if (!selectedService) return
    
    try {
      setIsLoading(true)
      
      // شبیه‌سازی delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert(`✅ سرویس "${selectedService.name}" با موفقیت اجرا شد!\n\nشناسه درخواست: MOCK-${Date.now()}\nزمان پردازش: ${Math.floor(Math.random() * 500) + 100}ms\nاعتبار باقی‌مانده: ${Math.floor(Math.random() * 900) + 100}`)
      
      // به‌روزرسانی آمار
      setTotalRequests(prev => prev + 1)
      
    } catch (error: any) {
      console.error('خطا در اجرای سرویس:', error)
      alert(`خطا در اجرای سرویس: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testGatewayConnection = () => {
    alert('✅ Gateway در حالت نمایشی فعال است\n\nتوجه: در نسخه نمایشی، تمام سرویس‌ها به صورت شبیه‌سازی شده کار می‌کنند.')
  }

  // ... بقیه کد کامپوننت (همان طراحی کارتی)
}
