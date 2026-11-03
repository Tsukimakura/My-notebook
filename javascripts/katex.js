document.addEventListener("DOMContentLoaded", () => {
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
});
