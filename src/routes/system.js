const express = require('express');
const router = express.Router();

router.get('/info', (req, res) => {
  res.json({
    platform: process.platform,
    nodeVersion: process.version,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

router.post('/command', async (req, res, next) => {
  try {
    const { command } = req.body;
    const allowedCommands = ['date', 'uptime', 'whoami'];
    const isAllowed = allowedCommands.some(cmd => command.startsWith(cmd));
    
    if (!isAllowed) {
      return res.status(403).json({ error: 'Command not allowed' });
    }
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const { stdout, stderr } = await execPromise(command);
    res.json({ output: stdout, error: stderr });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
