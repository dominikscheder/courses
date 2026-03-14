/**************************************************
 * the different layouts are characterized by:    *
 *                                                *
 * - MOBILE: edge of text in outer wells is       *
 *   flush with edge of main column of text       *
 *                                                *
 * - TABLET: edge of outer well (the well itself) *
 *   is flush with edge of main column of text,   *
 *                                                *
 * - LAPTOP: outer well is inset compared to      *
 *   see const LAPTOP_OUTER_WELL_INSET            *
 *                                                *
 * - DESKTOP: main column of text no longer       *
 *   takes up whole screen, outer well is flush   *
 *   again; see const DESKTOP_MAIN_COLUMN_WIDTH   *
 **************************************************/

const RECENTERING_TOLERANCE = 150;

const UNCOMFORTABLY_SMALL_MAX_WIDTH = 400;
const MOBILE_MAX_WIDTH = 550;
const TABLET_MAX_WIDTH = 900;
const LAPTOP_MAX_WIDTH = 1400;

const LAPTOP_OUTER_WELL_INSET = 150;
const DESKTOP_MAIN_COLUMN_WIDTH = 1050;

const CAROUSEL_ARROW_MAX_HEIGHT = 56;
const CAROUSEL_ARROW_MIN_HEIGHT = 33;
const CAROUSEL_ARROW_MAX_HEIGHT_CONTAINER_WIDTH = 2200;
const CAROUSEL_ARROW_MIN_HEIGHT_CONTAINER_WIDTH = 490;

const USE_ABSOLUTE_TOP_MENU_IN_DESKTOP = true;

const root = document.documentElement;

window.history.scrollRestoration = "manual";

let lastScrollY = 0;
let lastScrollYMoment = Date.now();
let topMenuVisible = true;
let isPageCentered = true;
let screenWidth = -1;
let screenHeight = -1;

let topMenu = null;
let bottomMenu = null;
let bodyWrapper = null;

const clamp01 = (x) => {
  return Math.max(Math.min(x, 1), 0);
};

const offsideWidth = () => {
  return (document.body.scrollWidth - window.visualViewport.width) / 2;
};

const recenter = (behavior) => {
  window.scroll({
    left: offsideWidth(),
    behavior: behavior,
  });

  isPageCentered = true;
};

const onClick = (e) => {
  if (Math.abs(window.scrollX - offsideWidth()) > 1) {
    recenter("smooth");
    e.preventDefault();
    return;
  }

  if (screenWidth <= MOBILE_MAX_WIDTH) {
    return;
  }

  let h = e.clientY / screenHeight;

  if (h < 0.25) {
    window.scrollBy({ top: -screenHeight * 0.8 });
  }

  if (h > 0.75) {
    window.scrollBy({ top: screenHeight * 0.8 });
  }

  if (screenWidth <= TABLET_MAX_WIDTH) {
    return;
  }

  let z = (0.5 * (screenWidth - mainColumnWidthInPx())) / 2;

  if (e.clientX < z) {
    navigateToChapter("prev-page");
  }

  if (e.clientX > screenWidth - z) {
    navigateToChapter("next-page");
  }
};

const instantRecenter = () => {
  recenter("instant");
};

const topMenuPosition = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "fixed";
  return USE_ABSOLUTE_TOP_MENU_IN_DESKTOP ? "absolute" : "fixed";
};

const topMenuLeftInPx = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 0;
  return USE_ABSOLUTE_TOP_MENU_IN_DESKTOP ? offsideWidth() : 0;
};

const topMenuFontSizeInEm = () => {
  if (screenWidth <= UNCOMFORTABLY_SMALL_MAX_WIDTH) return 0.9;
  return 1;
};

const remInPx = () => {
  if (screenWidth <= UNCOMFORTABLY_SMALL_MAX_WIDTH) return 16;
  if (screenWidth <= MOBILE_MAX_WIDTH) return 17;
  return 16;
};

const inhaltsArrowsDisplay = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "none";
  let prevPage = document.getElementById("prev-page");
  if (!prevPage) return "";
  if (prevPage.getAttribute("href") != "./index.html") return "none";
  return "inline";
};

const topMenuPaddingXInRem = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return mainColumnPaddingXInRem();
  return 1.7;
};

const topMenuPaddingYInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1.6;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.6;
  return 1.4;
};

const topMenuBackgroundColor = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "var(--body-background-color)";
  return "#0000";
};

const topMenuElementGapInRem = () => {
  if (screenWidth <= UNCOMFORTABLY_SMALL_MAX_WIDTH) return 0.9;
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.8;
  if (screenWidth <= TABLET_MAX_WIDTH) return 0.7;
  return 0.55;
};

const bottomMenuHrDisplay = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "block";
  return "none";
};

const bottomMenuHrMarginTopInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.9;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.3;
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 1.5;
  return 1.6;
};

const bottomMenuHrMarginBottomInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.85;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.2;
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 1.3;
  return 1.4;
};

const bottomMenuDisplay = () => {
  return "flex";
};

const bottomMenuPosition = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "static";
  return "absolute";
};

const bottomMenuPaddingXInRem = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return mainColumnPaddingXInRem();
  return 2.4;
};

const bottomMenuPaddingYInRem = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 0;
  return endOfPageEltPaddingBottomInRem();
};

const bottomMenuLeft = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "";
  return offsideWidth() + "px";
};

const bottomMenuMargin = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return "0 auto 0.8em";
  if (screenWidth <= TABLET_MAX_WIDTH) return "0 auto 1.3em";
  if (screenWidth <= LAPTOP_MAX_WIDTH) return "0 auto 1.4em";
  return "0";
};

const indexHeaderTitleFontSizeInRem = () => {
  return pageTitleFontSizeInRem();
};

const indexHeaderTitleLineHeightInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 2.2;
  if (screenWidth <= TABLET_MAX_WIDTH) return 2.5;
  return 2.8;
};

const indexHeaderSubtitleFontSizeInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1.35;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.45;
  return 1.5;
};

const indexHeaderPaddingTopInPx = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 90;
  if (screenWidth <= TABLET_MAX_WIDTH) return 100;
  return 90;
};

const indexHeaderPaddingBottomInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 2;
  if (screenWidth <= TABLET_MAX_WIDTH) return 3;
  return 4;
};

const indexTocMaxWidthInPx = () => {
  if (screenWidth <= TABLET_MAX_WIDTH)
    return screenWidth - 2 * mainColumnPaddingXInRem() * remInPx();
  return 580;
};

const indexTocPaddingBottomInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1.5;
  if (screenWidth <= TABLET_MAX_WIDTH) return 2;
  return 3;
};

const indexTocChapterLevelMarginInEm = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.6;
  if (screenWidth <= TABLET_MAX_WIDTH) return 0.6;
  return 0.5;
};

const indexTocSubchapterLevelMarginInEm = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.3;
  if (screenWidth <= TABLET_MAX_WIDTH) return 0.25;
  return 0.2;
};

const carouselMaxWidthInPx = () => {
  const adjustedScreenWidth = screenWidth * 0.9;
  const computeTabletMaxWidth = Math.min(
    adjustedScreenWidth,
    DESKTOP_MAIN_COLUMN_WIDTH,
  );
  const computeDesktopMaxWidth =
    screenWidth < DESKTOP_MAIN_COLUMN_WIDTH
      ? adjustedScreenWidth
      : DESKTOP_MAIN_COLUMN_WIDTH;

  if (screenWidth <= MOBILE_MAX_WIDTH) return screenWidth;
  if (screenWidth <= TABLET_MAX_WIDTH) return computeTabletMaxWidth;
  return computeDesktopMaxWidth;
};

const endOfPageMainColumnMarginBottomInRem = () => {
  return 0.0;
};

const endOfPageWellMarginBottomInRem = () => {
  return 0.2;
};

const endOfPageEltPaddingBottomInRem = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 0;
  return 2.2;
};

const mainColumnWidthInPx = () => {
  if (screenWidth <= LAPTOP_MAX_WIDTH) return screenWidth;
  return DESKTOP_MAIN_COLUMN_WIDTH;
};

const mainColumnPaddingXInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1.5;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.8;
  return 2;
};

const mainColumnToWellMarginInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.8;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.6;
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 1.7;
  return 1.8;
};

const outerWellWidthInPx = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return screenWidth - 1.5 * remInPx();
  if (screenWidth <= TABLET_MAX_WIDTH)
    return screenWidth - 2 * mainColumnPaddingXInRem() * remInPx();
  if (screenWidth <= LAPTOP_MAX_WIDTH)
    return mainColumnWidthInPx() - 2 * LAPTOP_OUTER_WELL_INSET;
  return mainColumnWidthInPx() - 2 * mainColumnPaddingXInRem() * remInPx();
};

const pageTitleFontSizeInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1.8;
  if (screenWidth <= TABLET_MAX_WIDTH) return 2.1;
  return 2.25;
};

const pageTitlePaddingTopInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 7;
  if (screenWidth <= TABLET_MAX_WIDTH) return 7;
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 6;
  return 3.6;
};

const topicAnnouncementFontSizeInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return pageTitleFontSizeInRem() * 0.85;
  if (screenWidth <= TABLET_MAX_WIDTH) return pageTitleFontSizeInRem() * 0.82;
  return pageTitleFontSizeInRem() * 0.78;
};

const subtopicAnnouncementFontSizeInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH)
    return topicAnnouncementFontSizeInRem() * 0.95;
  if (screenWidth <= TABLET_MAX_WIDTH)
    return topicAnnouncementFontSizeInRem() * 0.9;
  return topicAnnouncementFontSizeInRem() * 0.85;
};

const wellMarginYInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.75;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.6;
  return 2;
};

const lastChildWellMarginBottomInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0;
  if (screenWidth <= TABLET_MAX_WIDTH) return 0.2;
  return 0.5;
};

const wellPaddingXInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.75;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.3;
  return 2;
};

const wellPaddingYInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0.75;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.2;
  return 1.6;
};

const ulOlMarginLeftInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.5;
  return 2;
};

const ulOlMarginRightInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 1;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1.5;
  return 2;
};

const nestedUlOlMarginLeftInRem = () => {
  return ulOlMarginLeftInRem();
};

const nestedUlOlMarginRightInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 0;
  if (screenWidth <= TABLET_MAX_WIDTH) return 1;
  return 2;
};

const textfigurePaddingXInRem = () => {
  if (screenWidth <= MOBILE_MAX_WIDTH) return 2.5;
  if (screenWidth <= TABLET_MAX_WIDTH) return 3;
  if (screenWidth <= LAPTOP_MAX_WIDTH) return 5;
  return 6;
};

