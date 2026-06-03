export default function handler(req, res) {
  const data = {
    time: new Date().toISOString(),
    uptime: process.uptime().toFixed(1),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    node: process.version,
    status: 'online',
  };
  res.status(200).json(data);
}
