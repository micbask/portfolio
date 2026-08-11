# micbask.com Build Spec

Self-contained build document. Everything a builder needs is on this page: no source files, no prior context. All values below are synthetic by design; build them exactly as written.

## Global rules

1. Every exhibit is an original HTML/SVG recreation carrying a small "figures disguised" marker.
2. Site-facing text is exactly what appears in quotes in this document. Do not add names of employers, companies, products, equipment brands, or clinical test terminology anywhere, including alt text, ARIA labels, code comments shipped to the client, and image filenames.
3. Motion: GSAP ScrollTrigger is the only animation engine on exhibit pages; animate transform and opacity only; one exhibit per viewport step; full static fallback under prefers-reduced-motion; plain vertical scroll must work on phones.
4. The numbers in this spec are the shipped numbers. Never "correct" them against any other source.

## Site map and metadata

All strings in this table are site-facing. Business-problem names only; this rule also applies to any future route, title, or metadata string.

| Route | On-page label | Browser tab title | Link-preview description |
|---|---|---|---|
| / | none (bare gallery) | Michael Bask | Selected healthcare operations, finance, and strategy work, shown as recreated exhibits with disguised figures. |
| /demo | Demo | Dashboard demo · Michael Bask | A hospital lab operations dashboard demo, running entirely on synthetic data. |
| /work/billing-strategy | Billing strategy | Billing strategy · Michael Bask | Who gets to bill for outsourced testing under public Medicare rules, and the seven-figure result. |
| /work/consolidation | Consolidation | Consolidation · Michael Bask | Two duplicate hospital labs consolidated into one near-capacity core, about ten percent leaner. |
| /work/insourcing | Insourcing | Insourcing · Michael Bask | A make-or-buy decision carried by revenue: the same tests, eleven times the earning potential in-house. |
| /work/network-study | Network study | Network study · Michael Bask | A ten-year centralization study for a four-lab hospital network, paced by capacity triggers. |

Link-preview (Open Graph) image: one shared typographic card, "Michael Bask" plus "Selected work", neutral palette, no logos, no photos. Favicon: plain monogram. Each work page shows its on-page label small at the top, a back link to the gallery, and a thin progress rail; no other chrome.

## Homepage (/)

Header: "Michael Bask" left. Right: "LinkedIn" → https://www.linkedin.com/in/mbask/ and "Email" → mailto:micbask@gmail.com. A third slot is reserved for "Resume" and stays absent until a PDF is provided. No tagline, no headline, no photo, no intro, no credential line.

| Tile | Content | Caption (site-facing) |
|---|---|---|
| Featured, top | Live preview thumbnail of the /demo dashboard, open action | "A hospital lab operations dashboard. Synthetic data, live." |
| 1 → /work/billing-strategy | Thumbnail: the exhibit 4 decision flow, static | "Outside-lab spend, re-decided under public billing rules" |
| 2 → /work/consolidation | Thumbnail: the exhibit 5 utilization before/after bars, static | "Two duplicate labs consolidated into one core" |
| 3 → /work/insourcing | Thumbnail: the exhibit 4 revenue bar at 11x, static | "A make-or-buy case won on revenue, not cost" |
| 4 → /work/network-study | Thumbnail: the exhibit 5 allocation ramp, static | "A ten-year centralization study for a lab network" |

Footer, exact text, on every page: "All artifacts on this site are recreations of real work with disguised figures. No confidential data appears here. The dashboard demo runs entirely on synthetic data."

## Demo (/demo)

A build-time generator (seed 20260806) produces one static JSON bundle committed with the site; no runtime randomness, no backend, no login, no empty states. Persistent badge: "Demo: synthetic data." Recharts permitted on this page only.

Generator parameters, exact:

- Two fictional sites: "Riverside General" and "Hillcrest Specialty". Site filter toggles all views.
- 90 days ending at build date. Daily test volume: Riverside weekday mean 1,450, sd 90; weekend 62 percent of weekday. Hillcrest weekday mean 640, sd 55; weekend 70 percent. Add a mild +0.05 percent/day drift.
- Priority mix: 28 percent STAT, 72 percent routine.
- Turnaround: STAT median 42 minutes against a 60-minute target, 91 percent within target; routine median 3.1 hours against a 4-hour target, 88 percent within target. Sample from lognormal shapes around those medians.
- KPI row (computed from the data, will land near): today's volume 2,113; STAT within target 91.2 percent; median STAT turnaround 42 min; 7-day volume trend +3.4 percent.
- Views: (1) KPI row; (2) 30-day daily volume line with 7-day average; (3) within-target percent by priority over time; (4) hour-of-day by day-of-week volume heatmap with peaks at 07:00 to 10:00 and 14:00 to 16:00; (5) top-10 table with volume, median turnaround, and trend arrow, rows: Complete blood count, Basic metabolic panel, Comprehensive metabolic panel, Urinalysis, Lipid panel, Thyroid screen, Coagulation screen, Blood glucose, Liver panel, Electrolytes.