const resetScreenWidthDependentVars = () => {
  let set = (key, val, unit) => {
    root.style.setProperty(key, `${val()}` + unit);
  };

  set("--top-menu-position", topMenuPosition, "");
  set("--top-menu-left", topMenuLeftInPx, "px");
  set("--top-menu-font-size", topMenuFontSizeInEm, "em");
  set("--rem-font-size", remInPx, "px");
  set("--inhalts-arrows-display", inhaltsArrowsDisplay, "");
  set("--top-menu-padding-x", topMenuPaddingXInRem, "rem");
  set("--top-menu-padding-y", topMenuPaddingYInRem, "rem");
  set("--top-menu-element-gap", topMenuElementGapInRem, "rem");
  set("--top-menu-background-color", topMenuBackgroundColor, "");
  set("--bottom-menu-hr-display", bottomMenuHrDisplay, "");
  set("--bottom-menu-hr-margin-top", bottomMenuHrMarginTopInRem, "rem");
  set("--bottom-menu-hr-margin-bottom", bottomMenuHrMarginBottomInRem, "rem");
  set("--bottom-menu-display", bottomMenuDisplay, "");
  set("--bottom-menu-position", bottomMenuPosition, "");
  set("--bottom-menu-padding-x", bottomMenuPaddingXInRem, "rem");
  set("--bottom-menu-padding-y", bottomMenuPaddingYInRem, "rem");
  set("--bottom-menu-left", bottomMenuLeft, "");
  set("--bottom-menu-margin", bottomMenuMargin, "");
  set("--index-header-title-font-size", indexHeaderTitleFontSizeInRem, "rem");
  set(
    "--index-header-title-line-height",
    indexHeaderTitleLineHeightInRem,
    "rem",
  );
  set(
    "--index-header-subtitle-font-size",
    indexHeaderSubtitleFontSizeInRem,
    "rem",
  );
  set("--index-header-padding-top", indexHeaderPaddingTopInPx, "px");
  set("--index-header-padding-bottom", indexHeaderPaddingBottomInRem, "rem");
  set("--index-toc-max-width", indexTocMaxWidthInPx, "px");
  set("--index-toc-padding-bottom", indexTocPaddingBottomInRem, "rem");
  set("--index-toc-chapter-level-margin", indexTocChapterLevelMarginInEm, "em");
  set(
    "--index-toc-subchapter-level-margin",
    indexTocSubchapterLevelMarginInEm,
    "em",
  );
  set("--carousel-max-width", carouselMaxWidthInPx, "px");
  set(
    "--end-of-page-main-column-margin-bottom",
    endOfPageMainColumnMarginBottomInRem,
    "rem",
  );
  set(
    "--end-of-page-well-margin-bottom",
    endOfPageWellMarginBottomInRem,
    "rem",
  );
  set(
    "--end-of-page-elt-padding-bottom",
    endOfPageEltPaddingBottomInRem,
    "rem",
  );
  set("--main-column-width", mainColumnWidthInPx, "px");
  set("--main-column-padding-x", mainColumnPaddingXInRem, "rem");
  set("--main-column-to-well-margin", mainColumnToWellMarginInRem, "rem");
  set("--outer-well-width", outerWellWidthInPx, "px");
  set("--page-title-font-size", pageTitleFontSizeInRem, "rem");
  set("--page-title-padding-top", pageTitlePaddingTopInRem, "rem");
  set("--topic-announcement-font-size", topicAnnouncementFontSizeInRem, "rem");
  set(
    "--subtopic-announcement-font-size",
    subtopicAnnouncementFontSizeInRem,
    "rem",
  );
  set("--well-margin-y", wellMarginYInRem, "rem");
  set("--last-child-well-margin-bottom", lastChildWellMarginBottomInRem, "rem");
  set("--well-padding-x", wellPaddingXInRem, "rem");
  set("--well-padding-y", wellPaddingYInRem, "rem");
  set("--ul-ol-margin-left", ulOlMarginLeftInRem, "rem");
  set("--ul-ol-margin-right", ulOlMarginRightInRem, "rem");
  set("--nested-ul-ol-margin-left", nestedUlOlMarginLeftInRem, "rem");
  set("--nested-ul-ol-margin-right", nestedUlOlMarginRightInRem, "rem");
  set("--textfigure-padding-x", textfigurePaddingXInRem, "rem");
};

function getClosestVisibleCarousel() {
  const y0 = window.innerHeight / 2;
  let closestDistance = Infinity;
  let closestContainer = null;
  for (const container of visibleCarouselContainers) {
    const r = container.getBoundingClientRect();
    const y = r.y + r.height / 2;
    const distance = Math.abs(y - y0);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestContainer = container;
    }
  }
  return closestContainer?.carousel || null;
}

function createCarouselObserver() {
  const options = {
    root: null,
    rootMargin: "0% 0% 0% 0%",
    threshold: 0.9,
  };

  const callback = (entries, _) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleCarouselContainers.add(entry.target);
      } else {
        visibleCarouselContainers.delete(entry.target);
      }
    });
  };

  return new IntersectionObserver(callback, options);
}

const adjustMathAlignment = () => {
  document.querySelectorAll(".math-block").forEach((math_block) => {
    if (math_block.scrolled === undefined) {
      math_block.scroll({ left: 1000 });
      math_block.scrolled = true;
    }
    // const svg = math_block.querySelector("svg");
    // if (!svg) {
    //   // this happens throughout---it seems the mjx_container
    //   // momentarily only contains assistive content
    //   return;
    // }
    // const minWidth = window.getComputedStyle(svg).minWidth;
    // if (!minWidth || !minWidth.endsWith("px")) {
    //   console.log("failed to get minWidth ending with 'px':", minWidth);
    //   return;
    // }
    // const minWidthInPx = parseFloat(minWidth);
    // const mathBlockWidthInPx = math_block.getBoundingClientRect().width;
    // if (true || minWidthInPx > mathBlockWidthInPx) {
    //   math_block.scroll({ left: 1000 });
    // }
  });
};

const tryConstrainFigureImage = (image) => {
  let constrainerWidth = image.constrainer.getBoundingClientRect().width;
  if (constrainerWidth >= image.originalWidthInPx) {
    image.style.width = image.originalWidth;
    return false;
  }
  image.classList.remove("unconstrained");
  image.classList.add("constrained");
  image.style.width = constrainerWidth + "px";
  return true;
};

const tryUnconstrainFigureImage = (image) => {
  let constrainerWidth = image.constrainer.getBoundingClientRect().width;
  if (constrainerWidth >= image.originalWidthInPx) return false;
  image.classList.remove("constrained");
  image.classList.add("unconstrained");
  image.style.width = image.originalWidth;
  return true;
};

const toggleFigureImageZoom = (image) => {
  if (image.classList.contains("constrained")) {
    return tryUnconstrainFigureImage(image);
  } else {
    return tryConstrainFigureImage(image);
  }
};

