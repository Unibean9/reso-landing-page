import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function AppLogo({ size = 28, className, priority }: AppLogoProps) {
  return (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={375}
      height={375}
      priority={priority}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
