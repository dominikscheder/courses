import gleam/list
import gleam/string
import local_desugarers as local_dl
import pipeline
import vxml.{type VXML, T, V}
import vxml_pipeline as ds
import vxml_pipeline/core.{type Desugarer, type Pipeline}
import vxml_pipeline/delimiter_pipelines as syntax

fn apply_pipeline(vxml: VXML, pipeline: Pipeline) -> VXML {
  list.fold(pipeline, vxml, fn(vxml, desugarer: Desugarer) {
    let assert Ok(#(vxml, _warnings)) = desugarer.transform(vxml)
    vxml
  })
}

fn contains_annotated_span(vxml: VXML) -> Bool {
  case vxml {
    V(_, "span", attrs, children) ->
      case
        core.attrs_have_class(attrs, "manual-color")
        && core.descendant_text_contains(vxml, "marked")
      {
        True -> True
        False -> list.any(children, contains_annotated_span)
      }
    V(_, _, _, children) -> list.any(children, contains_annotated_span)
    _ -> False
  }
}

fn assert_annotation_survives(source: String, colorer: Desugarer) {
  let assert Ok([vxml]) = vxml.string_to_vxmls(source, "integration test")
  let pipeline = [
    colorer,
    ..syntax.annotated_backtick_pipeline(
      "span",
      "class",
      ["WriterlyBlankLine"],
      [
        "MathBlock",
        "Math",
      ],
    )
  ]
  let output = apply_pipeline(vxml, pipeline)
  assert contains_annotated_span(output)
}

pub fn dominik_prompt_response_preserves_annotations_test() {
  assert_annotation_survives(
    "<> pre
  language=dominik-prompt-response
  <>
    '$ echo `marked`{manual-color}'",
    local_dl.ti2_dominik_prompt_response(),
  )
}

pub fn python_prompt_preserves_annotations_test() {
  assert_annotation_survives(
    "<> pre
  language=python-prompt
  <>
    '>>> print(`marked`{manual-color})'",
    local_dl.ti2_parse_python_prompt_pre(),
  )
}

pub fn arbitrary_prompt_response_preserves_annotations_test() {
  assert_annotation_survives(
    "<> pre
  language=arbitrary-prompt-response
  <>
    'Result: <- `marked`{manual-color}'",
    local_dl.ti2_parse_arbitrary_prompt_response_pre(),
  )
}

pub fn orange_comments_preserves_annotations_test() {
  assert_annotation_survives(
    "<> pre
  language=orange-comments
  <>
    'value // `marked`{manual-color}'",
    local_dl.ti2_parse_orange_comments_pre(),
  )
}

pub fn xml_preserves_annotations_test() {
  assert_annotation_survives(
    "<> pre
  language=xml
  <>
    '<p>`marked`{manual-color}</p>'",
    local_dl.ti2_parse_xml_pre(),
  )
}

pub fn redyellow_preserves_annotations_test() {
  assert_annotation_survives(
    "<> pre
  language=redyellow
  <>
    '`marked`{manual-color}'",
    local_dl.ti2_parse_redyellow_pre(),
  )
}

pub fn listing_bol_spans_preserve_annotations_test() {
  assert_annotation_survives(
    "<> pre
  class=listing
  <>
    'first line'
    '`marked`{manual-color}'",
    local_dl.ti2_add_listing_bol_spans(),
  )
}

pub fn main() {
  dominik_prompt_response_pipeline_preserves_whitespace_test()
  dominik_prompt_response_preserves_annotations_test()
  python_prompt_preserves_annotations_test()
  arbitrary_prompt_response_preserves_annotations_test()
  orange_comments_preserves_annotations_test()
  xml_preserves_annotations_test()
  redyellow_preserves_annotations_test()
  listing_bol_spans_preserve_annotations_test()
}

fn rendered_text(node: VXML) -> String {
  case node {
    T(_, lines) ->
      lines |> list.map(fn(line) { line.content }) |> string.join("\n")
    V(_, _, _, children) -> children |> list.map(rendered_text) |> string.concat
  }
}

pub fn dominik_prompt_response_pipeline_preserves_whitespace_test() {
  let assert Ok(input) =
    vxml.string_to_vxml(
      "<> pre
  language=dominik-prompt-response
  <>
    '$ ls'
    'IMG-1.jpg'
    'IMG-2.jpg'
    'index.html'
    '$ pwd'
    '/home/user/images'",
      "terminal regression",
    )
  let steps =
    pipeline.pipeline(
      ds.RendererParameters(
        input_dir: "course-TI-2/wly",
        output_dir: "course-TI-2/public",
        prettifier_behavior: ds.PrettifierOff,
      ),
      False,
      "de",
    )
  let prefix =
    steps
    |> list.take_while(fn(step) { step.name != "ti2_dominik_prompt_response" })
    |> list.reverse
    |> list.take_while(fn(step) {
      step.name != "sigil_counters_substitute__outside"
    })
    |> list.reverse
  let output =
    apply_pipeline(
      input,
      list.append(prefix, [local_dl.ti2_dominik_prompt_response()]),
    )
  assert rendered_text(output)
    == "$ ls\nIMG-1.jpg\nIMG-2.jpg\nindex.html\n$ pwd\n/home/user/images"
  let assert V(_, "pre", attrs, _) = output
  assert core.attrs_have_class(attrs, "dominik-prompt-response")
}
