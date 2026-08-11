"use client";

import { gsap } from "@/lib/gsap";

export type Q = (selector: string) => HTMLElement[];

export type BuildContext = {
  tl: gsap.core.Timeline;
  /** Scoped query — only ever reaches inside this exhibit. */
  q: Q;
  /** Scoped query for exactly one element. */
  one: (selector: string) => HTMLElement | null;
  root: HTMLElement;
};

export type BuildFn = (ctx: BuildContext) => void;

export function makeQuery(root: HTMLElement): Q {
  return (selector: string) =>
    Array.from(root.querySelectorAll<HTMLElement>(selector));
}

/**
 * Counts a number up in place. The element's authored text is its finished
 * value, so a visitor without motion reads the same number this lands on.
 */
export function countTo(
  tl: gsap.core.Timeline,
  target: Element | Element[] | null,
  options: {
    to: number;
    from?: number;
    duration?: number;
    format?: (value: number) => string;
    at?: gsap.Position;
    ease?: string;
  },
) {
  const elements = (Array.isArray(target) ? target : [target]).filter(
    Boolean,
  ) as Element[];
  if (!elements.length) return;

  const format = options.format ?? ((v: number) => String(Math.round(v)));
  const state = { value: options.from ?? 0 };

  for (const element of elements) element.textContent = format(state.value);

  tl.to(
    state,
    {
      value: options.to,
      duration: options.duration ?? 1.1,
      ease: options.ease ?? "power2.out",
      onUpdate() {
        const text = format(state.value);
        for (const element of elements) element.textContent = text;
      },
      onComplete() {
        const text = format(options.to);
        for (const element of elements) element.textContent = text;
      },
    },
    options.at ?? "<",
  );
}

/** Reveal helper. fromTo, never from, so the finished state is stated outright. */
export function reveal(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  options: {
    y?: number;
    x?: number;
    duration?: number;
    stagger?: number;
    at?: gsap.Position;
    ease?: string;
  } = {},
) {
  tl.fromTo(
    targets,
    { autoAlpha: 0, y: options.y ?? 10, x: options.x ?? 0 },
    {
      autoAlpha: 1,
      y: 0,
      x: 0,
      duration: options.duration ?? 0.5,
      stagger: options.stagger ?? 0,
      ease: options.ease ?? "power2.out",
    },
    options.at,
  );
}

/** Grows a bar from a chosen edge. Scaled groups hold flat shapes only. */
export function growBar(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  options: {
    axis?: "x" | "y";
    origin?: string;
    duration?: number;
    stagger?: number;
    at?: gsap.Position;
    ease?: string;
  } = {},
) {
  const axis = options.axis ?? "x";
  const origin = options.origin ?? (axis === "x" ? "0% 50%" : "50% 100%");
  tl.fromTo(
    targets,
    {
      autoAlpha: 1,
      transformOrigin: origin,
      [axis === "x" ? "scaleX" : "scaleY"]: 0,
    },
    {
      [axis === "x" ? "scaleX" : "scaleY"]: 1,
      transformOrigin: origin,
      duration: options.duration ?? 0.85,
      stagger: options.stagger ?? 0.07,
      ease: options.ease ?? "power2.out",
    },
    options.at,
  );
}

/**
 * Draws a path left to right. Paths carry pathLength="1", so no runtime
 * measurement is needed and a resize cannot desynchronise the dash.
 */
export function drawLine(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  options: {
    duration?: number;
    stagger?: number;
    at?: gsap.Position;
    ease?: string;
  } = {},
) {
  tl.fromTo(
    targets,
    { autoAlpha: 1, strokeDasharray: 1, strokeDashoffset: 1 },
    {
      strokeDashoffset: 0,
      duration: options.duration ?? 1.4,
      stagger: options.stagger ?? 0.2,
      ease: options.ease ?? "none",
    },
    options.at,
  );
}
