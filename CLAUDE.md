# courses — Multi-Course Lecture Notes Renderer

## Start Here: Writerly Library

Before working in this repo, read `../wly/CLAUDE.md` (sibling directory). That file documents:
- The **Writerly** markup language (`.wly` syntax, multi-file assembly, `WriterlyBlankLine` / `WriterlyCodeBlock` / `WriterlyComment` nodes)
- The **VXML** AST (`V` and `T` nodes, `Blame`, `Attr`, `Line`)
- The **desugaring** library — `Desugarer`, `Pipeline`, `Renderer`, and the full data-flow:
  ```
  Writerly source → List(InputLine) → VXML → VXML (pipeline) → List(OutputFragment) → HTML files
  ```
- The `desugarer_library` API (`dl.*`) and how to read individual desugarer files

## What This Repo Does

`courses` is a **consumer project** of the Writerly/desugaring stack. It renders university
lecture notes written in Writerly markup into multi-page HTML. The repo supports multiple
independent courses side by side (`course1/`, `course2/`, …), each with its own `wly/` source
tree and `public/` HTML output.

Language: **Gleam**. Entry point: `src/main.gleam`.

The Writerly/desugaring library lives at `../wly/` (sibling to this repo). It is imported as a
local Gleam dependency in `gleam.toml`:
```toml
vxml = { "path" = "../../vistuleB/wly/vxml" }
writerly = { "path" = "../../vistuleB/wly/writerly" }
desugaring = { "path" = "../../vistuleB/wly/desugaring" }
```

## Project Layout

```
courses/
├── gleam.toml              # Gleam project manifest
├── src/
│   ├── main.gleam              # CLI entry point; dispatches to renderer or formatter
│   ├── pipeline.gleam          # Desugaring pipeline: wly VXML → HTML-ready VXML
│   ├── renderer.gleam          # HTML emitter; splits VXML into per-page HTML fragments
│   ├── formatter_pipeline.gleam  # Pipeline for wly→wly formatting
│   └── formatter_renderer.gleam  # Formatter: reads wly, rewraps/normalizes, writes wly back
├── course1/
│   ├── wly/                    # Writerly source for course 1
│   └── public/                 # Generated HTML output for course 1
├── course2/
│   ├── wly/
│   └── public/
├── shared/                     # Shared static assets (app.css, app.js, mathjax_setup.js, mathjax3/)
├── vite.config.js              # Dev server (reads COURSE env var, defaults to course1, port 3003)
├── vite.course1.config.js      # Per-course Vite config (port 3003)
├── vite.course2.config.js      # Per-course Vite config (port 3004)
└── package.json
```

## Source (`wly/`) Layout Within Each Course

The document hierarchy is two levels deep: **Chapter** → **Sub** (subchapter). Subs live as
named `.wly` files inside the chapter subdirectory (not nested subdirectories):

```
<course>/wly/
├── __parent.wly          # Root Document node — declares title, banner, program,
│                         #   institution, language, lecturer, homepage
├── 01/                   # Chapter 1 directory
│   └── __parent.wly      # Chapter 1 node (title, body, Exercises — all in one file)
├── 02/                   # Chapter 2 directory
│   ├── __parent.wly      # Chapter 2 node (title, intro text)
│   ├── 01-some-topic.wly # Sub 2.1
│   ├── 02-other-topic.wly# Sub 2.2
│   └── ...
├── 03/
│   └── ...
└── ...
```

Key rules:
- A chapter with no Subs puts all content directly in `__parent.wly`.
- When a chapter has Subs, each Sub is a separate `.wly` file in the chapter directory.
  The Writerly assembler appends them in lexicographic order to `__parent.wly`.
- Files and directories starting with `#` are Writerly comments (ignored by the assembler).

### Required `__parent.wly` attributes (root Document)

```
|> Document
    title=<full course title>
    banner=<short browser-tab prefix>
    program=<degree program name>
    institution=<university name>
    language=<en|de>
    lecturer=<lecturer name>
    homepage=<course homepage URL>
```

The `language` attribute controls localization in the pipeline (`"de"` → German term names
like "Beweis", "Beispiel", "Beobachtung"; `"en"` → English equivalents).

## Commands

### Render to HTML

