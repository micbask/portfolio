import { DISGUISED_MARKER } from "@/content/site";

export function DisguisedMarker({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-faint ${className}`}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-ink-faint/70" />
      {DISGUISED_MARKER}
    </span>
  );
}
