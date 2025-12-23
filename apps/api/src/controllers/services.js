import { database } from '@tetrasaas/database';
import { tetraAuth } from '@tetrasaas/auth';

export class ServicesController {
  
  /**
   * دریافت لیست همه سرویس‌ها
   */
  static async getAllServices(req, res) {
    try {
      const services = await database.getAllServices();
      
      // گروه‌بندی بر اساس دسته
      const groupedByCategory = services.reduce((acc, service) => {
        const category = service.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push({
          id: service.id,
          slug: service.slug,
          name: service.name,
          description: service.description,
          icon: service.icon,
          pricePerCall: service.price_per_call,
          isActive: service.is_active === 1,
          endpoint: `/api/services/${service.slug}`,
          documentation: `https://docs.tetrasaas.com/services/${service.slug}`
        });
        return acc;
      }, {});
      
      res.json({
        success: true,
        count: services.length,
        categories: Object.keys(groupedByCategory),
        services: groupedByCategory,
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      });
      
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        error: true,
        code: 'SERVICES_FETCH_ERROR',
        message: 'Failed to fetch services',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * دریافت اطلاعات یک سرویس خاص
   */
  static async getService(req, res) {
    try {
      const { slug } = req.params;
      const service = await database.getServiceBySlug(slug);
      
      if (!service) {
        return res.status(404).json({
          error: true,
          code: 'SERVICE_NOT_FOUND',
          message: `Service '${slug}' not found`,
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        success: true,
        service: {
          id: service.id,
          slug: service.slug,
          name: service.name,
          nameEn: service.name_en,
          description: service.description,
          category: service.category,
          icon: service.icon,
          endpointPath: service.endpoint_path,
          pricePerCall: service.price_per_call,
          isActive: service.is_active === 1,
          config: service.config ? JSON.parse(service.config) : null,
          createdAt: service.created_at,
          updatedAt: service.updated_at,
          apiEndpoint: `/api/services/${service.slug}`,
          examples: this.getServiceExamples(service.slug),
          documentation: `https://docs.tetrasaas.com/services/${service.slug}`
        },
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      });
      
    } catch (error) {
      console.error(`Error fetching service ${req.params.slug}:`, error);
      res.status(500).json({
        error: true,
        code: 'SERVICE_FETCH_ERROR',
        message: 'Failed to fetch service information',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * اجرای یک سرویس
   */
  static async executeService(req, res) {
    try {
      const { slug } = req.params;
      const input = req.body;
      const apiKey = req.headers['x-api-key'] || req.auth?.apiKey;
      
      // اعتبارسنجی (اگر از میدلور استفاده نکرده‌ایم)
      if (!req.auth) {
        const authResult = await tetraAuth.authenticate(apiKey, slug);
        req.auth = authResult;
      }
      
      // اجرای سرویس بر اساس نوع
      const result = await this.executeServiceByType(slug, input, req.auth);
      
      // پاسخ موفق
      res.json({
        success: true,
        service: slug,
        requestId: req.requestId,
        tenantId: req.auth.tenantId,
        creditsUsed: req.auth.servicePrice,
        processingTime: result.processingTime || 0,
        result: result.data,
        metadata: {
          timestamp: new Date().toISOString(),
          serviceVersion: '1.0',
          ...result.metadata
        },
        links: {
          documentation: `https://docs.tetrasaas.com/services/${slug}`,
          status: `/api/status`,
          usage: `/api/usage`
        }
      });
      
    } catch (error) {
      console.error(`Error executing service ${req.params.slug}:`, error);
      
      const statusCode = error.code === 'INSUFFICIENT_CREDITS' ? 402 :
                        error.code === 'RATE_LIMIT' ? 429 :
                        error.code === 'INVALID_API_KEY' ? 401 : 500;
      
      res.status(statusCode).json({
        error: true,
        code: error.code || 'SERVICE_EXECUTION_ERROR',
        message: error.message || `Failed to execute service '${req.params.slug}'`,
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        ...(error.code === 'INSUFFICIENT_CREDITS' && {
          solution: 'Add credits to your account to continue',
          currentCredits: error.currentCredits,
          requiredCredits: error.requiredCredits
        })
      });
    }
  }
  
  /**
   * اجرای سرویس بر اساس نوع
   */
  static async executeServiceByType(slug, input, auth) {
    const startTime = Date.now();
    
    // شبیه‌سازی اجرای سرویس‌های مختلف
    // در نسخه واقعی، اینجا مدل‌های هوش مصنوعی فراخوانی می‌شوند
    switch (slug) {
      case 'sentiment-analysis':
        return {
          data: {
            sentiment: 'positive',
            confidence: 0.92,
            scores: {
              positive: 0.92,
              negative: 0.05,
              neutral: 0.03
            }
          },
          processingTime: Date.now() - startTime,
          metadata: { model: 'bert-base-multilingual', version: '2.0' }
        };
        
      case 'image-enhancement':
        return {
          data: {
            enhanced: true,
            resolution: '4k',
            qualityScore: 0.95,
            format: 'jpeg'
          },
          processingTime: Date.now() - startTime,
          metadata: { model: 'super-resolution', version: '1.5' }
        };
        
      case 'text-summarization':
        return {
          data: {
            summary: 'This is a summarized version of the input text.',
            originalLength: input.text?.length || 0,
            summaryLength: 50,
            compressionRatio: 0.8
          },
          processingTime: Date.now() - startTime,
          metadata: { model: 't5-summarizer', version: '1.2' }
        };
        
      default:
        // پاسخ پیش‌فرض برای سایر سرویس‌ها
        return {
          data: {
            message: `Service '${slug}' executed successfully`,
            inputReceived: Object.keys(input).length,
            processingCompleted: true,
            mockResponse: true
          },
          processingTime: Date.now() - startTime,
          metadata: { mock: true, note: 'This is a mock response for development' }
        };
    }
  }
  
  /**
   * مثال‌های استفاده از هر سرویس
   */
  static getServiceExamples(slug) {
    const examples = {
      'sentiment-analysis': {
        input: {
          text: 'This product is absolutely amazing! I love it.'
        },
        output: {
          sentiment: 'positive',
          confidence: 0.95,
          scores: { positive: 0.95, negative: 0.03, neutral: 0.02 }
        }
      },
      'image-enhancement': {
        input: {
          image: 'base64_encoded_image_data',
          targetResolution: '4k'
        },
        output: {
          enhancedImage: 'base64_encoded_enhanced_image',
          resolution: '4k',
          qualityImprovement: 0.85
        }
      },
      'text-summarization': {
        input: {
          text: 'Long article text here...',
          maxLength: 100
        },
        output: {
          summary: 'Summarized text here...',
          keyPoints: ['Point 1', 'Point 2', 'Point 3']
        }
      }
    };
    
    return examples[slug] || {
      input: { data: 'Your input data here' },
      output: { result: 'Processed result will appear here' }
    };
  }
  
  /**
   * دریافت دسته‌بندی‌ها
   */
  static async getCategories(req, res) {
    try {
      const categories = await database.getCategories();
      
      res.json({
        success: true,
        count: categories.length,
        categories: categories.map(cat => ({
          name: cat.category,
          servicesCount: 0, // در نسخه کامل از دیتابیس شمارش می‌شود
          description: this.getCategoryDescription(cat.category)
        })),
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      });
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        error: true,
        code: 'CATEGORIES_FETCH_ERROR',
        message: 'Failed to fetch categories',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * توضیحات دسته‌بندی‌ها
   */
  static getCategoryDescription(category) {
    const descriptions = {
      'بینایی کامپیوتر': 'Computer vision services for image and video analysis',
      'NLP': 'Natural Language Processing for text analysis and generation',
      'پردازش صوت': 'Audio processing and speech recognition services',
      'علم داده': 'Data analysis and predictive modeling',
      'مالی': 'Financial market analysis and prediction',
      'امنیت': 'Cybersecurity threat detection',
      'سلامت': 'Medical data analysis and diagnosis assistance',
      'خودرو': 'Autonomous vehicle sensor data processing',
      'IoT': 'Internet of Things data analytics',
      'هواشناسی': 'Weather forecasting and climate analysis',
      'زیست‌فناوری': 'Genetic data analysis and bioinformatics',
      'گرافیک': '3D rendering and graphic processing'
    };
    
    return descriptions[category] || `${category} services`;
  }
}

export default ServicesController;
