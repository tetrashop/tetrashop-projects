export default function handler(req, res) {
  const data = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    status: 'online',
  };
  res.status(200).json(data);
}
