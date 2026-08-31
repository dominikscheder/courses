import argv
import desugaring as ds
import desugaring/core as infra
import formatter_renderer
import gleam/dict
import gleam/io
import gleam/list
import gleam/option
import gleam/string
import local_desugarers
import on
import renderer
import simplifile

const ins = string.inspect

fn local_cli_usage() -> String {
  let margin = string.repeat(" ", ds.help_message_margin)
  [
    margin <> "--fmt [<cols>] [<cols> <penalty>] [-file <name>]",
    margin <> "  -> (local option) run the formatter",
    "",
    margin <> "     optional arguments:",
    "",
    margin <> "     • <cols>: preferred line length",
    margin <> "     • <cols> <penalty>: preferred line",
    margin <> "       length and indentation penalty (number",
    margin <> "       of chars subtracted from line length at",
    margin <> "       each added level of indentation in the file)",
    margin <> "     • -file <name>: format only the given file",
    "",
    margin <> "--local",
    margin <> "  -> include source-linking tooltips",
    margin <> "     server !)",
    "",
    margin <> "--offline-mathjax",
    margin <> "  -> use local mathjax library instead of CDN url",
    "",
    margin <> "--last-command",
    margin <> "  -> run the same arguments as the previous command (from local",
    margin <> "     .last-command file)",
    "",
    margin <> "--renumber",
    margin <> "  -> renumber blame lines in local desugarers",
    "",
    margin <> "--generate / --regenerate",
    margin <> "  -> regenerate src/local_desugarers.gleam",
    "",
    margin <> "--desugarers",
    margin <> "  -> renumber, regenerate, and test local desugarers",
    "",
    margin <> "--desugarer-tests / --test-desugarers [<name> ...]",
    margin <> "  -> test all or selected local desugarers",
    "",
    "...and don't forget to include '--which <course dir>' in",
    "order to specify which course you want to compile/run!",
    "",
    "                             ***",
    "",
    "Local server usage: use 'COURSE=<course dir> npm run dev' to",
    "serve book on localhost:3003, or prefix 'PORT=xxxx' argument",
    "to serve on specific port! Enjoy!",
    "",
  ]
  |> string.join("\n")
}

fn contains_maintenance_request(args: List(String)) -> Bool {
  list.any(args, fn(arg) {
    list.contains(
      [
        "--renumber",
        "--generate",
        "--regenerate",
        "--desugarers",
        "--desugarer-tests",
        "--test-desugarers",
      ],
      arg,
    )
  })
}

pub fn main() {
  let args =
    argv.load().arguments
    |> list.map(fn(x) {
      case x {
        "only" -> "--only"
        "which" -> "--which"
        _ -> x
      }
    })

  let #(args, use_last_command) = case list.contains(args, "--last-command") {
    True -> {
      let args = list.filter(args, fn(s) { s != "--last-command" })
      #(args, True)
    }
    False -> #(args, False)
  }

  assert !list.contains(args, "--last-command")

  let args = case use_last_command {
    True ->
      case simplifile.read(".last-command") {
        Ok(contents) -> {
          string.split(contents, " ")
          |> list.map(string.trim)
          |> list.filter(fn(s) { !string.is_empty(s) })
          |> list.append(args)
        }
        Error(_) -> panic as "unable to find '.last-command'"
      }
    False -> args
  }

  let #(args, help_requested) = ds.handle_help_requests(args, local_cli_usage)

  case contains_maintenance_request(args) {
    True -> io.println("")
    False -> Nil
  }

  use #(args, maintenance_requested) <- on.error_ok(
    ds.handle_maintenance_requests(args, local_desugarers.assertive_tests),
    fn(error) {
      io.println("maintenance error: " <> error)
      io.println("")
    },
  )
  use _ <- on.stay(case maintenance_requested || help_requested {
    True -> on.Return(Nil)
    False -> on.Stay(Nil)
  })

  let args_string = string.join(args, " ")

  use amendments <- on.stay(
    case
      ds.process_command_line_arguments(args, [
        "--fmt",
        "--local",
        "--which",
        "--offline-mathjax",
      ])
    {
      Error(error) -> {
        io.println("")
        io.println("command line error: " <> ins(error))
        ds.basic_cli_usage("\ncommand line usage:")
        local_cli_usage() |> io.print
        on.Return(Nil)
      }

      Ok(amendments) -> {
        on.Stay(amendments)
      }
    },
  )

  use course_dir <- on.stay(case dict.get(amendments.user_args, "--which") {
    Ok([name]) -> {
      let name = name |> infra.drop_ending_slash |> infra.drop_prefix("./")
      case simplifile.is_directory(name <> "/wly") {
        Ok(True) -> on.Stay(name)
        _ -> {
          io.println(
            "\nexpecting '"
            <> name
            <> "' to be a local directory with subdirectory 'wly'; crashing out\n",
          )
          on.Return(Nil)
        }
      }
    }
    Ok([name, ..unexpected]) -> {
      let name = name |> infra.drop_ending_slash |> infra.drop_prefix("./")
      let unexpected = unexpected |> list.map(ins) |> string.join(" ")
      case simplifile.is_directory(name <> "/wly") {
        Ok(True) -> {
          io.println(
            "\nunrecognized command line arguments after course directory '"
            <> name
            <> "': "
            <> unexpected
            <> "; crashing out\n",
          )
          on.Return(Nil)
        }
        _ -> {
          io.println(
            "\nexpecting first argument after '--which', '"
            <> name
            <> "', to be a local directory with subdirectory 'wly'; "
            <> "additional arguments were also supplied: "
            <> unexpected
            <> "; crashing out\n",
          )
          on.Return(Nil)
        }
      }
    }
    Ok([]) -> {
      io.println(
        "\noption '--which' requires one course directory argument (without spaces); crashing out\n",
      )
      on.Return(Nil)
    }
    Error(_) -> {
      io.println(
        "\nuse '--which' option to specify a course directory pls (without spaces); crashing out\n",
      )
      on.Return(Nil)
    }
  })

  use _ <- on.stay(case amendments.input_dir {
    option.Some(_) -> {
      io.println(
        "\nunexpected --input-dir argument; use '--which' to specify a local project directory; crashing out\n",
      )
      on.Return(Nil)
    }
    _ -> on.Stay(Nil)
  })

  case dict.get(amendments.user_args, "--fmt") {
    Ok(_) -> {
      io.println("")
      io.println("wly -> wly formatter")
      formatter_renderer.render(amendments, course_dir)
    }

    Error(_) -> {
      io.println("")
      io.println("wly -> html renderer")
      renderer.render(amendments, course_dir)
      io.println("")
    }
  }

  case simplifile.write(".last-command", args_string) {
    Ok(_) -> Nil
    _ -> io.println("Warning: unable to write args_string to .last-command")
  }
}
