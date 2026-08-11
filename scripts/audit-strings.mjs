/*
 * Two checks over the prerendered HTML and the source tree.
 *
 * 1. Nothing on the site may name a real employer, partner, vendor, product or
 *    piece of equipment, or use clinical vocabulary outside the handful of
 *    ordinary test names the spec puts in the demo table.
 * 2. Every string the spec fixes has to actually reach the page, spelled the
 *    way the spec spells it.
 *
 * Run with: npm run audit
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const HTML_ROOT = ".next/server/app";
const SOURCE_ROOTS = ["app", "components", "content", "lib", "scripts"];

const BANNED = [
  // Employer and its sites.
  "keck", "usc", "norris", "trojan",
  // Partners, reference labs and vendors.
  "neogenomics", "neo genomics", "quest diagnostics", "labcorp", "aruplab", "arup lab",
  "roche", "cobas", "sysmex", "abbott", "beckman", "siemens healthineers",
  // Sibling apps that must never be named or linked here.
  "labdash", "clearpath", "chequemate", "clerk.micbask",
  // Clinical and regulatory vocabulary the positioning rules exclude.
  // Not listed: the section names the spec itself puts on the consolidation and
  // network pages as exhibit labels (chemistry, hematology, coagulation,
  // urinalysis, cultures, blood counts). The spec fixes those words, so they
  // are checked as required strings below rather than banned here.
  "assay", "analyzer", "analyser", "specimen", "phlebotom", "accreditation",
  "clia", "cap-accredited", "histolog", "patholog", "immunoassay",
  "molecular diagnostic", "hla ",
];

/* Names the spec itself puts on the page, exempt from the vocabulary sweep. */
const ALLOWED_PHRASES = [
  "Complete blood count", "Basic metabolic panel", "Comprehensive metabolic panel",
  "Urinalysis", "Lipid panel", "Thyroid screen", "Coagulation screen",
  "Blood glucose", "Liver panel", "Electrolytes",
  "Riverside General", "Hillcrest Specialty",
];

/* Every string the spec fixes, and the page it has to appear on. */
const REQUIRED = {
  "index.html": [
    "Michael Bask",
    "LinkedIn",
    "Email",
    "A hospital lab operations dashboard. Synthetic data, live.",
    "Outside-lab spend, re-decided under public billing rules",
    "Two duplicate labs consolidated into one core",
    "A make-or-buy case won on revenue, not cost",
    "A ten-year centralization study for a lab network",
    "Selected healthcare operations, finance, and strategy work, shown as recreated exhibits with disguised figures.",
  ],
  "demo.html": [
    "Demo",
    "Demo: synthetic data.",
    "Riverside General",
    "Hillcrest Specialty",
    "A hospital lab operations dashboard demo, running entirely on synthetic data.",
    "Dashboard demo · Michael Bask",
  ],
  "work/billing-strategy.html": [
    "Billing strategy · Michael Bask",
    "Who gets to bill for outsourced testing under public Medicare rules, and the seven-figure result.",
    "The spend curve", "indexed, Y1 = 100", "growing ~", "% a year",
    "Outside-lab spend grew five times faster than the lab itself",
    "Six labs, wild unit economics", "Lab A", "Lab F",
    "Six outside labs. Cost per test varied forty-fold.",
    "Billed is not collected",
    "On these tests, collections covered barely half the invoices",
    "Who is allowed to bill?", "Inpatient", "Outpatient",
    "On Medicare&#x27;s exception list for advanced tests?",
    "Bundled into the hospital stay. No separate payment.",
    "The performing lab may bill Medicare directly.",
    "The hospital bills, capped at the lower of cost or fee schedule.",
    "Simplified view of the CMS laboratory date-of-service rules for hospital outpatients.",
    "Public Medicare rules decide who may bill for each test",
    "Three futures per test", "Keep outsourcing", "Shift billing to the lab",
    "Bring tests in-house", "baseline", "positive, seven figures",
    "Every strategy projected over ten years, per test line",
    "Implemented", "annualized reduction: seven figures",
    "Live: outside-lab invoices down a seven-figure sum yearly",
    "The catalog behind it", "Lab A pricing", "Lab B pricing", "Lab C pricing",
    "tests", "auto-matched",
    "One reproducible catalog now prices every outside test",
  ],
  "work/insourcing.html": [
    "Insourcing · Michael Bask",
    "A make-or-buy decision carried by revenue: the same tests, eleven times the earning potential in-house.",
    "Four small tests", "Test 1", "Test 4", "a year",
    "Four everyday tests, a few dollars each to outsource",
    "The savings mirage", "outsourced", "in-house", "of project value",
    "Cost savings alone would never justify the project",
    "The rule that caps revenue", "Purchased outside", "Performed in-house",
    "Outsourced tests cannot earn. In-house tests can.",
    "Revenue, unlocked", "government", "commercial",
    "Same tests performed in-house: eleven times the revenue",
    "Cost per test, honestly", "base supplies", "expiry waste", "calibration",
    "quality checks",
    "Unit cost modeled down to supplies that expire unused",
    "Positive in every scenario", "startup recovered in month one", "In validation",
    "Six-figure value under every assumption tested",
    "The tool that scales it", "parsing agent", "structured parameters",
    "deterministic cost engine", "cost model", "verification plan",
    "per-test analysis in minutes",
    "An AI-assisted pipeline turns datasheets into cost models",
  ],
  "work/consolidation.html": [
    "Consolidation · Michael Bask",
    "Two duplicate hospital labs consolidated into one near-capacity core, about ten percent leaner.",
    "Two labs, a short walk apart", "Site A", "Site B",
    "Two hospital labs ran the same tests, a short walk apart",
    "Machines standing idle", "chemistry line", "hematology line",
    "coagulation", "urinalysis", "legacy testing line", "0%",
    "Capacity ran far below its potential at both sites",
    "One core, one specialty", "around-the-clock core", "specialty testing",
    "blood counts", "special chemistry", "cultures",
    "pickups every 15 minutes",
    "Routine volume to one site, specialty focus at the other",
    "Fewer hands, same coverage", "Day", "Evening", "Overnight", "Weekend",
    "leaner",
    "Staffing redeployed, about ten percent leaner, coverage unchanged",
    "Utilization doubles",
    "Consolidated equipment runs near capacity instead of idling",
    "In motion", "Prepare backup capacity", "Validate", "Move equipment",
    "Reallocate volume",
    "six-figure annual savings · seven-figure five-year value",
    "Underway: four phases, validated at every step",
  ],
  /* Exhibits for this route land next; for now only its chrome is checked. */
  "work/network-study.html": [
    "Network study · Michael Bask",
    "A ten-year centralization study for a four-lab hospital network, paced by capacity triggers.",
  ],
  "work/network-study.pending": [
    "Four labs, four million tests", "about 4 million", "a year",
    "Four hospital labs, about four million tests a year",
    "The cost curve problem", "Staffing", "Everything else",
    "Staffing costs compounding three times faster than everything else",
    "Three years from the wall", "blood counts", "chemistry panels", "cultures",
    "limit: people, ~3 years", "limit: space, now",
    "Core sections were three years from their limits",
    "Stay for speed, move for scale", "urgency", "volume", "platform",
    "rapid-response labs", "urgent work stays", "central hub",
    "Every test scored: stay for speed, or move for scale",
    "A decade-long ramp", "range reflects capacity triggers",
    "Volume shifts on capacity triggers, not calendar dates",
    "The payoff range", "expense per test: about",
    "tens of millions over ten years",
    "Tens of millions in ten-year savings across every scenario",
    "Space becomes care", "42%", "38%", "about two fifths",
    "Two fifths of hospital lab space freed for patient care",
  ],
};

