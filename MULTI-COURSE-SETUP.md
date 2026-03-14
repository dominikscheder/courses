# Multi-Course Setup

This project has been reconfigured to support multiple separate classnotes courses.

## Directory Structure

The project now uses a multi-course structure:

```
TI-2/
├── course1/
│   ├── wly/          # Source .wly files for course 1
│   └── public/       # Generated HTML and assets for course 1
├── course2/
│   ├── wly/          # Source .wly files for course 2
│   └── public/       # Generated HTML and assets for course 2
└── src/              # Gleam source code for the renderer
```

**Note:** The Gleam renderer is currently hardcoded to use `course1/wly` and `course1/public`. To work with course2, you would need to temporarily modify the paths in the source files.

## Development Workflow

### Serving Multiple Courses Simultaneously

To serve both courses on different ports at the same time:

```bash
npm run dev
```

This uses `concurrently` to run both Vite dev servers:
- **Course 1** on http://localhost:3003
- **Course 2** on http://localhost:3004

### Serving Individual Courses

To serve only course1:
```bash
npm run dev:course1
```

To serve only course2:
```bash
npm run dev:course2
```

### Building/Rendering Course 1

Since the Gleam renderer is hardcoded to use course1 paths, building course1 is straightforward:

```bash
# Build course1
npm run build:course1
# or directly with gleam:
gleam run
```

### Watching for Changes

To automatically rebuild course1 when `.wly` files change:

```bash
# Watch course1
npm run watch-wly:course1
# or simply:
npm run watch-wly
```

## Configuration Files

The project uses separate Vite configuration files for each course:

- `vite.config.js` - Course 1 configuration (legacy, points to course1)
- `vite.course1.config.js` - Course 1 configuration (port 3003)
- `vite.course2.config.js` - Course 2 configuration (port 3004)

Each config file:
- Sets the appropriate `root` directory (`course1/public` or `course2/public`)
- Configures the port number
- Includes the log-event handler plugin
- Labels console output with the course name

## Working with Course 2

Course 2 has been set up with a minimal starter structure:
- `course2/wly/__parent.wly` - Document metadata
- `course2/wly/01/__parent.wly` - First chapter
- `course2/wly/01/01` - First section
- `course2/public/` - Assets (CSS, JS, images)

To work with course2, you would need to:
1. Temporarily change the hardcoded paths in the Gleam source files from `course1` to `course2`
2. Run `gleam run` to build
3. Serve with `npm run dev:course2`

Alternatively, you could implement a `--course` command-line parameter in the Gleam files to make switching between courses easier.

## Adding a New Course

To add a new course (e.g., `course3`):

1. Create the directory structure:
   ```bash
   mkdir -p course3/wly course3/public
   ```

2. Create a `course3/wly/__parent.wly` file with course metadata:
   ```
   |> Document
       title=Course 3 - Class Notes
       program=Example Course
       institution=Example Institution
       lecturer=Instructor Name
       homepage=https://example.com
   ```

3. Create at least one chapter:
   ```bash
   mkdir -p course3/wly/01
   ```
   
   Create `course3/wly/01/__parent.wly`:
   ```
   |> Chapter
       title=Chapter 1: Introduction

   This is the first chapter.
   ```
   
   Create `course3/wly/01/01`:
   ```
   |> Sub
       title=Section 1.1: Getting Started

   This is the first section.
   ```

4. Copy necessary assets:
   ```bash
   cp course1/public/app.css course3/public/
   cp course1/public/app.js course3/public/
   cp course1/public/mathjax_setup.js course3/public/
   cp -r course1/public/img course3/public/
   ```

5. Create `vite.course3.config.js`:
   ```javascript
   import { defineConfig } from "vite";
   import { exec } from "child_process";

   export default defineConfig({
     root: "course3/public",
     plugins: [
       {
         name: "log-event-handler-course3",
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
                   console.log(`[course3] received '${cmd}'`);
                   exec(cmd, { cwd: process.cwd() }, (error) => {
                     if (error) console.error(`[course3] Error: ${error.message}`);
                   });
                   res.writeHead(200, { "Content-Type": "application/json" });
                   res.end(JSON.stringify({ success: true }));
                 } catch (e) {
                   console.error(`[course3] Parse error:`, e);
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
       port: 3005,
       host: "0.0.0.0",
       cors: true,
     },
   });
   ```

6. Add npm scripts in `package.json`:
   ```json
   "dev:course3": "vite --config vite.course3.config.js"
   ```

7. Update the `dev` script to include course3:
   ```json
   "dev": "concurrently \"npm run dev:course1\" \"npm run dev:course2\" \"npm run dev:course3\""
   ```

8. To build course3, you'll need to modify the Gleam source files to use `course3` paths, then run `gleam run`.

## Available NPM Scripts

- `npm run dev` - Serve all courses simultaneously on different ports
- `npm run dev:course1` - Serve only course1 on port 3003
- `npm run dev:course2` - Serve only course2 on port 3004
- `npm run build:course1` - Build course1 from .wly sources
- `npm run watch-wly` - Watch course1 .wly files and rebuild on changes
- `npm run watch-wly:course1` - Same as watch-wly

## Gleam Source Files Modified

The following files have hardcoded paths changed from `./wly` and `./public` to `./course1/wly` and `./course1/public`:

- `src/main_renderer.gleam` - Main HTML renderer (lines 446-447)
- `src/formatter_renderer.gleam` - Formatter for .wly files (lines 145-146)
- `src/main_pipeline.gleam` - Author mode paths (lines 531-534)

To work with a different course, search for `course1` in these files and replace with your desired course directory name.

## Legacy Directories

The original `wly/` and `public/` directories at the root level are preserved for backward compatibility. The content has been copied to `course1/`.

## Port Assignments

- **Course 1**: Port 3003
- **Course 2**: Port 3004
- **Additional courses**: Use sequential ports (3005, 3006, etc.)

## Dependencies

The multi-course setup uses:
- **Vite** (v7.0.6+) - Development server and build tool
- **concurrently** (v8.2.2+) - Run multiple npm scripts simultaneously
- **nodemon** (v3.0.2+) - Watch .wly files for changes

## Future Improvements

To make working with multiple courses easier, consider:
1. Implementing a `--course` command-line parameter in the Gleam renderer
2. Passing the course directory dynamically through the build chain
3. Creating wrapper scripts that automatically handle path switching
4. Using environment variables to configure the course directory