```sh
gleam run -- --which <course_dir> --offline-mathjax
```

`<course_dir>` is a local directory such as `course1` or `course2` that has a `wly/` subdirectory.

Useful flags:
| Flag | Effect |
|---|---|
| `--which <dir>` | **Required.** Specifies the course directory |
| `--offline-mathjax` | Use local MathJax (from `shared/mathjax3/`) instead of CDN |
| `--local` | Author mode: add source-linking tooltips (requires local dev server) |
| `--only <path>` | Render only a specific file or subtree |
| `--help` | Print full usage |
| `--esoteric` | Print advanced/esoteric CLI options |

### Format Writerly source in-place

```sh
gleam run -- --which <course_dir> --fmt [<cols>] [<cols> <penalty>] [-file <name>]
```

Rewraps and normalizes `.wly` files in `<course_dir>/wly/` and writes them back. Options:
- `<cols>` — preferred line length (default 55)
- `<cols> <penalty>` — line length + indentation penalty
- `-file <name>` — format only a single named file

### Local dev server

```sh
COURSE=course1 npm run dev       # serves course1 on localhost:3003
PORT=3004 COURSE=course2 npm run dev
```

Or use the dedicated per-course scripts:
```sh
npm run dev:course1    # port 3003
npm run dev:course2    # port 3004
npm run dev            # both at once (uses concurrently)
```

Configure defaults in a `.env` file at the project root:
```
COURSE=course1
PORT=3003
```

### Watch and auto-rebuild

```sh
npm run watch-wly      # watches course1/wly, rebuilds on .wly change
```

### Adding a new course

1. `mkdir -p courseN/wly courseN/public`
2. Create `courseN/wly/__parent.wly` with the required Document attributes (see above)
3. Create at least one chapter directory: `courseN/wly/01/__parent.wly`
4. Symlink shared assets:
   ```sh
   ln -s ../../shared/app.css courseN/public/app.css
   ln -s ../../shared/app.js courseN/public/app.js
   ln -s ../../shared/mathjax_setup.js courseN/public/mathjax_setup.js
   ```
5. Create `vite.courseN.config.js` (copy from `vite.course2.config.js`, bump port)
6. Add `"dev:courseN": "vite --config vite.courseN.config.js"` to `package.json`

## Output (`public/`) Layout

HTML files are named by structural coordinates:
- `index.html` — course index page
- `N-0.html` — Chapter N index page
- `N-M.html` — Chapter N, Sub M

## Pipeline (`src/pipeline.gleam`)

`pub fn pipeline(parameters, author_mode: Bool, language: String) -> Pipeline`

The pipeline is language-aware: pass `"de"` for German or `"en"` for English. It controls
localized label text for `Proof`, `Example`, `Observation`, `Claim`, `Algorithm`.

Key stages in order:

1. **Tag validation** — `check_tags` against pre-transformation approved list
2. **Cleanup** — `delete("WriterlyComment")`, drop `!!`-prefixed attributes,
   `rename("WriterlyCodeBlock", "pre")`
3. **QED injection** — `append("Proof", "QED")` then `replace_with_arbitrary` with the ◻ symbol
4. **Semantic renaming** — `Theorem`, `Definition`, `Observation`, `Example`, `Lemma`, `Claim`,
   `Problem`, `Algorithm`, `Demo` → `Statement` with localized `title` attribute;
   `Proof` → `Highlight` with localized `title`
5. **`ti2` numbering** — `dl.ti2_add_should_be_numbers()`, `dl.ti2_backfill()` (project-specific
   counter housekeeping)
6. **Counter attributes** — appends `SubCounter`, `ExerciseCounter`, `StatementCounter` to
   `Document`, `Chapter`, `Sub`; increments `ChapterCounter`, `SubCounter`, `ExerciseCounter`,
   `StatementCounter`
7. **Path attributes** — injects `path` attributes: `Chapter` → `./N-0.html`,
   `Sub` → `./N-M.html`
8. **Handle system** — `set_handle_value` on `Chapter`, `Sub`, `Statement`, `Exercise`, `Topic`;
   later resolved with `handles_add_ids` + `handles_generate_dictionary_and_id_list` +
   `handles_substitute_and_fix_nonlocal_id_links`
