# Multi-Course Setup - Changes Summary

## Overview

The project has been reconfigured to support multiple separate classnotes courses, each with their own source (`wly/`) and output (`public/`) directories.

## What Works Now

### ✅ Multiple Development Servers
```bash
npm run dev
```
This command now serves **both courses simultaneously**:
- **Course 1** at http://localhost:3003
- **Course 2** at http://localhost:3004

You can also run them individually:
```bash
npm run dev:course1   # Only course1 on port 3003
npm run dev:course2   # Only course2 on port 3004
```

### ✅ Building Course 1
```bash
gleam run
# or
npm run build:course1
```
Builds course1 from `.wly` source files to HTML in `course1/public/`

### ✅ Auto-Rebuild on Changes
```bash
npm run watch-wly
```
Watches `course1/wly/` directory and automatically rebuilds when files change.

## Directory Structure Changes

### Before
```
TI-2/
├── wly/           # All source files
├── public/        # All generated HTML
└── src/           # Gleam renderer
```

### After
```
TI-2/
├── course1/
│   ├── wly/       # Course 1 source files
│   └── public/    # Course 1 generated HTML
├── course2/
│   ├── wly/       # Course 2 source files
│   └── public/    # Course 2 generated HTML
├── wly/           # [Preserved] Legacy directory
├── public/        # [Preserved] Legacy directory
└── src/           # Gleam renderer (modified)
```

## Files Added

### Configuration Files
- `vite.course1.config.js` - Vite dev server config for course1 (port 3003)
- `vite.course2.config.js` - Vite dev server config for course2 (port 3004)

### Documentation
- `MULTI-COURSE-SETUP.md` - Comprehensive setup guide
- `QUICK-START.md` - Quick reference for common tasks
- `CHANGES-SUMMARY.md` - This file

### Course Directories
- `course1/` - Complete copy of original content
- `course2/` - Minimal starter template with:
  - `course2/wly/__parent.wly` - Document metadata
  - `course2/wly/01/__parent.wly` - Sample chapter
  - `course2/wly/01/01` - Sample section
  - `course2/public/` - Assets (CSS, JS, images)

## Files Modified

### Package.json
Updated scripts section:
```json
{
  "dev": "concurrently \"npm run dev:course1\" \"npm run dev:course2\"",
  "dev:course1": "vite --config vite.course1.config.js",
  "dev:course2": "vite --config vite.course2.config.js",
  "build:course1": "gleam run",
  "watch-wly": "nodemon --watch course1/wly --ext wly --exec \"gleam run\"",
  "watch-wly:course1": "nodemon --watch course1/wly --ext wly --exec \"gleam run\""
}
```

Added dependency:
- `concurrently` (^8.2.2) - Runs multiple npm scripts simultaneously

### Vite.config.js
Changed root path from `"public"` to `"course1/public"`

### Gleam Source Files

All paths updated from `./wly` and `./public` to `./course1/wly` and `./course1/public`:

**src/main_renderer.gleam** (lines 446-447)
```gleam
ds.RendererParameters(
  input_dir: "./course1/wly",
  output_dir: "./course1/public",
  prettifier_behavior: ds.PrettifierOff,
)
```

**src/formatter_renderer.gleam** (lines 145-146)
```gleam
ds.RendererParameters(
  input_dir: "./course1/wly",
  output_dir: "./course1/wly",
  prettifier_behavior: ds.PrettifierOff,
)
```

**src/main_pipeline.gleam** (lines 531-534 - author mode only)
```gleam
dl.ti2_turn_lines_into_3003_spans("./course1/wly/", [...]),
dl.ti2_adorn_img_with_3003_spans("./course1/public/", []),
dl.ti2_adorn_with_3003_spans(#("./course1/wly/", "", [...])),
dl.ti2_wrap_with_3003_spans(#("./course1/wly/", "", [...])),
```

## Current Limitations

### Gleam Renderer Hardcoded to Course1
The Gleam renderer only builds course1 because paths are hardcoded. To work with course2:
1. Manually edit the Gleam source files above
2. Change `course1` to `course2` in the paths
3. Run `gleam run`
4. Change back when done

### No Command-Line Course Selection
The Gleam renderer doesn't accept a `--course` parameter (yet). This could be a future enhancement.

## Migration Notes

### Backward Compatibility
- Original `wly/` and `public/` directories are preserved
- Old workflows still work if you haven't changed anything
- The old `vite.config.js` still works but now points to course1

### Data Migration
All original content was copied to `course1/`:
- `wly/` → `course1/wly/`
- `public/` → `course1/public/`

No files were deleted, only copied.

## Next Steps

### To Start Using the Multi-Course Setup
1. Install dependencies: `npm install`
2. Start both servers: `npm run dev`
3. Visit http://localhost:3003 for course1
4. Visit http://localhost:3004 for course2

### To Add More Courses
See `MULTI-COURSE-SETUP.md` section "Adding a New Course" for detailed instructions.

### To Work with Course 2
1. Edit files in `course2/wly/`
2. Temporarily modify Gleam paths (see above)
3. Run `gleam run`
4. View at http://localhost:3004

## Port Assignments

| Course   | Port | Config File              |
|----------|------|--------------------------|
| Course 1 | 3003 | vite.course1.config.js   |
| Course 2 | 3004 | vite.course2.config.js   |
| Course 3 | 3005 | vite.course3.config.js*  |

*Not yet created - see documentation for instructions

## Technical Details

### Why Separate Vite Configs?
Vite's dev server doesn't support running multiple configurations from a single file. We use `concurrently` to run multiple Vite instances, each with its own config file.

### Why Not Use --root and --port Flags?
While possible, separate config files provide:
- Better organization
- Per-course plugin configuration
- Labeled console output (e.g., `[course1]`, `[course2]`)
- Easier to extend with course-specific settings

### Why Hardcode Gleam Paths?
To minimize changes to the Gleam codebase and avoid potential bugs. A future enhancement could make this dynamic via command-line arguments.

## Questions?

- **Quick reference**: See `QUICK-START.md`
- **Detailed guide**: See `MULTI-COURSE-SETUP.md`
- **Troubleshooting**: See `QUICK-START.md` → "Troubleshooting" section