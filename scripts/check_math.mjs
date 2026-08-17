#!/usr/bin/env node
/** Validate every display formula with the KaTeX version shipped by the site. */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import katex from "katex";

function markdownFiles(paths) {
  const files = [];
  for (const path of paths) {
    const stat = statSync(path);
    if (stat.isFile()) {
      if (path.endsWith(".md")) files.push(path);
      continue;
    }
    for (const entry of readdirSync(path)) {
      files.push(...markdownFiles([join(path, entry)]));
    }
  }
  return files.sort();
}

function formulasIn(file) {
  const lines = readFileSync(file, "utf8").replaceAll("\r\n", "\n").split("\n");
  const formulas = [];
  let fence = null;
  let start = null;
  let body = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      fence = fence === marker ? null : marker;
      continue;
    }
    if (fence !== null) continue;

    const trimmed = line.trim();
    if (trimmed === "\\[" || trimmed === "\\]") {
      throw new Error(`${file}:${index + 1}: use $$ for display math, not \\[ ... \\]`);
    }
    if (trimmed === "$$") {
      if (start === null) {
        start = index + 1;
        body = [];
      } else {
        formulas.push({ line: start, source: body.join("\n") });
        start = null;
      }
      continue;
    }
    if (trimmed === "\\[") {
      if (start !== null) throw new Error(`${file}:${index + 1}: nested display formula`);
      start = index + 1;
      body = [];
      continue;
    }
    if (trimmed === "\\]") {
      if (start === null) throw new Error(`${file}:${index + 1}: closing \\] without \\[`);
      formulas.push({ line: start, source: body.join("\n") });
      start = null;
      continue;
    }
    if (start !== null) {
      body.push(line);
      continue;
    }

    const prose = line.replace(/`[^`]*`/g, "");
    if (prose.includes("\\(") || prose.includes("\\)")) {
      throw new Error(`${file}:${index + 1}: use $ for inline math, not \\(...\\)`);
    }
    for (const match of prose.matchAll(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g)) {
      formulas.push({ line: index + 1, source: match[1], display: false });
    }
    for (const match of prose.matchAll(/\\\((.+?)\\\)/g)) {
      formulas.push({ line: index + 1, source: match[1], display: false });
    }
  }
  if (start !== null) throw new Error(`${file}:${start}: unclosed display formula`);
  return formulas;
}

const failures = [];
let checked = 0;
for (const file of markdownFiles(process.argv.slice(2).length ? process.argv.slice(2) : ["docs", "drafts"])) {
  try {
    for (const formula of formulasIn(file)) {
      try {
        katex.renderToString(formula.source, {
          displayMode: formula.display ?? true,
          throwOnError: true,
          strict: "error"
        });
      } catch (error) {
        throw new Error(`${file}:${formula.line}: ${error.message}`);
      }
      checked += 1;
    }
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length) {
  console.error("Math validation failed:");
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated ${checked} display formula(s) with KaTeX.`);
