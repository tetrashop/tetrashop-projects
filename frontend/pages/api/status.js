export default function handler(req, res) {
  res.status(200).json({
    time: new Date().toISOString(),
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    node: process.version,
    status: 'online',
  });
}
