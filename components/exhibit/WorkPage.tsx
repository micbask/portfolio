"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BACK_TO_GALLERY, ROUTES } from "@/content/site";
import { prefersReducedMotion, refreshAfterFonts } from "@/lib/gsap";
import { ProgressRail } from "./ProgressRail";

type SectionEntry = {
  element: HTMLElement;
  /** Snap this exhibit to its finished state without playing the build. */
  complete: () => void;
};

type WorkPageApi = {
  register: (index: number, entry: SectionEntry) => () => void;
  setActive: (index: number) => void;
};

const WorkPageContext = createContext<WorkPageApi | null>(null);

export function useWorkPage() {
  return useContext(WorkPageContext);
}

export function WorkPage({
  label,
  titles,
  children,
}: {
  label: string;
  titles: readonly string[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const sections = useRef(new Map<number, SectionEntry>());

  const register = useCallback((index: number, entry: SectionEntry) => {
    sections.current.set(index, entry);
    return () => {
      if (sections.current.get(index) === entry) sections.current.delete(index);
    };
  }, []);

  const api = useMemo<WorkPageApi>(() => ({ register, setActive }), [register]);

  /*
   * A jump can vault past exhibits that have never built. Those are settled to
   * their finished state first, so nothing starts animating off-screen and
   * nothing is left half-drawn behind the visitor.
   */
  const jumpTo = useCallback(
    (index: number) => {
      const target = sections.current.get(index);
      if (!target) return;
      for (const [otherIndex, entry] of sections.current) {
        if (otherIndex < index) entry.complete();
      }
      const distance = Math.abs(index - active);
      target.element.scrollIntoView({
        behavior: distance > 1 || prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },
    [active],
  );

  useEffect(() => {
    refreshAfterFonts();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      let next: number | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        next = Math.min(active + 1, titles.length - 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        next = Math.max(active - 1, 0);
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = titles.length - 1;
      }
      if (next === null) return;

      /*
       * If the exhibit is taller than the viewport, arrow keys stay with the
       * browser so the rest of it can still be reached.
       */
      const current = sections.current.get(active);
      const overflows =
        current && current.element.scrollHeight > window.innerHeight + 4;
      if (overflows && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        return;
      }

      event.preventDefault();
      jumpTo(next);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, jumpTo, titles.length]);

  return (
    <WorkPageContext.Provider value={api}>
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

      <ProgressRail titles={titles} active={active} onSelect={jumpTo} />

      <main className="pt-12">{children}</main>
    </WorkPageContext.Provider>
  );
}
