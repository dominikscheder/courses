import blame as bl
import desugarer_library as dl
import desugaring as ds
import gleam/list
import gleam/string
import group_replacement_splitting as grs
import infrastructure.{type Pipe} as infra
import prefabricated_pipelines as pp
import vxml

const our_blame = bl.Des([], "pipeline", 9)

const p_cannot_contain = [
  "Carousel",
  "CarouselContainer",
  "CarouselItem",
  "CarouselItems",
  "CentralDisplay",
  "CentralDisplayItalic",
  "Chapter",
  "ChapterTitle",
  "Example",
  "Exercise",
  "Grid",
  "Group",
  "Highlight",
  "HorizontalMenu",
  "Index",
  "List",
  "MathBlock",
  "Menu",
  "Observation",
  "Proof",
  "Remark",
  "Statement",
  "Sub",
  "SubTitle",
  "SubtopicAnnouncement",
  "TopicAnnouncement",
  "WriterlyBlankLine",
  "br",
  "center",
  "colgroup",
  "figure",
  "div",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "ul",
]

const p_cannot_be_contained_in = [
  "Carousel",
  "CarouselContainer",
  "CarouselItems",
  "CarouselItem",
  "HorizontalMenu",
  "Index",
  "Math",
  "MathBlock",
  "Menu",
  "NoWrap",
  "QED",
  "TopicAnnouncement",
  "SubtopicAnnouncement",
  "code",
  "figure",
  "p",
  "pre",
  "span",
]

const post_counter_space = " "

