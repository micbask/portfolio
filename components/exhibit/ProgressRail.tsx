"use client";

export function ProgressRail({
  titles,
  active,
  onSelect,
}: {
  titles: readonly string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const progress = (active + 1) / titles.length;

  return (
    <>
      {/* Phones: a hairline of progress under the top bar. */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-[45px] z-30 h-px bg-rule/60 sm:hidden"
      >
        <div
          className="h-px origin-left bg-accent transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Wider screens: a tick per exhibit, each one a jump target. */}
      <nav className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
        {titles.map((title, index) => (
          <button
            key={title}
            type="button"
            aria-label={title}
            aria-current={index === active ? "true" : undefined}
            onClick={() => onSelect(index)}
            className="group flex h-3 items-center justify-end"
          >
            <span
              className={`block h-px origin-right transition-all duration-300 ${
                index === active
                  ? "w-6 bg-accent"
                  : "w-3 bg-ink-faint/50 group-hover:w-5 group-hover:bg-ink-faint"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