## /work/billing-strategy (7 exhibits)

| # | Exhibit and build, with exact values | Caption (site-facing) |
|---|---|---|
| 1 | "The spend curve": two indexed lines, five periods labeled "Y1" to "Y5". Outside-lab spend: 100, 125, 156, 195, 244. Total lab expense: 100, 105, 110, 116, 122. Lines draw on scroll; gap counter ends "growing ~25% vs ~5% a year". Y axis labeled "indexed, Y1 = 100" | "Outside-lab spend grew five times faster than the lab itself" |
| 2 | "Six labs, wild unit economics": six rows labeled Lab A to Lab F, ordered by spend share bars: C 31, B 27, A 24, F 8, D 7, E 3 (percent of spend). Cost-per-test dots on a log scale: A $45, B $55, C $700, D $150, E $1,600, F $1,800. Dots pop in last | "Six outside labs. Cost per test varied forty-fold." |
| 3 | "Billed is not collected": paired bars, indexed. Inpatient: invoiced 45, collected 15. Outpatient: invoiced 55, collected 33. Net gap band highlights 52. Axis labeled "indexed" | "On these tests, collections covered barely half the invoices" |
| 4 | **Centerpiece.** "Who is allowed to bill?": animated decision flow. One test chip travels and branches light: "Inpatient" → "Bundled into the hospital stay. No separate payment." "Outpatient" → "On Medicare's exception list for advanced tests?" → Yes: "The performing lab may bill Medicare directly." No: "The hospital bills, capped at the lower of cost or fee schedule." Then 100 small chips stream: 30 to inpatient, 55 to lab-bills-directly, 15 to hospital-bills-capped. Footnote, exact: "Simplified view of the CMS laboratory date-of-service rules for hospital outpatients." | "Public Medicare rules decide who may bill for each test" |
| 5 | "Three futures per test": three small-multiple panels, cumulative 10-year incremental value, indexed. "Keep outsourcing": flat zero baseline. "Shift billing to the lab": 10, 20, 30, 40, 50, 60, 70, 80, 90, 100. "Bring tests in-house": -15, 5, 25, 45, 62, 77, 90, 101, 111, 120. NPV counters: "baseline", "positive, seven figures", "positive, seven figures" | "Every strategy projected over ten years, per test line" |
| 6 | "Implemented": 24 monthly points of invoice cost, indexed. Months 1 to 12: 101, 99, 103, 98, 102, 100, 104, 97, 101, 99, 102, 100. Go-live marker after month 12. Months 13 to 24: 78, 64, 55, 53, 51, 54, 52, 50, 53, 51, 52, 52. End counter, exact: "annualized reduction: seven figures" | "Live: outside-lab invoices down a seven-figure sum yearly" |
| 7 | "The catalog behind it": schematic; three source-file icons labeled "Lab A pricing", "Lab B pricing", "Lab C pricing" flow into a matcher block, out to one master row per test with QC flags. Counters: "~1,700 tests" and ">90% auto-matched" | "One reproducible catalog now prices every outside test" |

## /work/consolidation (6 exhibits)

Sites are "Site A" and "Site B" everywhere. No real percentages exist on this page; use only the values below.

| # | Exhibit and build, with exact values | Caption (site-facing) |
|---|---|---|
| 1 | "Two labs, a short walk apart": abstract two-building diagram; two test-menu circles slide together into heavy overlap (visual only, no counts shown) | "Two hospital labs ran the same tests, a short walk apart" |
| 2 | "Machines standing idle": horizontal utilization bars. Site A: chemistry line 34%, hematology line 45%, coagulation 9%, urinalysis 12%. Site B: chemistry line 38%, hematology line 48%, coagulation 15%, urinalysis 8%, legacy testing line 0% (render the zero with a "0%" tag) | "Capacity ran far below its potential at both sites" |
| 3 | "One core, one specialty": before/after diagram; generic test chips (chemistry, blood counts, coagulation, urinalysis) sort to Site A labeled "around-the-clock core"; chips (special chemistry, cultures) sort to Site B labeled "specialty testing". A courier loop pulses between them tagged "pickups every 15 minutes" | "Routine volume to one site, specialty focus at the other" |
| 4 | "Fewer hands, same coverage": staffing blocks by shift morph. Before: Day 18, Evening 10, Overnight 7, Weekend 5 (total 40). After: Day 16, Evening 9, Overnight 6, Weekend 5 (total 36). Counter: "about 10% leaner". No totals displayed as numbers, blocks only plus the percent | "Staffing redeployed, about ten percent leaner, coverage unchanged" |
| 5 | "Utilization doubles": two bar pairs grow on scroll. Chemistry: 26% → 82%. Hematology: 23% → 79% | "Consolidated equipment runs near capacity instead of idling" |
| 6 | "In motion": four-phase horizontal band: "Prepare backup capacity", "Validate", "Move equipment", "Reallocate volume"; phase 2 rendered active with a subtle pulse; no dates anywhere. Closing stat row, exact: "six-figure annual savings · seven-figure five-year value" | "Underway: four phases, validated at every step" |

