# Quick Start Guide - Multi-Course Setup

## Overview

The project now supports multiple separate classnotes in parallel directories:
- `course1/` - Contains the original TI-2 content
- `course2/` - Starter template for a second course

Each course has its own `wly/` (source) and `public/` (output) directories.

## Quick Commands

### Development (serving the sites)

```bash
# Serve both courses at once
npm run dev
# → Course 1: http://localhost:3003
# → Course 2: http://localhost:3004

# Or serve individually
npm run dev:course1    # Port 3003
npm run dev:course2    # Port 3004
```

### Building (converting .wly to HTML)

```bash
# Build course1 (the only one currently supported)
gleam run
# or
npm run build:course1

# Watch for changes and auto-rebuild
npm run watch-wly
```

## Directory Structure

```
TI-2/
├── course1/
│   ├── wly/              # Source .wly files
│   │   ├── __parent.wly  # Document metadata
│   │   ├── 01/           # Chapter 1
│   │   ├── 02/           # Chapter 2
│   │   └── ...
│   └── public/           # Generated HTML + assets
│       ├── index.html
│       ├── 1-0.html
│       ├── 1-1.html
│       ├── app.css
│       ├── app.js
│       └── img/
├── course2/
│   ├── wly/              # Starter content
│   │   ├── __parent.wly
│   │   └── 01/
│   └── public/           # Assets copied from course1
├── src/                  # Gleam renderer source
├── vite.config.js        # Course1 vite config (legacy)
├── vite.course1.config.js # Course1 vite config
├── vite.course2.config.js # Course2 vite config
└── package.json
```

## What Changed

1. **Vite configuration** - Separate config files for each course, served via `concurrently`
   - `vite.course1.config.js` - Port 3003
   - `vite.course2.config.js` - Port 3004

2. **Gleam paths** - Hardcoded to use `course1/wly` and `course1/public`
   - `src/main_renderer.gleam`
   - `src/formatter_renderer.gleam`
   - `src/main_pipeline.gleam`

3. **NPM scripts** - New scripts for multi-course development
   - Uses `concurrently` to run multiple dev servers

## Important Notes

- The Gleam renderer currently only works with `course1` (paths are hardcoded)
- To work with `course2`, you'd need to modify the paths in the Gleam source files
- The old `wly/` and `public/` at the root are preserved for compatibility

## Typical Workflow

### Working with Course 1

1. **Edit content**: Modify `.wly` files in `course1/wly/`
2. **Build**: Run `gleam run` to generate HTML
3. **Develop**: Run `npm run dev:course1` to view changes
4. **Auto-rebuild** (optional): Run `npm run watch-wly` in another terminal

### Working with Both Courses

1. **Start dev servers**: Run `npm run dev` (serves both on ports 3003 and 3004)
2. **Edit course1**: Modify files in `course1/wly/`, run `gleam run`
3. **Edit course2**: Modify files in `course2/wly/`, manually update Gleam paths and rebuild

## Configuration Files

### Vite Configs
- Each course has its own Vite config file
- All configs include the log-event handler plugin
- Port numbers are assigned sequentially (3003, 3004, 3005, etc.)

### Package.json Scripts
```json
{
  "dev": "concurrently \"npm run dev:course1\" \"npm run dev:course2\"",
  "dev:course1": "vite --config vite.course1.config.js",
  "dev:course2": "vite --config vite.course2.config.js",
  "build:course1": "gleam run",
  "watch-wly": "nodemon --watch course1/wly --ext wly --exec \"gleam run\""
}
```

## Dependencies

Installed via `npm install`:
- **vite** (^7.0.6) - Dev server
- **concurrently** (^8.2.2) - Run multiple scripts
- **nodemon** (^3.0.2) - Watch for file changes

## Files Modified

**New directories:**
- `course1/` - Full copy of original content
- `course2/` - Starter template

**New files:**
- `vite.course1.config.js`
- `vite.course2.config.js`
- `MULTI-COURSE-SETUP.md` (detailed docs)
- `QUICK-START.md` (this file)

**Modified files:**
- `package.json` - New scripts
- `vite.config.js` - Points to course1
- `src/main_renderer.gleam` - Uses `./course1/` paths
- `src/formatter_renderer.gleam` - Uses `./course1/` paths
- `src/main_pipeline.gleam` - Uses `./course1/` paths (author mode)

## Troubleshooting

### Both servers won't start
- Make sure `concurrently` is installed: `npm install`
- Try running individually: `npm run dev:course1` and `npm run dev:course2`

### Port already in use
- Change the port in the respective `vite.courseX.config.js` file
- Update the documentation accordingly

### Gleam build fails
- Ensure you're in the TI-2 directory
- Run `gleam build` to check for compilation errors
- Verify `course1/wly/` directory exists and has content

## Need Help?

See `MULTI-COURSE-SETUP.md` for detailed documentation including:
- How to add a new course
- Detailed configuration examples
- Future improvement suggestions