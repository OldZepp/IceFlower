import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.log("copy-standalone: .next/standalone not found, nothing to copy");
  process.exit(0);
}

const staticSrc = join(root, ".next", "static");
const staticDest = join(standalone, ".next", "static");
if (existsSync(staticSrc)) {
  mkdirSync(staticDest, { recursive: true });
  cpSync(staticSrc, staticDest, { recursive: true });
}

const publicSrc = join(root, "public");
if (existsSync(publicSrc)) {
  cpSync(publicSrc, join(standalone, "public"), { recursive: true });
}

console.log("copy-standalone: .next/static and public copied next to server.js");
