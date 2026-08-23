const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "..", "logs", "access.log");
fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

// Logs every request: timestamp, method, url, status code, response time
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`;

    console.log(line);
    fs.appendFile(logFilePath, line + "\n", (err) => {
      if (err) console.error("Failed to write to log file:", err.message);
    });
  });

  next();
}

module.exports = requestLogger;