const figureImgClick = (e) => {
  if (!isPageCentered) return;
  const image = e.srcElement;
  if (toggleFigureImageZoom(image)) {
    e.stopPropagation();
    e.preventDefault();
  }
};

const setTopMenuVisible = (val) => {
  if (USE_ABSOLUTE_TOP_MENU_IN_DESKTOP && screenWidth > LAPTOP_MAX_WIDTH)
    val = true; // can't hide the absolutely positioned top menu
  if (val) {
    topMenu?.classList.remove("menu--hidden");
  } else {
    topMenu?.classList.add("menu--hidden");
  }
  topMenuVisible = val;
};

const onMouseMove = (e) => {
  const inZoneX = (x) => {
    let mX = (screenWidth - mainColumnWidthInPx()) / 2;
    return x < mX || x > screenWidth - mX;
  };
  let inZone =
    e.screenY < 250 && (screenWidth <= LAPTOP_MAX_WIDTH || inZoneX(e.screenX));
  if (inZone) {
    if (!topMenuVisible && isPageCentered) setTopMenuVisible(true);
  } else {
    if (topMenuVisible && lastScrollY > 10) setTopMenuVisible(false);
  }
};

const onScrollMenuDisplay = (e) => {
  const currentScrollY = window.scrollY;
  const currentScrollYMoment = Date.now();
  const velocity =
    (currentScrollY - lastScrollY) / (currentScrollYMoment - lastScrollYMoment);

  if (
    (velocity < -7 ||
      (velocity < -3.5 && screenWidth <= TABLET_MAX_WIDTH) ||
      currentScrollY <= 10 ||
      (velocity < 0 && currentScrollY <= 200)) &&
    !topMenuVisible
  ) {
    setTopMenuVisible(true);
  } else if (
    currentScrollY > lastScrollY &&
    currentScrollY > 10 &&
    topMenuVisible &&
    Math.abs(velocity) > 1
  ) {
    setTopMenuVisible(false);
  }

  lastScrollY = currentScrollY;
  lastScrollYMoment = currentScrollYMoment;
};

const smoothRecenterMaybe = (_) => {
  let theoretical_left = offsideWidth();
  if (
    window.scrollX > theoretical_left - RECENTERING_TOLERANCE &&
    window.scrollX < theoretical_left + RECENTERING_TOLERANCE
  ) {
    recenter("smooth");
  } else {
    isPageCentered = false;
  }
};

const onTouchscreenElse = (callback1, callback2) => {
  if (window.innerWidth <= TABLET_MAX_WIDTH) return callback1();
  return callback2();
};

const visibleCarouselContainers = new Set();

const setupMenuTooltips = () => {
  for (const id of [
    "top-prev-page-tooltip",
    "top-next-page-tooltip",
    "bottom-prev-page-tooltip",
    "bottom-next-page-tooltip",
  ]) {
    let tooltip = document.getElementById(id);
    if (!tooltip) {
      console.log("could not find tooltip:", id);
      continue;
    }
    tooltip.visibility = false;
    tooltip.touchdevice = false;
    tooltip.parentNode.addEventListener("touchstart", () => {
      tooltip.touchdevice = true;
      tooltip.style.display = "none";
    });
    tooltip.parentNode.addEventListener("mouseover", () => {
      tooltip.visibility = true;
      setTimeout(() => {
        if (tooltip.visibility === true && !tooltip.touchdevice)
          tooltip.style.visibility = "visible";
      }, 50);
    });
    tooltip.parentNode.addEventListener("mouseout", () => {
      tooltip.visibility = false;
      tooltip.style.visibility = "hidden";
    });
  }
};

const setupNextPageTooltip = () => {
  let tooltip = document.getElementById("next-page-tooltip");
  if (!tooltip) return;
  tooltip.visibility = false;
  tooltip.parentNode.addEventListener("mouseover", () => {
    tooltip.visibility = true;
    setTimeout(() => {
      if (tooltip.visibility === true) tooltip.style.visibility = "visible";
    }, 250);
  });
  tooltip.parentNode.addEventListener("mouseout", () => {
    tooltip.visibility = false;
    tooltip.style.visibility = "hidden";
  });
};

let allFigureImages = new Array();
let allCarouselImages = new Array();

const partitionArray = (a, condition) => {
  let a1 = [];
  let a2 = [];
  a.forEach((x) => {
    if (condition(x)) {
      a1.push(x);
    } else {
      a2.push(x);
    }
  });
  return [a1, a2];
};

const measureImage = (image) => {
  let s = window.getComputedStyle(image);
  image.originalWidth = s.width;
  image.originalHeight = s.height;
  image.originalWidthInPx = parseFloat(image.originalWidth);
  image.originalHeightInPx = parseFloat(image.originalHeight);
};

const setupCarouselImage = (image) => {
  measureImage(image);
  image.style.width = "";
  image.style.height = "";

  allCarouselImages.push(image);
  window.requestAnimationFrame(() => {
    image.classList.add("zoom-transition");
  });
};

const setupFigureImage = (image) => {
  measureImage(image);
  image.style.width = "";
  image.style.height = "";
  image.classList.add("constrained");
  image.figure = image.closest("figure");
  image.constrainer = image.figure.parentNode;
  image.figcaption = image.figure.querySelector("figcaption");
  allFigureImages.push(image);
  window.requestAnimationFrame(() => {
    image.classList.add("zoom-transition");
    image.addEventListener("click", figureImgClick);
  });
};

const setupImages = () => {
  let images = document.querySelectorAll("img");
  let [_groupImages, images2] = partitionArray(images, (image) =>
    image.closest(".group"),
  );
  let [carouselImages, images3] = partitionArray(images2, (image) =>
    image.closest(".carousel"),
  );
  let [figureImages, _] = partitionArray(images3, (image) =>
    image.closest("figure"),
  );
  carouselImages.forEach(setupCarouselImage);
  figureImages.forEach(setupFigureImage);
};

