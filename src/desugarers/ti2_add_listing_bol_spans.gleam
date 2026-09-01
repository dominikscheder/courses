import gleam/list
import on
import vxml.{type Line, type VXML, Attr, T, V}
import vxml/blame as bl
import vxml_pipeline/authoring
import vxml_pipeline/core.{type Desugarer, type DesugarerTransform}
import vxml_pipeline/nodemaps_2_transform as n2t
import vxml_pipeline/testing

pub const name = "ti2_add_listing_bol_spans"

// 🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️
// 🏖️🏖️ Desugarer 🏖️🏖️
// 🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️️️️️🏖️

/// Adds a beginning-of-line span marker before every line
/// in `pre.listing` elements.
pub fn constructor() -> Desugarer {
  authoring.no_param_desugarer(
    name: name,
    transform: inner_param_to_transform(),
  )
}

const bol_span = V(
  bl.Des([], name, 25),
  // "functions can only be called within other functions..."
  "span",
  [Attr(bl.Des([], name, 28), "class", "listing-bol")],
  [],
)

const empty_line = T(bl.Des([], name, 32), [vxml.Line(bl.Des([], name, 32), "")])

const bol_span_with_texts = [
  empty_line,
  bol_span,
]

fn inner_param_to_transform() -> DesugarerTransform {
  let nodemap: n2t.OneToOneNoErrorNodemap = nodemap
  nodemap
  |> n2t.one_to_one_no_error_nodemap_2_desugarer_transform
}

fn nodemap(vxml: VXML) -> VXML {
  case vxml {
    V(_, "pre", attrs, children) -> {
      use <- on.eager_false_true(core.attrs_have_class(attrs, "listing"), vxml)
      let children =
        list.flat_map(children, fn(c) {
          case c {
            T(_, lines) ->
              {
                let text_nodes =
                  list.map(lines, fn(line) { [line_to_text_node(line)] })
                list.intersperse(text_nodes, bol_span_with_texts)
              }
              |> list.flatten
              |> core.plain_concatenation_in_list
              |> core.delete_singleton_empty_lines_in_list
            _ -> [c]
          }
        })
      V(..vxml, children: [bol_span, ..children])
    }
    _ -> vxml
  }
}

fn line_to_text_node(line: Line) -> VXML {
  T(line.blame, [line])
}

// 🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊
// 🌊🌊🌊 tests 🌊🌊🌊🌊
// 🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊

fn assertive_tests_data() -> List(testing.AssertiveTestDataNoParam) {
  [
    testing.data_no_param(
      source: "
                <> root
                  <> pre
                    class=listing
                    <>
                      'first line'
                      'second line'
                ",
      expected: "
                <> root
                  <> pre
                    class=listing
                    <> span
                      class=listing-bol
                    <>
                      'first line'
                      ''
                    <> span
                      class=listing-bol
                    <>
                      'second line'
                ",
    ),
    testing.data_no_param(
      source: "
                <> root
                  <> pre
                    class=listing
                    <>
                      'single line'
                ",
      expected: "
                <> root
                  <> pre
                    class=listing
                    <> span
                      class=listing-bol
                    <>
                      'single line'
                ",
    ),
    testing.data_no_param(
      source: "
                <> root
                  <> pre
                    class=other
                    <>
                      'should not change'
                ",
      expected: "
                <> root
                  <> pre
                    class=other
                    <>
                      'should not change'
                ",
    ),
  ]
}

pub fn assertive_tests() {
  testing.collection_no_param(name, assertive_tests_data(), constructor)
}
