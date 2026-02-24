"use client";

import FastMarquee from "react-fast-marquee";

import { cn } from "utils";

import type { HTMLAttributes } from "react";

export type MarqueeProps = HTMLAttributes<HTMLDivElement>;

export const Marquee = ({ className, ...properties }: MarqueeProps) => (
  <div className={cn("relative w-full overflow-hidden", className)} {...(properties as any)} />
);

export type MarqueeContentProps = any;

export const MarqueeContent = ({
  loop = 0,
  autoFill = true,
  pauseOnHover = true,
  ...properties
}: MarqueeContentProps) => (
  <FastMarquee autoFill={autoFill} loop={loop} pauseOnHover={pauseOnHover} {...properties} />
);

export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
  side: "left" | "right";
};

export const MarqueeFade = ({ className, side, ...properties }: MarqueeFadeProps) => (
  <div
    className={cn(
      "from-background absolute inset-y-0 z-10 h-full w-24 to-transparent",
      side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
      className
    )}
    {...(properties as any)}
  />
);

export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;

export const MarqueeItem = ({ className, ...properties }: MarqueeItemProps) => (
  <div className={cn("mx-2 shrink-0 object-contain", className)} {...(properties as any)} />
);