let allCarouselObjects = new Array();

class Carousel {
  constructor(container) {
    if (!container.classList.contains("carousel__container")) {
      console.error(
        "'Carousel' constructor should be called on carousel__container!",
      );
      return;
    }

    this.container = container;
    this.carousel = container.querySelector(".carousel");
    this.carouselItems = container.querySelectorAll(".carousel__item");
    this.numItems = this.carouselItems.length;
    this.itemNumber = 1;
    this.holdInterval = null;
    this.holdTimeout = null;
    this.isHolding = false;
    this.constrained = true;

    container.carousel = this;
    this.carousel.object = this;

    this.imgs = Array.from(this.carouselItems)
      .map((item) => item.querySelector("img"))
      .filter((img) => img);

    this.group = this.container.closest(".group");

    this.imgs.forEach((img) =>
      img.addEventListener("click", (e) => {
        if (this.group) return;
        if (this.toggleZoom(e)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }),
    );

    this.maxOriginalWidthInPx = 0;
    for (const img of this.imgs) {
      if (img.originalWidthInPx > this.maxOriginalWidthInPx)
        this.maxOriginalWidthInPx = img.originalWidthInPx;
    }

    this.unconstrainedUIPrevBtn = (() => {
      const btn = document.createElement("button");
      btn.className = "carousel__nav-button carousel__nav-item--prev";
      btn.innerHTML = '<img src="./img/carousel-prev-icon.svg" alt="Previous">';
      btn.setAttribute("aria-label", "Previous slide");
      return btn;
    })();

    this.unconstrainedUINextBtn = (() => {
      const btn = document.createElement("button");
      btn.className = "carousel__nav-button carousel__nav-item--next";
      btn.innerHTML = '<img src="./img/carousel-next-icon.svg" alt="Next">';
      btn.setAttribute("aria-label", "Next slide");
      return btn;
    })();

    this.constrainedUIFstBtn = (() => {
      const btn = document.createElement("button");
      btn.className = "carousel__nav-button carousel__nav-item--first";
      btn.innerHTML =
        '<img src="./img/carousel-jump-to-start.svg" alt="First">';
      btn.setAttribute("aria-label", "First slide");
      btn.addEventListener("click", (e) => {
        if (!isPageCentered) return;
        e.stopPropagation();
        e.preventDefault();
        this.setItemNumber(1);
      });
      return btn;
    })();

    this.constrainedUILstBtn = (() => {
      const btn = document.createElement("button");
      btn.className = "carousel__nav-button carousel__nav-item--last";
      btn.innerHTML = '<img src="./img/carousel-jump-to-end.svg" alt="Last">';
      btn.setAttribute("aria-label", "Last slide");
      btn.addEventListener("click", (e) => {
        if (!isPageCentered) return;
        e.stopPropagation();
        e.preventDefault();
        this.setItemNumber(this.numItems);
      });
      return btn;
    })();

    this.constrainedUIPrevBtn = this.unconstrainedUIPrevBtn.cloneNode(true);
    this.constrainedUINextBtn = this.unconstrainedUINextBtn.cloneNode(true);

    this.doOnClickAndOnHold(this.constrainedUIPrevBtn, () => {
      this.nudgeCarouselItem(-1);
    });

    this.doOnClickAndOnHold(this.constrainedUINextBtn, () => {
      this.nudgeCarouselItem(1);
    });

    this.doOnClickAndOnHold(this.unconstrainedUIPrevBtn, () => {
      this.nudgeCarouselItem(-1);
    });

    this.doOnClickAndOnHold(this.unconstrainedUINextBtn, () => {
      this.nudgeCarouselItem(1);
    });

    this.indexCounter = (() => {
      const indexCounter = document.createElement("span");
      indexCounter.textContent = `${this.itemNumber}`;
      return indexCounter;
    })();

    this.progressCounter = (() => {
      const progressCounter = document.createElement("div");
      progressCounter.className = "carousel__constrained-progress-counter";

      const slash = (() => {
        const slash = document.createElement("span");
        slash.textContent = "/";
        return slash;
      })();

      const totalSlides = (() => {
        const totalSlides = document.createElement("span");
        totalSlides.textContent = `${this.numItems}`;
        return totalSlides;
      })();

      progressCounter.appendChild(this.indexCounter);
      progressCounter.appendChild(slash);
      progressCounter.appendChild(totalSlides);

      return progressCounter;
    })();

    this.constrainedNav = (() => {
      const constrainedNav = document.createElement("div");

      constrainedNav.className = "carousel__constrained-nav";
      constrainedNav.appendChild(this.constrainedUIFstBtn);
      constrainedNav.appendChild(this.constrainedUIPrevBtn);
      constrainedNav.appendChild(this.progressCounter);
      constrainedNav.appendChild(this.constrainedUINextBtn);
      constrainedNav.appendChild(this.constrainedUILstBtn);

      return constrainedNav;
    })();

    [this.indicators, this.indicator_dots] = (() => {
      const indicators = document.createElement("div");
      indicators.className = "carousel__indicators";
      const indicator_dots = new Array();
      for (let i = 1; i <= this.numItems; i++) {
        const indicator = document.createElement("button");
        indicator.className = "carousel__indicator_box";
        indicator.setAttribute("aria-label", `Go to slide ${i}`);
        indicator.addEventListener("click", (e) => {
          if (!isPageCentered) return;
          e.stopPropagation();
          e.preventDefault();
          this.setItemNumber(i);
        });
        const circle = document.createElement("div");
        circle.className = "carousel__indicator_dot";
        indicator.appendChild(circle);
        indicators.appendChild(indicator);
        indicator_dots.push(circle);
      }
      return [indicators, indicator_dots];
    })();

    this.setItemNumber(1);
  }

  appendToContainer(thing) {
    if (!this.container.contains(thing)) {
      this.container.appendChild(thing);
    }
  }

  removeFromContainer(thing) {
    if (this.container.contains(thing)) {
      this.container.removeChild(thing);
    }
  }

  appendToCarousel(thing) {
    if (!this.carousel.contains(thing)) {
      this.carousel.appendChild(thing);
    }
  }

  prependToCarousel(thing) {
    if (!this.carousel.contains(thing)) {
      this.carousel.prepend(thing);
    }
  }

  removeFromCarousel(thing) {
    if (this.carousel.contains(thing)) {
      this.carousel.removeChild(thing);
    }
  }

  attachUnconstrainedNav() {
    this.prependToCarousel(this.unconstrainedUIPrevBtn);
    this.appendToCarousel(this.unconstrainedUINextBtn);
    this.appendToContainer(this.indicators);
  }

  removeUnconstrainedNav() {
    this.removeFromCarousel(this.unconstrainedUIPrevBtn);
    this.removeFromCarousel(this.unconstrainedUINextBtn);
    this.removeFromContainer(this.indicators);
  }

  attachConstrainedNav() {
    this.appendToContainer(this.constrainedNav);
  }

  removeConstrainedNav() {
    this.removeFromContainer(this.constrainedNav);
  }

  suggestedButtonHeightForOwnContainerSize = () => {
    let lambda = clamp01(
      (this.containerWidth - CAROUSEL_ARROW_MIN_HEIGHT_CONTAINER_WIDTH) /
        (CAROUSEL_ARROW_MAX_HEIGHT_CONTAINER_WIDTH -
          CAROUSEL_ARROW_MIN_HEIGHT_CONTAINER_WIDTH),
    );

    return (
      CAROUSEL_ARROW_MIN_HEIGHT * (1 - lambda) +
      CAROUSEL_ARROW_MAX_HEIGHT * lambda
    );
  };

  phase2ResetUnconstrainedUIButtonStyles = () => {
    let height = this.buttonHeightInPx + "px";
    this.unconstrainedUIPrevBtn.style.height = height;
    this.unconstrainedUINextBtn.style.height = height;

    let margin = this.unconstrainedButtonMarginInPx + "px";
    this.unconstrainedUIPrevBtn.style.margin = "0 " + margin;
    this.unconstrainedUINextBtn.style.margin = "0 " + margin;
    this.unconstrainedUIPrevBtn.style.margin = "0 " + margin;
    this.unconstrainedUINextBtn.style.margin = "0 " + margin;
  };

  phase2ResetConstrainedUIButtonStyles = () => {
    let height = this.buttonHeightInPx + "px";
    this.constrainedUIPrevBtn.style.height = height;
    this.constrainedUINextBtn.style.height = height;
    this.constrainedUIFstBtn.style.height = height;
    this.constrainedUILstBtn.style.height = height;

    this.constrainedUIPrevBtn.style.margin = "0";
    this.constrainedUINextBtn.style.margin = "0";
    this.constrainedUIFstBtn.style.margin = "0";
    this.constrainedUILstBtn.style.margin = "0";
  };

  onScreenWidthChangePhase1() {
    // PHASE 1 AFTER CONTAINER RESIZE (or on load)
    //
    // resets this.containerWidth and reports back
    // what this carousel considers to be its ideal
    // button height (for its own container size)
    this.containerWidth = this.container.getBoundingClientRect().width;
    return this.suggestedButtonHeightForOwnContainerSize();
  }

  onScreenWidthChangePhase2(imposedButtonHeight) {
    // PHASE 2 AFTER CONTAINER RESIZE (or on load)
    //
    // someone else tells us what button height to
    // use; given that button height, the carousel
    // determines whether to use the constrained UI
    // (cassette tape UI) or the unconstrained UI
    // (indicator dots) for this carousel, and sets
    // the UI
    this.buttonHeightInPx = imposedButtonHeight;
    this.buttonWidthInPx = (this.buttonHeightInPx * 18) / 34;
    this.unconstrainedButtonMarginInPx = imposedButtonHeight * 0.7;

    let unconstrainedUIWidth =
      this.maxOriginalWidthInPx +
      2 * this.buttonWidthInPx +
      4 * this.unconstrainedButtonMarginInPx;

    if (
      this.containerWidth >= unconstrainedUIWidth &&
      // we insist on constrained UI if the conjunction
      // 'on mobile and inside a |> Group' occurs
      !(screenWidth <= MOBILE_MAX_WIDTH && this.group != null)
    ) {
      this.bigEnoughContainerForUnconstrainedUI = true;
      this.removeConstrainedNav();
      this.attachUnconstrainedNav();
      this.phase2ResetUnconstrainedUIButtonStyles();
    } else {
      this.bigEnoughContainerForUnconstrainedUI = false;
      this.removeUnconstrainedNav();
      this.attachConstrainedNav();
      this.phase2ResetConstrainedUIButtonStyles();
    }

    this.updateConstrained();
  }

  updateIndexCounter() {
    this.indexCounter.textContent = `${this.itemNumber}`;
  }

  updateItemsDisplayValue() {
    this.carouselItems.forEach((item, index) => {
      item.style.display = index + 1 === this.itemNumber ? "flex" : "none";
    });
  }

  ourConstrainImage = (image) => {
    image.classList.remove("unconstrained");
    image.classList.add("constrained");
    image.style.width = `min(${this.containerWidth + "px"}, ${
      image.originalWidth
    })`;
  };

  ourUnconstrainImage = (image) => {
    image.classList.remove("constrained");
    image.classList.add("unconstrained");
    image.style.width = image.originalWidth;
  };

  updateConstrained() {
    if (this.bigEnoughContainerForUnconstrainedUI === undefined) {
      console.warn("carousel.updateConstrained called before onResize (?)");
    }

    if (this.constrained) {
      this.imgs.forEach(this.ourConstrainImage);
    } else {
      this.imgs.forEach(this.ourUnconstrainImage);
    }
  }

  toggleZoom(e) {
    if (!isPageCentered) return;
    if (this.containerWidth >= this.maxOriginalWidthInPx) {
      imgs.forEach(this.ourUnconstrainImage);
      return false;
    }
    this.constrained = !this.constrained;
    this.updateConstrained();
    return true;
  }

  updateIndicators() {
    this.indicator_dots.forEach((indicator, index) => {
      indicator.classList.toggle("active", index + 1 === this.itemNumber);
    });
  }

  setItemNumber(itemNumber) {
    if (itemNumber < 1 || itemNumber > this.numItems) {
      console.error("bad item number:", itemNumber);
      return;
    }
    this.itemNumber = itemNumber;
    this.updateItemsDisplayValue();
    this.updateIndexCounter();
    this.updateIndicators();
  }

  nudgeCarouselItem(direction) {
    this.setItemNumber(
      1 + ((this.numItems + this.itemNumber + direction - 1) % this.numItems),
    );
  }

  doOnClickAndOnHold(button, callback) {
    const captureAndKill = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const startHold = (e) => {
      if (this.isHolding) return;
      this.isHolding = true;
      callback();
      this.holdTimeout = setTimeout(() => {
        this.holdInterval = setInterval(() => {
          callback();
        }, 200);
      }, 400);
    };

    const stopHold = (e) => {
      this.isHolding = false;
      if (this.holdTimeout) {
        clearTimeout(this.holdTimeout);
        this.holdTimeout = null;
      }
      if (this.holdInterval) {
        clearInterval(this.holdInterval);
        this.holdInterval = null;
      }
    };

    button.addEventListener("click", captureAndKill);
    button.addEventListener("mousedown", captureAndKill);
    button.addEventListener("mousedown", startHold);
    button.addEventListener("touchstart", startHold, { passive: false });
    button.addEventListener("mouseup", stopHold);
    button.addEventListener("mouseleave", stopHold);
    button.addEventListener("touchend", stopHold, { passive: false });
    button.addEventListener("touchcancel", stopHold);
  }
}

const constrainGroup = (group, with_transition) => {
  group.classList.remove("unconstrained");
  group.classList.add("constrained");
  let w = group.constrainer.getBoundingClientRect().width;
  let s = Math.min(1, w / group.originalWidthInPx);
  group.placeholder.classList.remove("group_placeholder_transition_ahead");
  if (with_transition)
    group.placeholder.classList.add("group_placeholder_transition_behind");
  else
    group.placeholder.classList.remove("group_placeholder_transition_behind");
  group.placeholder.style.height = group.originalHeightInPx * s + "px";
  group.scaler.style.transform = `translate(-50%) scale(${s})`;
};

const unconstrainGroup = (group, with_transition) => {
  group.classList.remove("constrained");
  group.classList.add("unconstrained");
  group.placeholder.classList.remove("group_placeholder_transition_behind");
  if (with_transition)
    group.placeholder.classList.add("group_placeholder_transition_ahead");
  else group.placeholder.classList.remove("group_placeholder_transition_ahead");
  group.placeholder.style.height = group.originalHeightInPx + "px";
  group.scaler.style.transform = "translate(-50%)";
};

const toggleGroupConstrained = (group) => {
  if (group.classList.contains("constrained")) {
    unconstrainGroup(group, true);
  } else {
    constrainGroup(group, true);
  }
};

const allGroups = [];

const setupGroups = () => {
  const groups = document.querySelectorAll(".group");
  groups.forEach((group) => {
    group.placeholder = group.querySelector(".group_placeholder");
    group.scaler = group.querySelector(".group_scaler");
    let r = group.scaler.getBoundingClientRect();
    group.originalWidthInPx = r.width;
    group.originalHeightInPx = r.height;
    group.constrainer = group.parentNode;
    constrainGroup(group, false);
    group.scaler.addEventListener("click", (e) => {
      if (!isPageCentered) return;
      e.stopPropagation();
      e.preventDefault();
      toggleGroupConstrained(group);
    });
    window.requestAnimationFrame(() => {
      group.scaler.classList.add("group_scaler_transition");
    });
    group.onResize = () => {
      group.scaler.classList.remove("group_scaler_transition");
      if (group.classList.contains("constrained")) {
        constrainGroup(group, false);
      }
      window.requestAnimationFrame(() => {
        group.scaler.classList.add("group_scaler_transition");
      });
    };
    allGroups.push(group);
  });
};

const setupCarousels = () => {
  let carouselObserver = createCarouselObserver();
  const carousels = document.querySelectorAll(".carousel__container");
  carousels.forEach((container) => {
    carouselObserver.observe(container);
    let c = new Carousel(container);
    allCarouselObjects.push(c);
  });
};

const updatePageTitleForScreenWidthChange = () => {
  const pageTitle = document.querySelector(".page-title");
  if (!pageTitle) return;

  let borders = screenWidth <= MOBILE_MAX_WIDTH;
  let template = borders
    ? "1fr"
    : (() => {
        const minWidth = getComputedStyle(root)
          .getPropertyValue("--page-title-border-min-width")
          .trim();
        return `minmax(${minWidth}, 1fr) auto minmax(${minWidth}, 1fr)`;
      })();

  pageTitle.classList.toggle("no-borders", borders);
  pageTitle.style.setProperty("grid-template-columns", template);
};

const setBottomMenuVisible = (viz) => {
  if (!bottomMenu) return;
  bottomMenu.style.visibility = viz ? "visible" : "hidden";
};

const onBodyHeightChange = () => {
  let clientHeight = document.body.clientHeight;
  setBottomMenuVisible(clientHeight >= 1000);
};

const onDOMContentLoaded = () => {
  console.log("onDOMContentLoaded");
  topMenu = document.getElementById("top-menu");
  bottomMenu = document.getElementById("bottom-menu");
  bodyWrapper = document.getElementById("body-wrapper");
  setTopMenuVisible(true);
  setupMenuTooltips();
  onResize();
  authorModeInit();
};

const onLoad = () => {
  console.log("onLoad");
  setupImages();
  setupCarousels();
  screenWidth = -1; // force onResize though onDOMContentLoaded already called it
  onResize();
  setupGroups(); // groups need carousels to have chosen their layout in order to initialize, so this comes here
  groupsOnResize();
  let resizeObserver = new ResizeObserver((entries) => {
    onBodyHeightChange();
  });
  resizeObserver.observe(document.body);
  onBodyHeightChange();
  document.body.style.visibility = "visible";
  // this forced call made a difference for
  // 5-4.html |> Group.top-align Carousel indicator dots:
  setTimeout(() => {
    screenWidth = -1;
    onResize();
  }, 500);
};

const onResize = () => {
  if (window.innerWidth == screenWidth) return;
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  instantRecenter();
  resetScreenWidthDependentVars();
  updatePageTitleForScreenWidthChange();
  setTimeout(adjustMathAlignment, 60);
  figureImagesOnResize();
  carouselImagesOnResize();
  groupsOnResize();
};

const figureImagesOnResize = () => {
  for (const image of allFigureImages) {
    image.classList.remove("zoom-transition");
    if (image.classList.contains("constrained")) tryConstrainFigureImage(image);
  }
  window.requestAnimationFrame(() => {
    for (const image of allFigureImages) {
      image.classList.add("zoom-transition");
    }
  });
};

const carouselImagesOnResize = () => {
  for (const image of allCarouselImages) {
    image.classList.remove("zoom-transition");
  }
  let totalButtonHeights = 0;
  for (const carousel of allCarouselObjects) {
    totalButtonHeights += carousel.onScreenWidthChangePhase1();
  }
  const avgButtonHeight = totalButtonHeights / allCarouselObjects.length;
  for (const carousel of allCarouselObjects) {
    carousel.onScreenWidthChangePhase2(avgButtonHeight);
  }
  window.requestAnimationFrame(() => {
    for (const image of allCarouselImages) {
      image.classList.add("zoom-transition");
    }
  });
};

const groupsOnResize = () => {
  allGroups.forEach((group) => group.onResize());
};

const onScrollEnd = (e) => {
  smoothRecenterMaybe();
  setTimeout(adjustMathAlignment, 60);
};

const onTouchEnd = (e) => {
  smoothRecenterMaybe();
};

// chapter navigation functions
const navigateToChapter = (elementId) => {
  const element = document.getElementById(elementId);
  if (element && element.tagName === "A" && element.href) {
    window.location.href = element.href;
  }
};

const onKeyDown = (e) => {
  // prevent default browser behavior for Option/Alt + Arrow combinations first
  if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault();
    e.stopPropagation();
  }

