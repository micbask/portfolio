"use client";

import { useRef } from "react";
import { DisguisedMarker } from "@/components/site/DisguisedMarker";
import { makeQuery, type BuildFn } from "@/lib/anim";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useWorkPage } from "./WorkPage";

export function ExhibitSection({
  index,
  title,
  caption,
  footnote,
  build,
  children,
}: {
  index: number;
  title: string;
  caption: string;
  footnote?: string;
  build?: BuildFn;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const api = useWorkPage();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root || !api) return;

      const timeline = gsap.timeline({ paused: true });
      let started = false;

      const start = (instant: boolean) => {
        if (started) return;
        started = true;
        if (instant) timeline.progress(1);
        else timeline.play();
      };
      const complete = () => {
        started = true;
        timeline.progress(1);
      };

      const unregister = api.register(index, { element: root, complete });

      // Rail tracking runs for everyone, including visitors without motion.
      ScrollTrigger.create({
        trigger: root,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => api.setActive(index),
        onEnterBack: () => api.setActive(index),
      });

      if (!build || prefersReducedMotion()) return unregister;

      try {
        build({ tl: timeline, q: makeQuery(root), one: (s) => root.querySelector(s), root });
      } catch {
        // Rather than leave the exhibit blank, give up on motion and show it.
        document.documentElement.classList.add("motion-failed");
        return unregister;
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top 65%",
        once: true,
        onEnter: () => start(false),
      });

      /*
       * Settle whatever the initial scroll position already decided: an exhibit
       * scrolled past on reload is finished, one sitting in view builds now.
       */
      const rect = root.getBoundingClientRect();
      if (rect.bottom <= 0) start(true);
      else if (rect.top < window.innerHeight * 0.65) start(false);

      return unregister;
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      className="exhibit-step flex flex-col justify-center px-5 py-14 sm:px-10 sm:py-16"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="font-serif text-[22px] leading-tight tracking-[-0.01em] sm:text-[28px]">
          {title}
        </h2>

        <div className="mt-6 sm:mt-8">{children}</div>

        {footnote ? (
          <p className="mt-5 max-w-2xl text-[11px] leading-relaxed text-ink-faint">
            {footnote}
          </p>
        ) : null}

        <div className="mt-7 flex items-end justify-between gap-6 border-t border-rule pt-3">
          <p className="max-w-xl text-[13px] leading-snug text-ink-muted sm:text-sm">
            {caption}
          </p>
          <DisguisedMarker className="shrink-0 pb-[2px]" />
        </div>
      </div>
    </section>
  );
}
