"use client";

import { useState } from "react";
import { PANEL_TITLES, PRIORITY_SERIES, VOLUME_SERIES } from "@/content/demo";
import demoData from "@/data/demo.json";
import type { DemoBundle, SiteFilterKey } from "@/lib/demo-types";
import { CHART } from "./chart-theme";
import { HourHeatmap } from "./HourHeatmap";
import { KpiRow } from "./KpiRow";
import { Legend, Panel } from "./Panel";
import { SiteFilter } from "./SiteFilter";
import { TestTable } from "./TestTable";
import { VolumeChart } from "./VolumeChart";
import { WithinTargetChart } from "./WithinTargetChart";

/*
 * The bundle is generated ahead of the build and imported as data, so the
 * dashboard has every view for every filter in hand on first paint: no fetch,
 * no loading state, nothing to wait for.
 */
const bundle = demoData as unknown as DemoBundle;

const VOLUME_LEGEND = [
  { label: VOLUME_SERIES.daily, color: CHART.mark },
  { label: VOLUME_SERIES.movingAverage, color: CHART.accent },
];

const PRIORITY_LEGEND = [
  { label: PRIORITY_SERIES.stat, color: CHART.accent },
  { label: PRIORITY_SERIES.routine, color: CHART.warn, dashed: true },
];

export function DemoDashboard() {
  const [site, setSite] = useState<SiteFilterKey>("all");
  const view = bundle.views[site];
  const days = view.daily.slice(-bundle.windowDays);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-8 sm:px-8">
      <SiteFilter value={site} onChange={setSite} />

      <div className="mt-9">
        <KpiRow kpis={view.kpis} />
      </div>

      <Panel
        title={PANEL_TITLES.dailyVolume}
        legend={<Legend items={VOLUME_LEGEND} />}
      >
        <VolumeChart days={days} />
      </Panel>

      <Panel
        title={PANEL_TITLES.withinTarget}
        legend={<Legend items={PRIORITY_LEGEND} />}
      >
        <WithinTargetChart days={days} />
      </Panel>

      <Panel title={PANEL_TITLES.heatmap}>
        <HourHeatmap matrix={view.heatmap} />
      </Panel>

      <Panel title={PANEL_TITLES.topTests}>
        <TestTable rows={view.tests} />
      </Panel>
    </div>
  );
}
