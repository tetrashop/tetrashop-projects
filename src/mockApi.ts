export const mockGatewayCheck = () => {
  return {
    status: 'online',
    message: 'Gateway is running in mock mode',
    timestamp: new Date().toISOString()
  }
}

export const mockServiceExecution = (serviceId: number) => {
  return {
    success: true,
    requestId: `MOCK-${Date.now()}`,
    processingTime: `${Math.random() * 100 + 50}ms`,
    remaining_credits: Math.floor(Math.random() * 1000) + 100,
    message: 'Service executed successfully (mock mode)'
  }
}
