"use client";

import { createContext, useContext } from "react";

/*
 * Geometry lives in the SVG and scales with the figure; every word lives in
 * HTML on top of it and keeps a real pixel size. A viewBox that scaled its own
 * text would render axis labels at about five pixels on a phone, which is the
 * one place this site has to be readable.
 */

type CanvasSize = { width: number; height: number };

const CanvasContext = createContext<CanvasSize>({ width: 100, height: 100 });

export function ChartCanvas({
  width,
  height,
  maxWidth = 860,
  className = "",
  children,
}: {
  width: number;
  height: number;
  maxWidth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <CanvasContext.Provider value={{ width, height }}>
      <div
        className={`relative mx-auto w-full ${className}`}
        style={{ aspectRatio: `${width} / ${height}`, maxWidth: `${maxWidth}px` }}
      >
        {children}
      </div>
    </CanvasContext.Provider>
  );
}

/** The scaling layer. Shapes only — no text ever goes in here. */
export function CanvasShapes({ children }: { children: React.ReactNode }) {
  const { width, height } = useContext(CanvasContext);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      {children}
    </svg>
  );
}

type Anchor = "start" | "middle" | "end";

const ANCHOR_X: Record<Anchor, string> = {
  start: "0%",
  middle: "-50%",
  end: "-100%",
};

/** A label pinned to a point in chart coordinates, sized in CSS pixels. */
export function CanvasLabel({
  x,
  y,
  anchor = "middle",
  vAlign = "middle",
  className = "",
  dataEl,
  animate = false,
  children,
}: {
  x: number;
  y: number;
  anchor?: Anchor;
  vAlign?: "top" | "middle" | "bottom";
  className?: string;
  dataEl?: string;
  animate?: boolean;
  children: React.ReactNode;
}) {
  const { width, height } = useContext(CanvasContext);
  const translateY =
    vAlign === "middle" ? "-50%" : vAlign === "bottom" ? "-100%" : "0%";

  /*
   * Two spans on purpose: the outer one owns the transform that does the
   * positioning, the inner one is what the timeline moves. One element cannot
   * hold both, because GSAP would overwrite the placement.
   */
  return (
    <span
      className="pointer-events-none absolute whitespace-nowrap"
      style={{
        left: `${(x / width) * 100}%`,
        top: `${(y / height) * 100}%`,
        transform: `translate(${ANCHOR_X[anchor]}, ${translateY})`,
      }}
    >
      <span
        {...(dataEl ? { "data-el": dataEl } : {})}
        {...(animate ? { "data-anim": "" } : {})}
        className={`block ${className}`}
      >
        {children}
      </span>
    </span>
  );
}
