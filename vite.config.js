import { defineConfig } from "vite";
import { exec } from "child_process";

const courseFolder = process.env.COURSE || "course1";
const rootPath = `${courseFolder}/public`;
const serverPort = Number(process.env.PORT) || 3003;
const name = `vite ${rootPath} ${serverPort}-local server`;

const ALLOWED_COMMANDS = {
  open: {
    pattern: /^open\s+(.+)$/,
    executor: (match) => {
      const target = match[1].trim();
      if (target.includes("://")) return null; // no urls
      if (/[;&|`$(){}]/.test(target)) return null; // no shell metacharacters
      return `open "${target}"`;
    },
  },
  code: {
    pattern: /^code\s+--goto\s+([^:]+:\d+:\d+)$/,
    executor: (match) => {
      const filePath = match[1];
      const parts = filePath.split(":");
      if (parts.length === 1) parts.push("1");
      if (parts.length === 2) parts.push("1");
      if (parts.length !== 3) return null;
      const [path, line, col] = parts;
      if (!/^\d+$/.test(line) || !/^\d+$/.test(col)) return null;
      return `code --goto "${path}:${line}:${col}"`;
    },
  },
};

function validateAndSanitizeCommand(cmd) {
  if (!cmd || typeof cmd !== "string") {
    return null;
  }

  // Trim whitespace
  cmd = cmd.trim();

  // Check against each allowed command pattern
  for (const [commandName, config] of Object.entries(ALLOWED_COMMANDS)) {
    const match = cmd.match(config.pattern);
    if (match) {
      const sanitized = config.executor(match);
      if (sanitized) {
        console.log(`${name} validated command: ${commandName}`);
        return sanitized;
      }
    }
  }

  console.warn(`${name} rejected invalid command: ${cmd}`);
  return null;
}

export default defineConfig({
  root: rootPath,
  plugins: [
    {
      name: name,
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            if (req.url !== "/log-event" || req.method !== "POST") {
              return next();
            }

            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                const { cmd } = JSON.parse(body);
                console.log(`${name} received '${cmd}'`);

                // Validate and sanitize the command
                const sanitizedCmd = validateAndSanitizeCommand(cmd);

                if (!sanitizedCmd) {
                  console.error(`${name} rejected command: ${cmd}`);
                  res.writeHead(403, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: "Command not allowed",
                    }),
                  );
                  return;
                }

                // Execute only the sanitized command
                exec(sanitizedCmd, { cwd: process.cwd() }, (error) => {
                  if (error) console.error(`${name} error: ${error.message}`);
                });
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error(`${name} parse error:`, e);
                res.writeHead(400);
                res.end();
              }
            });
          });
        };
      },
    },
  ],
  server: {
    port: serverPort,
    host: "0.0.0.0",
    cors: true,
  },
});
