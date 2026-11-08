const renderNotebookMath = () => {
  const mathBlocks = document.querySelectorAll(".arithmatex");

  mathBlocks.forEach((mathBlock) => renderMathInElement(mathBlock, {
    delimiters: [
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    output: "htmlAndMathml",
    throwOnError: false,
    strict: "warn",
    trust: false
  }));
  document.dispatchEvent(new Event("notebook:math-ready"));
};
// Material emits document$ again after each instant page navigation.
if (typeof document$ !== "undefined") {
  document$.subscribe(renderNotebookMath);
} else {
  document.addEventListener("DOMContentLoaded", renderNotebookMath);
}