pub fn pipeline(parameters: ds.RendererParameters, author_mode: Bool) -> List(Pipe) {
  let escaped_dollar_to_span_rr_splitter =
    grs.rr_splitter_for_groups([
      #("\\\\", grs.Trash),
      #("\\$", grs.TagWithTextChild("span")),
    ])

  let pre_transformation_document_tags = [
    "Algorithm",
    "Carousel",
    "CarouselItem",
    "Chapter",
    "ChapterTitle",
    "CircleX",
    "Claim",
    "Definition",
    "Demo",
    "Document",
    "Exercise",
    "Example",
    "Group",
    "Highlight",
    "Lemma",
    "MathBlock",
    "Observation",
    "Problem",
    "Proof",
    "QED",
    "Remark",
    "Statement",
    "Sub",
    "SubTitle",
    "SubtopicAnnouncement",
    "Theorem",
    "TopicAnnouncement",
    "WriterlyBlankLine",
    "WriterlyCodeBlock",
    "WriterlyComment",
  ]

  let pre_transformation_html_tags = [
    "div",
    "a",
    "pre",
    "span",
    "br",
    "hr",
    "img",
    "figure",
    "figcaption",
    "ol",
    "ul",
    "li",
  ]
  let pre_transformation_approved_tags =
    [pre_transformation_document_tags, pre_transformation_html_tags]
    |> list.flatten

  let post_transformation_document_tags = ["Document"]
  let post_transformation_html_tags =
    pre_transformation_html_tags
    |> list.append([
      "header",
      "nav",
      "section",
      "h1",
      "h2",
      "h3",
      "p",
      "b",
      "i",
      "code",
    ])
  let post_transformation_approved_tags =
    [post_transformation_document_tags, post_transformation_html_tags]
    |> list.flatten

  let main_column_elements = [
    "p",
    "div",
    "TopicAnnouncement",
    "SubtopicAnnouncement",
    "MathBlock",
  ]

  let qed = [
    vxml.V(
      our_blame,
      "span",
      [vxml.Attr(our_blame, "style", "color:#0000;visibility:none;")],
      [vxml.T(our_blame, [vxml.Line(our_blame, "A")])],
    ),
    vxml.V(our_blame, "span", [vxml.Attr(our_blame, "class", "qed")], [
      vxml.T(our_blame, [vxml.Line(our_blame, "\\(\\square\\)")]),
    ]),
  ]

  let assert Ok(pseudowell) = infra.expand_selector_shorthand("div.pseudowell")
  let assert Ok(figure__container) =
    infra.expand_selector_shorthand("div.figure__container")
  let assert Ok(group__container) =
    infra.expand_selector_shorthand("div.group__container")
  let assert Ok(end_of_page_element) =
    infra.expand_selector_shorthand("EndOfPageElt#end-of-page-elt")
  let assert Ok(body_wrapper) =
    infra.expand_selector_shorthand("BodyWrapper#body-wrapper")
  let assert Ok(group_scaler) =
    infra.expand_selector_shorthand("div.group_scaler")
  let assert Ok(group_placeholder) =
    infra.expand_selector_shorthand("div.group_placeholder")

  // ****************************************************
  // * use 'dl.table_marker()' desugarer to mark a line *
  // * in the table; (with '--table' printout)          *
  // ****************************************************

  [
    [
      dl.check_tags(#(pre_transformation_approved_tags, "pre-transformation")),
      dl.delete("WriterlyComment"),
      dl.delete_attribute_if(fn(key, _) { string.starts_with(key, "!!") }),
      dl.rename(#("WriterlyCodeBlock", "pre")),
      dl.append(#("Proof", "QED", infra.Continue)),
      dl.rename_with_attributes__batch([
        #("Theorem", "Statement", [#("title", "*Theorem*")]),
        #("Definition", "Statement", [#("title", "*Definition*")]),
        #("Observation", "Statement", [#("title", "*Beobachtung*")]),
        #("Example", "Statement", [#("title", "*Beispiel*")]),
        #("Lemma", "Statement", [#("title", "*Lemma*")]),
        #("Claim", "Statement", [#("title", "*Behauptung*")]),
        #("Problem", "Statement", [#("title", "*Problem*")]),
        #("Algorithm", "Statement", [#("title", "*Algorithmus*")]),
        #("Demo", "Statement", [#("title", "*Demo*")]),
        #("Proof", "Highlight", [#("title", "*Beweis.*")]),
      ]),
      dl.ti2_add_should_be_numbers(),
      dl.ti2_backfill(),
      dl.append_attribute__batch([
        #("Document", "counter", "ChapterCounter"),
        #("Chapter", "counter", "SubCounter"),
        #("Chapter", "counter", "ExerciseCounter"),
        #("Chapter", "counter", "StatementCounter"),
        #("Sub", "counter", "ExerciseCounter"),
        #("Sub", "counter", "StatementCounter"),
      ]),
      dl.prepend_attribute(#(
        "Chapter",
        "path",
        "./::øøChapterCounter-0.html",
        infra.GoBack,
      )),
      dl.prepend_attribute(#(
        "Sub",
        "path",
        "./::øøChapterCounter-::øøSubCounter.html",
        infra.GoBack,
      )),
      dl.prepend_counter_incrementing_attribute(#(
        "Chapter",
        "ChapterCounter",
        infra.GoBack,
      )),
      dl.prepend_counter_incrementing_attribute(#(
        "Sub",
        "SubCounter",
        infra.GoBack,
      )),
      dl.prepend_counter_incrementing_attribute(#(
        "Exercise",
        "ExerciseCounter",
        infra.Continue,
      )),
      dl.prepend_counter_incrementing_attribute(#(
        "Statement",
        "StatementCounter",
        infra.Continue,
      )),
      dl.set_handle_value(#(
        "Chapter",
        "::øøChapterCounter",
        infra.GoBack,
      )),
      dl.set_handle_value(#(
        "Sub",
        "::øøChapterCounter.::øøSubCounter",
        infra.GoBack,
      )),
      dl.set_handle_value_if_has_ancestor_else(#(
        "Statement",
        "Sub",
        "::øøChapterCounter.::øøSubCounter.::øøStatementCounter",
        "::øøChapterCounter.::øøStatementCounter",
      )),
      dl.set_handle_value_if_has_ancestor_else(#(
        "Exercise",
        "Sub",
        "::øøChapterCounter.::øøSubCounter.::øøExerciseCounter",
        "::øøChapterCounter.::øøExerciseCounter",
      )),
      dl.set_handle_value_if_has_ancestor_else(#(
        "Topic",
        "Sub",
        "::øøChapterCounter.::øøSubCounter",
        "::øøChapterCounter",
      )),
      dl.auto_generate_child_if_missing_from_attribute(#(
        "Chapter",
        "ChapterTitle",
        "title",
      )),
      dl.auto_generate_child_if_missing_from_attribute(#(
        "Sub",
        "SubTitle",
        "title",
      )),
      dl.prepend_attribute(#(
        "ChapterTitle",
        "number-chiron",
        "::øøChapterCounter.",
        infra.GoBack,
      )),
      dl.prepend_attribute(#(
        "SubTitle",
        "number-chiron",
        "::øøChapterCounter.::øøSubCounter",
        infra.GoBack,
      )),
      dl.prepend_text_node_if_has_ancestor_else__batch([
        #(
          "Exercise",
          "Sub",
          "*Übungsaufgabe ::øøChapterCounter.::øøSubCounter.::øøExerciseCounter*"
            <> post_counter_space,
          "*Übungsaufgabe ::øøChapterCounter.::øøExerciseCounter*"
            <> post_counter_space,
        ),
        #(
          "Statement",
          "Sub",
          " *::øøChapterCounter.::øøSubCounter.::øøStatementCounter*"
            <> post_counter_space,
          " *::øøChapterCounter.::øøStatementCounter*" <> post_counter_space,
        ),
      ]),
      dl.insert_attribute_as_text(#("Statement", "title")),
      dl.prepend_attribute_as_text(#("Highlight", "title")),
      dl.prepend_attribute_as_text(#("Remark", "title")),
      dl.substitute_counters(),
    ],
    pp.create_mathblock_elements(
      [infra.DoubleDollar, infra.BeginEndAlign, infra.BeginEndAlignStar],
      infra.DoubleDollar,
    ),
    pp.create_math_elements(
      [infra.BackslashParenthesis, infra.SingleDollar],
      infra.SingleDollar,
      infra.BackslashParenthesis,
    ),
    [
      dl.regex_split_and_replace__outside(escaped_dollar_to_span_rr_splitter, [
        "Math",
        "MathBlock",
      ]),
      dl.group_consecutive_children__outside(
        #("p", p_cannot_contain),
        p_cannot_be_contained_in,
      ),
      dl.unwrap("WriterlyBlankLine"),
      dl.trim("p"),
      dl.delete_if_empty("p"),
      dl.expand_info_attribute(["pre"]),
      dl.ti2_process_pre_listing_classname(),
      dl.ti2_parse_python_prompt_pre(),
      dl.ti2_parse_orange_comments_pre(),
      dl.ti2_parse_arbitrary_prompt_response_pre(),
      dl.ti2_parse_redyellow_pre(),
      dl.ti2_parse_xml_pre(),
      dl.ti2_add_listing_bol_spans(),
      dl.ti2_create_index(),
      dl.ti2_add_prev_next_chapter_title_elements(),
      dl.insert_custom_before_first(#(
        "Chapter",
        end_of_page_element,
        "Sub",
        infra.GoBack,
      )),
      dl.append_custom(#("Sub", end_of_page_element, infra.GoBack)),
      dl.append_custom(#("Index", end_of_page_element, infra.GoBack)),
      dl.table_marker(),
      dl.ti2_create_menu(),
      dl.delete__batch(["PrevChapterOrSubTitle", "NextChapterOrSubTitle"]),
      dl.wrap_and_custom_steal(
        #(
          "Carousel",
          "CarouselContainer",
          infra.is_v_and_has_class(_, "topcaption"),
          infra.is_v_and_tag_equals(_, "figcaption"),
        ),
      ),
      dl.ti2_expand_carousels(),
      dl.ti2_cut_paste_width_height_to_descendant_img(["Group", "figure"]),
      dl.insert_attribute_value_at_first_child_start(#(
        "ChapterTitle",
        "number-chiron",
        "&ensp;",
        infra.GoBack,
      )),
      dl.insert_attribute_value_at_first_child_start(#(
        "SubTitle",
        "number-chiron",
        "&ensp;",
        infra.GoBack,
      )),
    ],
    pp.annotated_backtick_splitting("span", "class", ["MathBlock", "Math"]),
    pp.markdown_link_splitting(["MathBlock", "Math"]),
    pp.barbaric_symmetric_delim_splitting("`", "`", "code", [
      "MathBlock",
      "Math",
      "pre",
    ]),
    pp.barbaric_symmetric_delim_splitting("_", "_", "i", [
      "MathBlock",
      "Math",
      "pre",
      "code",
    ]),
    pp.barbaric_symmetric_delim_splitting("\\*", "*", "b", [
      "MathBlock",
      "Math",
      "pre",
      "code",
    ]),
    [
      dl.bridge_whitespace("b"),
      dl.wrap_adjacent_non_whitespace_text_with(#(
        ["Math", "i", "b", "code"],
        "NoWrap",
      )),
      dl.table_marker(),
    ],
    pp.splitting_empty_lines_cleanup(),
    [
      dl.handles_add_ids(),
      dl.handles_generate_dictionary_and_id_list("path"),
      dl.handles_substitute_and_fix_nonlocal_id_links(
        #("path", "a", "a", [], []),
      ),
      dl.tokenize_href_surroundings(),
      dl.rearrange_links_4_pre_tokenized_src__batch([
        #("Theorem <a href=1>_1_</a>", "<a href=1>Theorem _1_</a>"),
        #("(Theorem <a href=1>_1_</a>", "(<a href=1>Theorem _1_</a>"),
        #("Übungsaufgabe <a href=1>_1_</a>", "<a href=1>Übungsaufgabe _1_</a>"),
        #("Aufgabe <a href=1>_1_</a>", "<a href=1>Aufgabe _1_</a>"),
        #("Lemma <a href=1>_1_</a>", "<a href=1>Lemma _1_</a>"),
        #("Algorithmus <a href=1>_1_</a>", "<a href=1>Algorithmus _1_</a>"),
        #("Kapitel <a href=1>_1_</a>", "<a href=1>Kapitel _1_</a>"),
        #("Teilkapitel <a href=1>_1_</a>", "<a href=1>Teilkapitel _1_</a>"),
        #("Beispiel <a href=1>_1_</a>", "<a href=1>Beispiel _1_</a>"),
        #("Definition <a href=1>_1_</a>", "<a href=1>Definition _1_</a>"),
      ]),
      dl.detokenize_href_surroundings(),
    ],
    [
      dl.wrap_children(#("Carousel", "CarouselItems", infra.Continue)),
      dl.append_class__batch([
        #("Index", "index"),
        #("Chapter", "chapter"),
        #("ChapterTitle", "main-column page-title"),
        #("Sub", "subchapter"),
        #("SubTitle", "main-column page-title"),
        #("MathBlock", "math-block"),
        #("Highlight", "well highlight"),
        #("Statement", "well statement"),
        #("Remark", "well remark"),
        #("Exercise", "well exercise"),
        #("CarouselContainer", "carousel__container"),
        #("Carousel", "carousel"),
        #("CarouselItems", "carousel__items"),
        #("CarouselItem", "carousel__item"),
        #("Group", "group"),
        #("NoWrap", "nowrap"),
      ]),
      dl.wrap_children_custom(#("Group", group_scaler, infra.GoBack)),
      dl.prepend_custom(#("Group", group_placeholder)),
      dl.wrap_if_child_of(#("pre", "div", ["Sub", "Chapter"])),
      dl.wrap_if_child_of(#("ol", "div", ["Sub", "Chapter"])),
      dl.wrap_if_child_of(#("ul", "div", ["Sub", "Chapter"])),
      dl.append_class_to_child_if_has_class(#("Chapter", "out", "well")),
      dl.append_class_to_child_if_has_class(#("Sub", "out", "well")),
      dl.append_class_to_child_if_is_one_of(#(
        "Chapter",
        "main-column",
        main_column_elements,
      )),
      dl.append_class_to_child_if_is_one_of(#(
        "Sub",
        "main-column",
        main_column_elements,
      )),
      dl.wrap_with_custom_if_not_child_of(
        #("figure", figure__container, ["Sub", "Chapter"]),
      ),
      dl.wrap_with_custom_if_child_of(
        #("figure", pseudowell, ["Sub", "Chapter"]),
      ),
      dl.wrap_with_custom_if_child_of(
        #("CarouselContainer", pseudowell, ["Sub", "Chapter"]),
      ),
      dl.wrap_with_custom_if_not_child_of(
        #("Group", group__container, ["Sub", "Chapter"]),
      ),
      dl.wrap_with_custom_if_child_of(
        #("Group", pseudowell, ["Sub", "Chapter"]),
      ),
      dl.replace_with_arbitrary(#("QED", qed)),
      dl.rename_with_class(#("InTextWarning", "span", "source-error-span")),
      dl.rename_with_class_and_attributes(
        #("CircleX", "img", "circle-X-img", [
          #("src", "img/context-free/LR/circle-X.svg"),
        ]),
      ),
      dl.append_class__batch([
        #("TopicAnnouncement", "topic-announcement"),
        #("SubtopicAnnouncement", "subtopic-announcement"),
      ]),
      dl.wrap_children_up_to_custom(#(
        "Chapter",
        "Sub",
        body_wrapper,
        infra.GoBack,
      )),
      dl.wrap_children_custom(#("Sub", body_wrapper, infra.GoBack)),
      dl.wrap_children_custom(#("Index", body_wrapper, infra.GoBack)),
    ],
    case author_mode {
      False -> []
      True -> [
        dl.ti2_turn_lines_into_3003_spans(parameters.input_dir, [
          "Math",
          "MathBlock",
          "TopMenu",
          "BottomMenu",
        ]),
        dl.ti2_adorn_img_with_3003_spans(parameters.output_dir, []),
        dl.ti2_adorn_with_3003_spans(#(parameters.input_dir, "", ["MathBlock"])),
        dl.ti2_wrap_with_3003_spans(#(parameters.input_dir, "", ["Math"])),
      ]
    },
    [
      dl.fold_contents_into_text("Math"),
      dl.rename__batch([
        #("MathBlock", "div"),
        #("Index", "div"),
        #("TopMenu", "div"),
        #("BottomMenu", "div"),
        #("MenuRow", "div"),
        #("HorizontalMenu", "div"),
        #("Chapter", "div"),
        #("ChapterTitle", "div"),
        #("Sub", "div"),
        #("SubTitle", "div"),
        #("Exercise", "div"),
        #("Statement", "div"),
        #("Highlight", "div"),
        #("Remark", "div"),
        #("TopicAnnouncement", "h2"),
        #("SubtopicAnnouncement", "h3"),
        #("CarouselContainer", "div"),
        #("Carousel", "div"),
        #("CarouselItems", "div"),
        #("CarouselItem", "div"),
        #("SubTheorem", "div"),
        #("Group", "div"),
        #("NoWrap", "span"),
        #("BodyWrapper", "div"),
        #("EndOfPageElt", "div"),
      ]),
      dl.delete_attribute__batch([
        "_",
        "counter",
        "title",
        "number-chiron",
        "original",
      ]),
      dl.check_tags(#(post_transformation_approved_tags, "post-transformation")),
    ],
  ]
  |> list.flatten
  |> infra.desugarers_2_pipeline
}
