import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[match[1].trim()] = val;
    }
  }
} catch {
  // no .env
}
