/**
 * One-off test: run AI event discovery for one city and print results.
 * Run: npx tsx scripts/test-discovery.ts [city]
 * Default city: Passau
 */
import "./load-env";
import { discoverLocalEvents } from "../lib/aiEventDiscovery";

const city = process.argv[2] || "Passau";

async function main() {
  console.log(`\nTesting AI discovery for: ${city}\n`);
  try {
    const events = await discoverLocalEvents(city);
    console.log(`Found ${events.length} events.\n`);
    for (const e of events) {
      const isIg = (e.source_url || "").includes("instagram.com");
      console.log(`- ${e.title}`);
      console.log(`  Date: ${e.event_date} ${e.time_start} | ${e.venue?.name ?? "—"}`);
      console.log(`  Source: ${e.source_url ?? "—"} ${isIg ? "[Instagram]" : ""}`);
      console.log(`  Confidence: ${e.ai_confidence}`);
      console.log("");
    }
    if (events.length === 0) {
      console.log("(No events returned – try another city or check API key.)");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
  process.exit(0);
}

main();
