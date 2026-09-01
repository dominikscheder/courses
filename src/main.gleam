import argv
import desugaring as ds
import desugaring/core as infra
import formatter_renderer
import gleam/dict
import gleam/io
import gleam/list
import gleam/option
import gleam/result
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

fn handle_fmt_request(
  arguments: ds.ParsedCLIArguments,
  course_dir: String,
) -> Result(Bool, ds.CLIError) {
  case dict.has_key(arguments.user_args, "--fmt") {
    False -> Ok(False)
    True -> {
      io.println("wly -> wly formatter")
      use _ <- on.ok(
        formatter_renderer.render(arguments, course_dir)
        |> result.map_error(ds.ClientSideError),
      )
      Ok(True)
    }
  }
}

pub fn main() {
  io.println("")

  let args =
    argv.load().arguments
    |> list.map(fn(x) {
      case x {
        "only" -> "--only"
        "which" -> "--which"
        _ -> x
      }
    })

  use args <- on.error_ok(ds.read_from_dot_last_command(args), handle_cli_error)

  use arguments <- on.error_ok(
    ds.process_command_line_arguments(args, [
      "--fmt",
      "--local",
      "--which",
      "--offline-mathjax",
    ]),
    handle_cli_error,
  )

  use help_requested <- on.error_ok(
    ds.handle_help_requests(arguments, local_cli_usage),
    handle_cli_error,
  )

  use maintenance_requested <- on.error_ok(
    ds.handle_maintenance_requests(arguments, local_desugarers.assertive_tests),
    handle_cli_error,
  )

  use _ <- on.stay(case maintenance_requested || help_requested {
    True -> on.Return(Nil)
    False -> on.Stay(Nil)
  })

  use course_dir <- on.stay(case dict.get(arguments.user_args, "--which") {
    Ok([name]) -> {
      let name = name |> infra.drop_ending_slash |> infra.drop_prefix("./")
      case simplifile.is_directory(name <> "/wly") {
        Ok(True) -> on.Stay(name)
        _ -> {
          io.println(
            "expecting '"
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
            "unrecognized command line arguments after course directory '"
            <> name
            <> "': "
            <> unexpected
            <> "; crashing out\n",
          )
          on.Return(Nil)
        }
        _ -> {
          io.println(
            "expecting first argument after '--which', '"
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
        "option '--which' requires one course directory argument (without spaces); crashing out\n",
      )
      on.Return(Nil)
    }

    Error(_) -> {
      io.println(
        "use '--which' option to specify a course directory pls (without spaces); crashing out\n",
      )
      on.Return(Nil)
    }
  })

  use _ <- on.stay(case arguments.input_dir {
    option.Some(_) -> {
      io.println(
        "unexpected --input-dir argument; use '--which' to specify a local project directory; crashing out\n",
      )
      on.Return(Nil)
    }
    _ -> on.Stay(Nil)
  })

  use formatting_requested <- on.error_ok(
    handle_fmt_request(arguments, course_dir),
    handle_cli_error,
  )

  use _ <- on.stay(case formatting_requested {
    True -> on.Return(Nil)
    False -> on.Stay(Nil)
  })

  use _ <- on.error_ok(ds.write_to_dot_last_command(args), handle_cli_error)

  io.println("wly -> html renderer")
  renderer.render(arguments, course_dir)
}

fn handle_cli_error(error: ds.CLIError) -> Nil {
  io.println("command line error: " <> ds.cli_error_message(error))
  io.println("")
}