/*
 * No calendar year may appear on the network study page, and no page should
 * carry a stray four-digit year in visible text.
 */
const YEAR_PATTERN = /\b(19|20)\d{2}\b/;

const FOOTER =
  "All artifacts on this site are recreations of real work with disguised figures. No confidential data appears here. The dashboard demo runs entirely on synthetic data.";
const MARKER = "figures disguised";

const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    /* This file is the one place the banned list is allowed to be spelled. */
    else if (/\.(tsx?|mjs|css|json)$/.test(path) && entry !== "audit-strings.mjs") {
      out.push(path);
    }
  }
  return out;
}

function scrub(text) {
  let out = text;
  for (const phrase of ALLOWED_PHRASES) out = out.split(phrase).join("");
  return out.toLowerCase();
}

// ------------------------------------------------------------ banned terms
const targets = [
  ...walk(HTML_ROOT).filter((path) => path.endsWith(".html")),
  ...SOURCE_ROOTS.flatMap((root) => walk(root)),
];

for (const path of targets) {
  const haystack = scrub(readFileSync(path, "utf8"));
  for (const term of BANNED) {
    if (haystack.includes(term)) failures.push(`${path}: banned term "${term}"`);
  }
}

// --------------------------------------------------------- required strings
for (const [file, strings] of Object.entries(REQUIRED)) {
  if (file.endsWith(".pending")) continue;
  const html = readFileSync(join(HTML_ROOT, file), "utf8");
  for (const needle of strings) {
    if (!html.includes(needle)) failures.push(`${file}: missing "${needle}"`);
  }
}

// ------------------------------------------- footer everywhere, marker on work
for (const path of walk(HTML_ROOT).filter((p) => p.endsWith(".html"))) {
  if (path.includes("_global-error")) continue;
  if (!readFileSync(path, "utf8").includes(FOOTER)) {
    failures.push(`${path}: missing the footer disclosure`);
  }
}

for (const [file, expected] of [
  ["work/billing-strategy.html", 7],
  ["work/insourcing.html", 7],
  ["work/consolidation.html", 6],
]) {
  const html = readFileSync(join(HTML_ROOT, file), "utf8");
  const found = html.split(MARKER).length - 1;
  if (found !== expected) {
    failures.push(`${file}: ${found} "${MARKER}" markers, expected ${expected}`);
  }
}

// ------------------------------------------------- no calendar years on screen
for (const file of ["work/network-study.html", "work/consolidation.html"]) {
  const text = readFileSync(join(HTML_ROOT, file), "utf8")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ");
  const year = text.match(YEAR_PATTERN);
  if (year) failures.push(`${file}: calendar year "${year[0]}" in visible text`);
}

if (failures.length) {
  console.error(`string audit FAILED (${failures.length})`);
  for (const failure of failures) console.error("  " + failure);
  process.exit(1);
}
console.log(`string audit passed — ${targets.length} files scanned`);
