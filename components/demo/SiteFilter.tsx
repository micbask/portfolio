"use client";

import { SITE_FILTERS } from "@/content/demo";
import type { SiteFilterKey } from "@/lib/demo-types";

export function SiteFilter({
  value,
  onChange,
}: {
  value: SiteFilterKey;
  onChange: (next: SiteFilterKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule">
      {SITE_FILTERS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`-mb-px border-b pb-2 text-[13px] transition-colors ${
              active
                ? "border-accent text-accent"
                : "border-transparent text-ink-faint hover:text-ink-muted"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
