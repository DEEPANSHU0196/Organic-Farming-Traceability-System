const { execSync } = require('child_process');

const port = process.env.PORT || 5000;

try {
  const output = execSync(`netstat -ano | findstr :${port}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const pids = [...new Set(
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(/\s+/).pop())
      .filter((pid) => /^\d+$/.test(pid))
  )];

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`Stopped process ${pid} listening on port ${port}`);
    } catch (error) {
      // Ignore processes that exit while we are cleaning up.
    }
  }
} catch (error) {
  // No process is using the port.
}