  // check if any input fields are focused to avoid interfering with typing
  const activeElement = document.activeElement;
  const isInputFocused =
    activeElement &&
    (activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable);

  if (isInputFocused) return;

  // check for Option+Arrow (Mac) or Alt+Arrow (Windows) for direct page navigation
  if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    switch (e.key) {
      case "ArrowLeft":
        navigateToChapter("prev-page");
        break;
      case "ArrowRight":
        navigateToChapter("next-page");
        break;
    }
    return;
  }

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      var carousel = getClosestVisibleCarousel();
      if (carousel != null) {
        carousel.nudgeCarouselItem(-1);
      } else {
        navigateToChapter("prev-page");
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      var carousel = getClosestVisibleCarousel();
      if (carousel != null) {
        carousel.nudgeCarouselItem(1);
      } else {
        navigateToChapter("next-page");
      }
      break;
    case "0":
      window.location.href = "index.html";
      break;
    case "1":
      window.location.href = "1-0.html";
      break;
    case "2":
      window.location.href = "2-0.html";
      break;
    case "3":
      window.location.href = "3-0.html";
      break;
    case "4":
      window.location.href = "4-0.html";
      break;
    case "5":
      window.location.href = "5-0.html";
      break;
    case "6":
      window.location.href = "6-0.html";
      break;
    case "7":
      window.location.href = "7-0.html";
      break;
    case "8":
      window.location.href = "8-0.html";
      break;
    case "9":
      window.location.href = "9-0.html";
      break;
  }
};

