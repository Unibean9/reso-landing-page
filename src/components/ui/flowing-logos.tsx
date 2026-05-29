"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  image?: string;
  icon?: React.ReactNode;
}

interface FlowingLogosProps {
  logos: Logo[];
  className?: string;
  speed?: string;
}

function BrandMark({ logo }: { logo: Logo }) {
  if (logo.image) {
    return (
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-background shadow-sm">
        <Image
          src={logo.image}
          alt={logo.name}
          width={40}
          height={40}
          className="size-full object-cover"
        />
      </span>
    );
  }

  if (logo.icon) {
    return <span className="size-5 shrink-0">{logo.icon}</span>;
  }

  return null;
}

function LogoStrip({ logos, stripKey }: { logos: Logo[]; stripKey: string }) {
  return (
    <div className="flex shrink-0 items-center gap-14 pr-14">
      {logos.map((logo, i) => (
        <div
          key={`${stripKey}-${logo.name}-${i}`}
          className="flex shrink-0 items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <BrandMark logo={logo} />
          <span className="whitespace-nowrap text-base font-semibold tracking-tight md:text-lg">
            {logo.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function FlowingLogos({ logos, className, speed = "18s" }: FlowingLogosProps) {
  const filled = Array.from({ length: 6 }, () => logos).flat();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="flex w-max will-change-transform"
        style={{ animation: `marquee ${speed} linear infinite` }}
      >
        <LogoStrip logos={filled} stripKey="a" />
        <div aria-hidden>
          <LogoStrip logos={filled} stripKey="b" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-background to-transparent" />
    </div>
  );
}
