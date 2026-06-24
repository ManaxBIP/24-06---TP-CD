const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// API endpoint returning container and request information
app.get('/api/info', (req, res) => {
  // Try to determine the client IP (supporting reverse proxies)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  res.json({
    hostname: os.hostname(),
    uptime: Math.floor(process.uptime()),
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
    memory: {
      total: Math.round(os.totalmem() / (1024 * 1024)), // in MB
      free: Math.round(os.freemem() / (1024 * 1024))   // in MB
    },
    clientIp: clientIp,
    timestamp: new Date().toISOString()
  });
});

// Catch-all route to serve the SPA frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Hostname is: ${os.hostname()}`);
});
