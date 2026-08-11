"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  /*
   * Mobile browsers fire resize every time the URL bar slides away. Without
   * this, every one of those recomputes trigger positions mid-scroll. Safe
   * here because nothing on the site is pinned.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/** Trigger positions are measured against final font metrics, not fallbacks. */
export function refreshAfterFonts() {
  if (typeof document === "undefined") return;
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (!fonts) return;
  fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
