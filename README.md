# Installation

## 1. [Install Gleam](https://gleam.run/getting-started/installing)

## 2. (Or:) Upgrade/Update Gleam

Run:

```shell
brew upgrade gleam
```

once for the whole machine, and then

```shell
gleam update
gleam clean
gleam build
```

inside of `vistuleB/wly/desugaring/` [note the `DESUGARING/` part of the path!] as 
well as inside of `dominikscheder/courses` or `vistuleB/ti2_html`,
depending on where you're working. (See next.)

## 3. Clone repos

Git clone `github.com/vistuleB/wly` and this repo.

_SSH_

```
git clone git@github.com:vistuleB/wly.git
git clone git@github.com:dominikscheder/courses.git
```

Possibly also `github.com/vistuleB/ti2_html` for HTML ingestion:

```
git clone git@github.com:vistuleB/ti2_html.git
```

Create a folder named `github.com` in your home directory
and copy this directory structure
for the location of the various repos:

```
github.com/vistuleB/wly
github.com/vistuleB/ti2_html            // (if desired)
github.com/dominikscheder/courses
```

## 4. 'wly' test

1. `cd vistuleB/wly/desugaring`
2. `gleam clean`, `gleam build`
2. `gleam run -m desugarers`

Various output should come out like this:

<img src="writerly-desugaring-m-terminal-output.png" width="400">

## 5. Plain HTML test

1. goto `dominikscheder/courses` folder
2. `gleam run -- --which course1 --verbose`

Various messages from the desugaring engine (situated in `wly` repo) should print out and the `public/` folder should have its .html repopulated.

To check, open `course1/public/index.html` inside a browser.

## 6. localhost test

1. `npm install`
2. `COURSE=course1 npm run dev`
3. clicking on the localhost link should take you to your default browser

## 7. VSCode 'Writerly' extension

Author source is contained in `dominikscheder/courses/course1/wly/` and `dominikscheder/courses/course2/wly` folders.

In VSCode, download the [Writerly](https://marketplace.visualstudio.com/items?itemName=TabbyNotes.writerly-vscode-extension) extension for syntax highlighting.

## 8. Go-to-source tooltips (`--local` mode)

1. Run the local server (see "localhost test")
2. `gleam run -- --which course1 --local`

Note: Go-to-source tooltips will only work if `code` has been bound to open the default code editor (e.g., VSCode) in the terminal.

⚠️ Do not forget to an ordinary `gleam run` before publishing the `public/` folder again—you don't want to publish the go-to-source tooltips!

## 8. Source Formatter

Run `gleam run -- --fmt` for default 55 to reformat at char per line formatting or `gleam run -- --fmt <X>` to format line length to X chars per line.

## 9. VSCode Settings

Without getting into the details, do this inside the
project's home directory:

```sh
mkdir .vscode
cp sample_tasks_dot_json.json .vscode/tasks.json
cp sample_settings_dot_json.json .vscode/settings.json
```

After doing this, running `Cmd + Shift + B` from inside
VSCode will run the same exact `gleam run` command that
last run in the terminal (same arguments). Try it!

## 10. Non-Manual File Renaming

Type `Cmd + R` when the cursor is on a filename to rename it inside
all your files and on the filesystem at once. (It works!)

## 11. Non-Manual File Moving

Type `Cmd + R` when the cursor is on the directory part of a filepath
to move that file to a different existing directory. This will move
the file on disk and all .wly references.

## 12. Offline MathJax

Use the `--offline-mathjax` flag to use the local copy of MathJax installed inside the repo.

WARNING: Don't publish an `--offline-mathjax` build. It will break the page the for readers!

## 13. Adding a file shared by several courses

As an example, say we would like to share `mathjax_setup.js` between `course1`
and `course2`. We would follow these steps:

1. `cd` into project root
2. put desired `mathjax_setup.js` in `shared/`
3. `ln -s shared/mathjax_setup.js course1/public/mathjax_setup.js`
4. `ln -s shared/mathjax_setup.js course2/public/mathjax_setup.js`

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
4. replace contents of `public/pages/` with desired .html files to parse
5. `rm -rf wly_content/*` (get rid of old TI-2 .wly output) inside `ti2_html` directory
6. `gleam run -- --parse-html public/pages` & then work through errors (it will crash as soon as it finds an unmatched tag e.g., you have to fix unmatched tags manually; it might be picky about the .html structure in some other ways; if the same pattern is repeatedly causing a crash then one can augment the function named `bad_html_pre_processor` found in `github.com/vistuleB/wly/vxml/vxml.gleam` to pre-process that pattern away)