9. **Auto-generate titles** — `auto_generate_child_if_missing_from_attribute` for `ChapterTitle`
   and `SubTitle`; injects `number-chiron` attributes for numbering display
10. **Counter text injection** — `prepend_text_node_if_has_ancestor_else__batch` for `Exercise`
    and `Statement` (with Sub-aware dotted numbering, e.g. "2.3.1")
11. **`insert_attribute_as_text`** — injects `Statement.title` and `Highlight.title` /
    `Remark.title` as text nodes
12. **`substitute_counters()`** — expands all `::øø...` counter references
13. **Math block parsing** — `pp.create_mathblock_elements` (`$$`, `\begin{align}`,
    `\begin{align*}`)
14. **Inline math parsing** — `pp.create_math_elements` (`\(`, `$`)
15. **Escaped dollar sign** — `regex_split_and_replace__outside` turns `\$` → `<span>$</span>`
16. **Paragraph grouping** — `group_consecutive_children__outside("p", p_cannot_contain)`
17. **Blank line / p cleanup**
18. **`ti2` code-block processing** — `dl.ti2_process_pre_listing_classname()`,
    `dl.ti2_parse_python_prompt_pre()`, `dl.ti2_parse_orange_comments_pre()`,
    `dl.ti2_parse_arbitrary_prompt_response_pre()`, `dl.ti2_parse_redyellow_pre()`,
    `dl.ti2_parse_xml_pre()`, `dl.ti2_add_listing_bol_spans()` — syntax-highlights `pre` blocks
19. **Index & menu creation** — `dl.ti2_create_index()`, `dl.ti2_create_menu()`
20. **Prev/next navigation** — `dl.ti2_add_prev_next_chapter_title_elements()`
21. **End-of-page element injection** — `insert_custom_before_first`, `append_custom` inserts
    `EndOfPageElt` markers into `Chapter`, `Sub`, `Index`
22. **Carousel expansion** — `dl.wrap_and_custom_steal`, `dl.ti2_expand_carousels()`
23. **Image dimension forwarding** — `dl.ti2_cut_paste_width_height_to_descendant_img`
24. **Number chiron insertion** — inserts `&ensp;` before chapter/sub title numbers
25. **Backtick splitting** — `pp.annotated_backtick_splitting` for annotated spans
26. **Markdown link splitting** — `pp.markdown_link_splitting` (skips math)
27. **Backtick → `<code>`** — `` `...` `` → `<code>` (skips math, pre)
28. **Italic/bold** — `_..._` → `<i>`, `*...*` → `<b>` (skips math, pre, code)
29. **`bridge_whitespace("b")`**, **`wrap_adjacent_non_whitespace_text_with`** (NoWrap for math/i/b/code)
30. **Splitting cleanup** — `pp.splitting_empty_lines_cleanup()`
31. **Handle resolution** — `handles_add_ids`, `handles_generate_dictionary_and_id_list`,
    `handles_substitute_and_fix_nonlocal_id_links`
32. **Link rearrangement** — `rearrange_links_4_pre_tokenized_src__batch` for patterns like
    "Theorem _1_", "Übungsaufgabe _1_", "Kapitel _1_", "Lemma _1_", etc.
33. **Class assignment** — `append_class__batch` for `Index`, `Chapter`, `ChapterTitle`, `Sub`,
    `SubTitle`, `MathBlock`, `Highlight`, `Statement`, `Remark`, `Exercise`, `Carousel*`,
    `Group`, `NoWrap`, `TopicAnnouncement`, `SubtopicAnnouncement`
34. **Layout wrapping** — wraps `pre`/`ol`/`ul` inside `Chapter`/`Sub` in `div`; applies
    `main-column` class to block elements; wraps `figure`, `CarouselContainer`, `Group` in
    pseudowell/container divs; wraps Chapter/Sub children in `BodyWrapper`
35. **Author mode** (when `--local`) — `dl.ti2_turn_lines_into_3003_spans`,
    `dl.ti2_adorn_img_with_3003_spans`, `dl.ti2_adorn_with_3003_spans`,
    `dl.ti2_wrap_with_3003_spans` add source-linking tooltips
