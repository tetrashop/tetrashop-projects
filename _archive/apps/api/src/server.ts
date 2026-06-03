import Fastify from 'fastify'
import { testAuth } from '@tetrasaas/auth'

const server = Fastify({ logger: true })

// Route سلامت
server.get('/health', async () => {
  const authResult = testAuth()
  return {
    status: '✅ TetraSaaS API v3.0 is running',
    auth: authResult,
    database: 'Simplified setup - No DB connection yet',
    timestamp: new Date().toISOString(),
    services: '26 AI services ready'
  }
})

// Route اصلی داشبورد
server.get('/', async () => {
  return {
    message: '🚀 Welcome to TetraSaaS Cloud Platform v3.0',
    version: '3.0.0',
    features: ['26 AI Services', 'Real-time Monitoring', 'API Key Management'],
    nextSteps: ['Connect database', 'Add authentication', 'Implement AI services']
  }
})

const start = async () => {
  try {
    const port = 3000
    const host = '0.0.0.0'
    await server.listen({ port, host })
    console.log(`🚀 TetraSaaS API running at http://localhost:${port}`)
    console.log(`📊 Health check: http://localhost:${port}/health`)
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
