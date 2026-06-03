export default function handler(req, res) {
  const status = {
    timestamp: new Date().toISOString(),
    serverTime: new Date().toLocaleTimeString('fa-IR'),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    status: 'online',
    baleBot: 'pending (503 Bale API)',
    vercelEnv: process.env.VERCEL_ENV || 'development',
  };
  res.status(200).json(status);
}
