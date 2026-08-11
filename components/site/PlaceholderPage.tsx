import Link from "next/link";
import { BACK_TO_GALLERY, ROUTES } from "@/content/site";

/*
 * A route that exists so its gallery tile leads somewhere, carrying only the
 * chrome the spec defines for it: the label, the way back, and the footer the
 * root layout already provides. Its exhibits arrive in the next phase.
 */
export function PlaceholderPage({ label }: { label: string }) {
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex items-baseline gap-4 border-b border-rule/70 bg-ground/85 px-5 py-3 backdrop-blur-sm sm:px-8">
        <Link
          href={ROUTES.home.path}
          className="text-[13px] text-ink-muted transition-colors hover:text-ink"
        >
          {BACK_TO_GALLERY}
        </Link>
        <span className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">
          {label}
        </span>
      </div>
      <main className="min-h-[60svh] pt-12" />
    </>
  );
}
