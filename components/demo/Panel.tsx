/** One titled block: small tracked label, hairline rule, content under it. */
export function Panel({
  title,
  legend,
  children,
}: {
  title: string;
  legend?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {title}
        </h2>
        {legend}
      </div>
      <div className="mt-4 border-t border-rule pt-6">{children}</div>
    </section>
  );
}

/** Series key used beside a panel title. */
export function Legend({
  items,
}: {
  items: readonly { label: string; color: string; dashed?: boolean }[];
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2 text-[11px] text-ink-muted"
        >
          <svg aria-hidden viewBox="0 0 20 2" className="h-0.5 w-5">
            <line
              x1="0"
              y1="1"
              x2="20"
              y2="1"
              stroke={item.color}
              strokeWidth="1.75"
              strokeDasharray={item.dashed ? "4 3" : undefined}
            />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