36. **`fold_contents_into_text("Math")`** — folds inline math back to text
37. **Final rename** — all semantic tags renamed to HTML: `Chapter`/`Sub`/`Index`/`MathBlock`/
    `ChapterTitle`/`SubTitle`/`Exercise`/`Statement`/`Highlight`/`Remark`/`Carousel*`/
    `Group`/`NoWrap`/`BodyWrapper`/`EndOfPageElt` → `div` or `h2`/`h3` as appropriate
38. **Attribute cleanup** — `delete_attribute__batch` removes `_`, `counter`, `title`,
    `number-chiron`, `original`
39. **Post-transformation tag validation** — `check_tags` against HTML-only approved list

### Document tags (pre-transformation, selection)
`Algorithm`, `Carousel`, `CarouselItem`, `Chapter`, `ChapterTitle`, `CircleX`, `Claim`,
`Definition`, `Demo`, `Document`, `Exercise`, `Example`, `Group`, `Highlight`, `Lemma`,
`MathBlock`, `Observation`, `Problem`, `Proof`, `QED`, `Quotation`, `Remark`, `Statement`,
`Sub`, `SubTitle`, `SubtopicAnnouncement`, `Theorem`, `TopicAnnouncement`, `WriterlyBlankLine`,
`WriterlyCodeBlock`, `WriterlyComment`, plus HTML tags `a`, `br`, `code`, `div`, `figure`,
`figcaption`, `hr`, `img`, `li`, `ol`, `pre`, `span`, `ul`

### HTML tags (post-transformation)
`Document`, `a`, `b`, `br`, `code`, `div`, `figure`, `figcaption`, `h1`, `h2`, `h3`, `header`,
`hr`, `i`, `img`, `li`, `nav`, `ol`, `p`, `pre`, `section`, `span`, `ul`

## Renderer (`src/renderer.gleam`)

`pub fn render(amendments, course_dir)` orchestrates the full wly→HTML pipeline:

1. Reads `<course_dir>/wly/__parent.wly` to extract document metadata (`title`, `banner`,
   `program`, `institution`, `language`, `lecturer`, `homepage`)
2. Passes `language` and `author_mode` into `pipeline.pipeline(...)`
3. Splits the VXML tree into fragments by structural type (`FragmentType`):
   - `Index` → `index.html`
   - `Chapter(n)` → `n-0.html`
   - `Sub(ch, sub)` → `ch-sub.html`
4. Emits each fragment via the appropriate emitter (`index_emitter`, `chapter_emitter`,
   `subchapter_emitter`) — each emits a full `<!DOCTYPE html>` page with `<head>` metadata
   (including Open Graph / Twitter Card social share tags), MathJax script, and `<body>`
5. Cleans up stale `.html` files from `public/` before writing new output
6. Output goes to `<course_dir>/public/`

`filename_shorthand_to_path_fragment` allows `--only 2.3` as shorthand for the path `02/03`.

### `DocumentInfo` — metadata extracted from `__parent.wly`

| Field | Attribute key |
|---|---|
| `title` | `title` |
| `banner` | `banner` |
| `program` | `program` |
| `institution` | `institution` |
| `language` | `language` |
| `lecturer` | `lecturer` |
| `homepage` | `homepage` |

## Formatter (`src/formatter_pipeline.gleam`, `src/formatter_renderer.gleam`)

The formatter is a **wly → wly** pass. It normalizes and rewraps Writerly source files in-place.

`formatter_pipeline.gleam` — defines `pub fn formatter_pipeline(line_length, indentation_penalty)`:
- Parses math blocks and inline math
- Rewraps text lines via `dl.line_rewrap_no2__outside` (respects `Chapter`/`Sub` indentation
  hierarchy; skips `MathBlock`, `pre`, `WriterlyCodeBlock`)
- Normalizes blank-line spacing between structural elements
- Unwraps `p` and `MathBlock` back to plain Writerly before writing

`formatter_renderer.gleam` — drives the formatter loop, reads from `<course_dir>/wly/`,
writes back to `<course_dir>/wly/`. Can target a single file with `-file`.

## Writerly Repo Location

The Writerly/desugaring library lives at `../wly/` (sibling to this repo). When adding or
modifying desugarers, check `../wly/desugaring/src/desugarer_library.gleam` for the full
`dl.*` API.