window.addEventListener("resize", onResize);
window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
window.addEventListener("load", onLoad);
document.addEventListener("click", onClick);
document.addEventListener("scroll", onScrollMenuDisplay, { passive: true });
document.addEventListener("mousemove", onMouseMove, { passive: true });
document.addEventListener("scrollend", onScrollEnd);
document.addEventListener("touchend", onTouchEnd, { passive: true });
document.addEventListener("keydown", onKeyDown, { capture: true });

const authorModeInit = () => {
  let tooltips = document.getElementsByClassName("t-3003");

  if (tooltips.length <= 0) return; // no tooltips == no author mode

  root.style.setProperty("--body-background-color", "#fcfcfc");
  root.style.setProperty("--pre-background-color", "#fff");
  root.style.setProperty("--pre-border", "1.5px solid black");
  root.style.setProperty("--pre-overflow-x", "visible");
  root.style.setProperty("--p-hasmathjax-overflow-x", "visible");
  root.style.setProperty("--p-hasmathjax-overflow-y", "visible");

  for (const t of tooltips) {
    if (t.classList.contains("t-3003-i")) {
      let urls = t.getElementsByClassName("t-3003-i-url");
      for (const u of urls) {
        u.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          sendCmdTo3003("open " + u.innerHTML);
        });
      }
    } else {
      t.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        sendCmdTo3003("code --goto " + t.innerHTML);
      });
    }
  }
};

const sendCmdTo3003 = (command) => {
  const payload = { cmd: command };
  const url =
    window.location.protocol === "file:"
      ? "http://localhost:3003/log-event"
      : "/log-event";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
