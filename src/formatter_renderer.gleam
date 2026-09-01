import desugaring as ds
import desugaring/core as infra
import desugaring/writerly_defaults as wd
import formatter_pipeline.{formatter_pipeline}
import gleam/dict
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/string.{inspect as ins}
import on
import simplifile
import vxml.{type VXML, V}
import vxml/blame.{Src}

const default_line_length = 55

const default_indentation_penalty = 0

type FragmentType {
  Root
  Chapter
  Sub
  Unknown
}

type FragmentOf(z) =
  ds.OutputFragment(FragmentType, z)

fn fragment_bundler(
  vxml: VXML,
  classifier: FragmentType,
  input_dir_2_drop_from_blame_path_if_single_file: Option(String),
) -> FragmentOf(VXML) {
  let assert V(blame, _, _, _) = vxml
  let path = case blame {
    Src(_, path, _, _, _) -> path
    _ -> panic
  }
  let s = input_dir_2_drop_from_blame_path_if_single_file
  let path = case s {
    None -> path
    Some(name) -> {
      path |> infra.assert_drop_prefix("./" <> name <> "/")
    }
  }
  ds.OutputFragment(path: path, payload: vxml, classifier: classifier)
}

fn single_file_splitter(
  root: VXML,
  input_dir_name_only: String,
) -> Result(#(List(FragmentOf(VXML)), ds.Feedback), String) {
  Ok(#(
    [fragment_bundler(root, Unknown, Some(input_dir_name_only))],
    ds.NoFeedback,
  ))
}

fn whole_book_splitter(
  root: VXML,
) -> Result(#(List(FragmentOf(VXML)), ds.Feedback), String) {
  let #(root, chapters) =
    infra.v_extract_children(root, infra.is_v_and_tag_equals(_, "Chapter"))
  let root = fragment_bundler(root, Root, None)
  let #(chapters, subs) =
    chapters
    |> list.fold(#([], []), fn(acc, chapter) {
      let #(chapter, subs) =
        infra.v_extract_children(chapter, infra.is_v_and_tag_equals(_, "Sub"))
      let chapter = fragment_bundler(chapter, Chapter, None)
      let subs = list.map(subs, fragment_bundler(_, Sub, None))
      #([chapter, ..acc.0], list.append(acc.1, subs))
    })

  list.flatten([
    [root],
    chapters,
    subs,
  ])
  |> fn(fragments) { Ok(#(fragments, ds.NoFeedback)) }
}

fn extract_files(
  fmt_args: List(String),
) -> Result(#(List(String), List(String)), String) {
  case fmt_args {
    [] -> Ok(#([], []))
    ["-f" as first, ..rest] | ["-file" as first, ..rest] -> {
      case rest {
        [] -> Error("missing filename after '" <> first <> "'")
        [second, ..rest] -> {
          use #(ze_files, other_args) <- on.ok(extract_files(rest))
          Ok(#([second, ..ze_files], other_args))
        }
      }
    }
    [first, ..rest] -> {
      use #(ze_files, other_args) <- on.ok(extract_files(rest))
      Ok(#(ze_files, [first, ..other_args]))
    }
  }
}

fn extract_line_length_and_indentation_penalty(
  fmt_args: List(String),
) -> Result(#(Int, Int), String) {
  case fmt_args {
    [first, ..rest] ->
      case int.parse(first) {
        Ok(val) ->
          case rest {
            [] -> Ok(#(int.max(val, 40), default_indentation_penalty))
            [second, ..] ->
              case int.parse(second) {
                Ok(val2) ->
                  Ok(#(int.max(val, 40), int.min(int.max(val2, 0), 4)))
                Error(_) ->
                  Error(
                    "cannot parse '"
                    <> second
                    <> "' as an integer value for indentation penalty",
                  )
              }
          }
        Error(_) ->
          Error(
            "cannot parse '" <> first <> "' as an integer value for line length",
          )
      }
    _ -> Ok(#(default_line_length, default_indentation_penalty))
  }
}

pub fn render(
  arguments: ds.ParsedCLIArguments,
  course_dir: String,
) -> Result(Nil, String) {
  let assert Ok(fmt_args) = dict.get(arguments.user_args, "--fmt")

  use #(files, fmt_args) <- on.error_ok(extract_files(fmt_args), fn(msg) {
    Error(msg)
  })

  use #(line_length, indentation_penalty) <- on.error_ok(
    extract_line_length_and_indentation_penalty(fmt_args),
    fn(msg) { Error(msg) },
  )

  let pipeline = formatter_pipeline(line_length, indentation_penalty)

  let #(output_dir_local_path, arguments) = case arguments.output_dir {
    None -> #("wly", arguments)
    Some(x) -> #(x, ds.ParsedCLIArguments(..arguments, output_dir: None))
  }

  let assert None = arguments.input_dir
  let assert None = arguments.output_dir

  let parameters =
    ds.RendererParameters(
      input_dir: "./" <> course_dir <> "/wly/",
      output_dir: "./" <> course_dir <> "/" <> output_dir_local_path,
      prettifier_behavior: ds.PrettifierOff,
    )
    |> ds.amend_renderer_parameters_by_arguments(arguments)

  let input_dir = parameters.input_dir
  let input_dir_name_only = case input_dir {
    "./" <> x -> x |> infra.drop_suffix("/")
    "/" <> x -> x |> infra.drop_suffix("/")
    x -> x |> infra.drop_suffix("/")
  }

  let files =
    list.map(files, fn(f) {
      let f =
        f
        |> infra.drop_prefix(input_dir_name_only)
        |> infra.drop_prefix("./" <> input_dir_name_only)
      case input_dir_name_only {
        "" -> f |> infra.ensure_prefix("./")
        _ -> f |> infra.ensure_prefix("/")
      }
    })

  let options =
    ds.RendererOptions(..ds.vanilla_options(), verbose: True)
    |> ds.amend_renderer_options_by_arguments(arguments)

  let renderer =
    ds.Renderer(
      assembler: wd.default_writerly_assembler(_, options),
      parser: wd.default_writerly_parser,
      filterer: ds.default_filterer(_, options, []),
      pipeline: pipeline,
      splitter: case files {
        [] -> whole_book_splitter
        _ -> single_file_splitter(_, input_dir_name_only)
      },
      emitter: wd.default_writerly_emitter,
      writer: ds.default_writer,
      prettifier: ds.default_prettier_prettifier,
    )

  let _ = simplifile.delete(parameters.output_dir <> "/*")

  use _ <- on.ok(
    list.try_map(
      case files {
        [] -> [""]
        _ -> files
      },
      fn(f) {
        let parameters =
          ds.RendererParameters(
            ..parameters,
            input_dir: parameters.input_dir <> f,
          )
        case ds.run_renderer(renderer, parameters, options) {
          Error(error) -> Error(ins(error))
          _ -> Ok(Nil)
        }
      },
    ),
  )
  Ok(Nil)
}
