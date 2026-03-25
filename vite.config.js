import { defineConfig } from "vite";
import { exec } from "child_process";
import { basename } from "path";

const courseFolder = process.env.COURSE || "course1";
const rootPath = `${courseFolder}/public`;
const serverPort = Number(process.env.PORT) || 3003;
const name = `vite ${rootPath} ${serverPort}-local server`;

// Whitelist of allowed commands for security
const ALLOWED_COMMANDS = {
  open: {
    // Matches local file paths only
    pattern: /^open\s+(.+)$/,
    executor: (match) => {
      const target = match[1].trim();

      // Security: Must be within project directory (courseFolder)
      // Reject: absolute paths, parent directory traversal, URLs, dangerous patterns
      if (
        target.startsWith("/") || // No absolute paths
        target.includes("..") || // No parent directory traversal
        target.startsWith("~") || // No home directory shortcuts
        target.includes("://") || // No URLs or protocols
        /[;&|`$(){}]/.test(target) // No shell metacharacters
      ) {
        return null;
      }

      // Validate that path starts with allowed course folder
      if (!target.startsWith(courseFolder + "/")) {
        return null;
      }

      return `open "${target}"`;
    },
  },
  code: {
    pattern: /^code\s+--goto\s+([^:]+:\d+:\d+)$/,
    executor: (match) => {
      const filePath = match[1];
      // Validate format: path:line:column
      const parts = filePath.split(":");
      if (parts.length !== 3) return null;

      const [path, line, col] = parts;
      // Ensure line and column are numbers
      if (!/^\d+$/.test(line) || !/^\d+$/.test(col)) return null;

      // Basic path validation: no absolute paths, no parent directory traversal
      if (path.startsWith("/") || path.includes("..")) return null;

      return `code --goto "${filePath}"`;
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
