"use client";

import { FlowingLogos } from "@/components/ui/flowing-logos";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

export interface LogoItem {
  name: string;
  image?: string;
  icon?: React.ReactNode;
}

interface LogoCloudProps {
  label?: string;
  logos?: LogoItem[];
  className?: string;
}

const defaultLogos: LogoItem[] = [
  { name: "BEATEA", image: "/assets/beatea.jpeg" },
  { name: "DEER COFFEE", image: "/assets/deer.jpeg" },
  { name: "PASSIO", image: "/assets/passio.jpeg" },
];

export default function LogoCloud({
  label = "Các nhãn hàng đáng tin cậy",
  logos = defaultLogos,
  className,
}: LogoCloudProps) {
  return (
    <section className={cn("border-y border-border py-14", className)}>
      <FadeIn>
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </FadeIn>
      <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <FlowingLogos logos={logos} />
      </div>
    </section>
  );
}