## /work/insourcing (7 exhibits)

| # | Exhibit and build, with exact values | Caption (site-facing) |
|---|---|---|
| 1 | "Four small tests": four chips labeled "Test 1" to "Test 4" with volume dots 1,300, 1,000, 1,900, 1,500 (total callout "~5,700 a year") and small coin glyphs sized 2, 1, 2, 3 coins (no dollar figures) | "Four everyday tests, a few dollars each to outsource" |
| 2 | "The savings mirage": two cost bars, outsourced 100 vs in-house 94 (indexed); the sliver of 6 highlights with counter "savings: ~2% of project value" | "Cost savings alone would never justify the project" |
| 3 | "The rule that caps revenue": two-lane mini flow. Lane 1 "Purchased outside": billing capped at cost. Lane 2 "Performed in-house": the hospital bills its own price list. No other pricing language anywhere on this exhibit | "Outsourced tests cannot earn. In-house tests can." |
| 4 | "Revenue, unlocked": one bar grows 1x → 11x with a payer split shading inside the final bar: 45 government, 55 commercial (indexed shares, unlabeled beyond "government / commercial"). No text about how the in-house price is set | "Same tests performed in-house: eleven times the revenue" |
| 5 | "Cost per test, honestly": stacked build-up, indexed to 100: base supplies 60, expiry waste 14, calibration 4, quality checks 22. An expiring-kit motif dims unused units as a small clock sweeps | "Unit cost modeled down to supplies that expire unused" |
| 6 | "Positive in every scenario": six bars, indexed: 100, 70, 40, 95, 65, 35, grouped as three payer cases by two billing baselines, all above a zero line. Note, exact: "startup recovered in month one". Status tag, exact: "In validation" | "Six-figure value under every assumption tested" |
| 7 | "The tool that scales it": pipeline schematic: datasheet PDF icon → "parsing agent" → "structured parameters" → "deterministic cost engine" → two output docs ("cost model", "verification plan"). Tagline, exact: "per-test analysis in minutes" | "An AI-assisted pipeline turns datasheets into cost models" |

## /work/network-study (7 exhibits)

Framed as a consolidation study for an anonymized multi-site network. No building or facility names, no geography, no calendar years, no square footage, no service-line names.

| # | Exhibit and build, with exact values | Caption (site-facing) |
|---|---|---|
| 1 | "Four labs, four million tests": four nodes sized by annual volume: 1.6M, 1.0M, 0.85M, 0.55M (total callout "about 4 million"); growth counter ticks to "about 5.5% a year" | "Four hospital labs, about four million tests a year" |
| 2 | "The cost curve problem": two indexed lines over ten periods. Staffing: 100, 109, 119, 130, 141, 154, 168, 183, 199, 217, 237. Everything else: 100, 103, 106, 109, 113, 116, 119, 123, 127, 130, 134. A shaded fan of ±15 percent opens around the staffing line after period 5 | "Staffing costs compounding three times faster than everything else" |
| 3 | "Three years from the wall": three capacity gauges: "blood counts" 88% tagged "limit: people, ~3 years", "chemistry panels" 91% tagged "limit: people, ~3 years", "cultures" 100% tagged "limit: space, now" | "Core sections were three years from their limits" |
| 4 | "Stay for speed, move for scale": 100 test chips stream through a scorer with three criteria chips ("urgency", "volume", "platform"); 30 sort to "rapid-response labs" (callout "urgent work stays"), 70 to "central hub" | "Every test scored: stay for speed, or move for scale" |
| 5 | "A decade-long ramp": stacked area over ten periods; hub-share band, low bound 0, 15, 19, 23, 27, 30, 34, 37, 40, 43, 45 and high bound 0, 35, 40, 44, 48, 55, 58, 62, 65, 68, 70 (percent), remainder stays with the four labs. Band labeled "range reflects capacity triggers" | "Volume shifts on capacity triggers, not calendar dates" |
| 6 | "The payoff range": eight-line sensitivity fan of cumulative savings, indexed final values 20, 45, 60, 75, 100, 120, 135, 150 (base case 100, drawn heavier); side counter falls "expense per test: about -19%". Magnitude label, exact: "tens of millions over ten years" | "Tens of millions in ten-year savings across every scenario" |
| 7 | "Space becomes care": two floor-plan-style blocks; shaded portions animate free: 42% of one, 38% of the other; joint callout "about two fifths" | "Two fifths of hospital lab space freed for patient care" |
