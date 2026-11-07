#!/usr/bin/env node
// Keep browser code byte-identical to locked packages; trim license line endings.
import {readFileSync, mkdirSync, writeFileSync, existsSync} from "node:fs";
import {dirname} from "node:path";

const assets = [
  ["node_modules/markdown-it/dist/browser/markdown-it.umd.min.js", "docs/assets/vendor/markdown-it/markdown-it.min.js"],
  ["node_modules/markdown-it/LICENSE", "docs/assets/vendor/markdown-it/LICENSE"],
  ["node_modules/dompurify/dist/purify.min.js", "docs/assets/vendor/dompurify/purify.min.js"],
  ["node_modules/dompurify/LICENSE", "docs/assets/vendor/dompurify/LICENSE"],
  ["node_modules/dompurify/LICENSE-MPL", "docs/assets/vendor/dompurify/LICENSE-MPL"],
];
const check = process.argv.includes("--check");
let failed = false;
for (const [source, destination] of assets) {
  const bytes = readFileSync(source);
  const expected = source.includes("/LICENSE")
    ? Buffer.from(bytes.toString("utf8").replace(/[ \t]+$/gm, "")) : bytes;
  if (check) {
    if (!existsSync(destination) || !readFileSync(destination).equals(expected)) {
      process.stderr.write(`${destination}: run npm run vendor:sync\n`);
      failed = true;
    }
  } else {
    mkdirSync(dirname(destination), {recursive: true});
    writeFileSync(destination, expected);
  }
}
if (failed) process.exitCode = 1;
else process.stdout.write(`${check ? "Verified" : "Synced"} ${assets.length} browser assets and license files.\n`);
