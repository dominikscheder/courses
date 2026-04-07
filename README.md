# Installation

## 1. [Gleam Install](https://gleam.run/getting-started/installing)

## 2. Clone repos

Git clone `github.com/vistuleB/wly` and this repo.

_SSH_

```
git clone git@github.com:vistuleB/wly.git
git clone git@github.com:dominikscheder/courses.git
```

Copy the Github folder structure: put one repo in a folder `vistuleB/wly` and the other in a folder `dominikscheder/TI-2`, with `vistuleB/` and `dominikscheder/` as siblings inside the same parent folder.

## 3. 'wly' test

1. `cd vistuleB/wly/desugaring`
2. `gleam run -m desugarers`

Various output should come out like this:

![wly/desugaring gleam run -m desugarers terminal output](writerly-desugaring-m-terminal-output.png)

## 4. "raw HTML" test

1. goto `dominikscheder/TI-2` folder
2. `gleam run` or `gleam run --verbose`

Various messages from the desugaring engine (situated in `wly` repo) should print out and the `public/` folder should have its .html repopulated.

To check, open `public/index.html` inside a browser.

## 5. localhost test

1. `npm install`
2. `npm run dev`
3. try `http://localhost:3003/` in the browser

## 6. Source location

Author source is contained in `wly/` folder.

In VSCode, download the [Writerly](https://marketplace.visualstudio.com/items?itemName=TabbyNotes.writerly-vscode-extension) extension for syntax highlighting.

## 7. Go-to-source tooltips (`--local` mode)

1. Run the local server (see "localhost test")
2. `gleam run -- --local`

Note: Go-to-source tooltips will only work if `code` has been bound to open the default code editor (e.g., VSCode) in the terminal.

⚠️ Do not forget to an ordinary `gleam run` before publishing the `public/` folder again—you don't want to publish the go-to-source tooltips!

## 8. Source Formatter

Run `gleam run -- --fmt` for default 55 to reformat at char per line formatting or `gleam run -- --fmt <X>` to format line length to X chars per line.

## 9. Add a shared asset to a course

As an example, say we would like to add `mathjax_setup.js` to course `course1`. We would follow these steps

1. `cd` into project root
2. `ln -s ../../shared/mathjax_setup.js course1/public/mathjax_setup.js`

## 10. Option for offline MathJax

Use the `--offline-mathjax` flag to use the local copy of MathJax installed inside the repo.

WARNING: Don't publish an `--offline-mathjax` build. It will break the page the for readers!

# Cheat Sheet

Local server-related:

```
npm install            // to install node stuff needed to run local server
COURSE=<dirname> npm run dev                   // run local server that is needed to respond for '--local' mode, serving <dirname>/public folder
COURSE=<dirname> PORT=<xxxx> npm run dev       // ...same but serving on custom port number
lsof -i tcp:3003       // find process number (PID) of process listening to port 3003 (if and when the need to kill a localserver arises)
```

Main project commands:

```
gleam run              // main command
gleam run -- --local   // source with tooltips
gleam run -- --fmt <x> // re-formats the source at x chars per line
gleam run -- --help    // more options
```

Git cheat sheet:

```
git stash              // get rid of uncommitted local changes, but keep them in a 'stash' somewhere
git stash pop          // get the stashed changes back!
git add .              // stage all current changes
git commit -m "..."    // commit staged changes
git push               // push latest local commit(s) to remote
git pull               // get latest commits from remote (if anything)
git pull --rebase      // when a conflict arises during push or pull, try this; in worst case...
                       // ..."resolve in merge editor" inside of VSCode; after resolving, push again
```

# Known issues

1. The `--local` mode has some CSSlayout artifacts to do with showing the tooltips. DO NOT FREAK OUT if a layout bug occurs in `--local` mode. Double-check if the same artifact occurs without `--local`.

2. Italics prevent line breaks if they end right before a punctuation mark. To fix this issue, write `this is _a sample long italic phrase that ends with a period._` instead of `this is _a sample long italic phrase that ends with a period_.`.

# Html -> WLY ingestion

Steps: 

1. `cd ~/github.com/vistuleB`
2. `git clone git@github.com:vistuleB/ti2_html.git`
3. `cd ti2_html`
4. replace contents of `./public/pages` with the TI-1 `.html` source files (it currently contains TI-2 source files)
5. `rm -rf wly_content/*` (get rid of old TI-2 .wly output) inside `ti2_html` directory
6. `gleam run -- --parse-html public/pages` & then work through errors (it will crash as soon as it finds an unmatched tag e.g., you have to fix unmatched tags manually; it might be picky about the .html structure in some other ways; if the same pattern is repeatedly causing a crash then one can augment the function named `bad_html_pre_processor` found in `github.com/vistuleB/wly/vxml/vxml.gleam` to pre-process that pattern away)
