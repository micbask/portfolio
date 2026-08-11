import type { Metadata } from "next";
import Link from "next/link";
import { DemoDashboard } from "@/components/demo/DemoDashboard";
import { DEMO_BADGE } from "@/content/demo";
import { BACK_TO_GALLERY, ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: ROUTES.demo.title,
  description: ROUTES.demo.description,
  openGraph: {
    title: ROUTES.demo.title,
    description: ROUTES.demo.description,
    type: "website",
  },
};

export default function DemoPage() {
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
          {ROUTES.demo.label}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          <span aria-hidden className="h-1 w-1 rounded-full bg-ink-faint/70" />
          {DEMO_BADGE}
        </span>
      </div>

      <main className="pt-12">
        <DemoDashboard />
      </main>
    </>
  );
}
