#!/usr/bin/env node
/** Verify that published Markdown image references use resolvable local assets. */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

function markdownFiles(paths) {
  const files = [];
  for (const path of paths) {
    if (!existsSync(path)) continue;
    if (statSync(path).isFile()) {
      if (path.endsWith(".md")) files.push(path);
      continue;
    }
    for (const entry of readdirSync(path)) files.push(...markdownFiles([path + "/" + entry]));
  }
  return files.sort();
}

const failures = [];
let checked = 0;
for (const file of markdownFiles(process.argv.slice(2).length ? process.argv.slice(2) : ["docs"])) {
  let fence = null;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const marker = line.match(/^\s*(\x60{3,}|~{3,})/)?.[1];
    if (marker) {
      fence = fence === marker[0] ? null : marker[0];
      continue;
    }
    if (fence) continue;
    if (line.includes("![[")) {
      failures.push(file + ":" + (index + 1) + ": use Markdown image links, not Obsidian embeds");
    }
    for (const match of line.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const reference = match[1];
      if (/^(?:https?:|data:|#)/.test(reference)) continue;
      checked += 1;
      if (!existsSync(resolve(dirname(file), decodeURIComponent(reference)))) {
        failures.push(file + ":" + (index + 1) + ": missing image asset " + reference);
      }
    }
  }
}

if (failures.length) {
  console.error("Attachment validation failed:");
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Validated " + checked + " local Markdown image reference(s).");
