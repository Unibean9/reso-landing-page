"use client";

import Link from "next/link";
import { AppLogo } from "@/components/app-logo";
import { navLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { ModeToggle } from "@/components/mode-toggle";
import { ShinyButton } from "@/components/ui/shiny-button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function Navbar({
  ctaText = "Bắt đầu ngay",
  ctaHref = "#contact",
  className,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent",
        className
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <AppLogo
            size={32}
            className="transition-transform group-hover:scale-105"
          />
          <span className="text-sm font-bold tracking-tight">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <ShinyButton href={ctaHref} className="hidden sm:inline-flex">
            {ctaText}
          </ShinyButton>
          <button
            onClick={() => setOpen(!open)}
            className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-border pt-3">
            <ShinyButton href={ctaHref} className="w-full justify-center">
              {ctaText}
            </ShinyButton>
          </div>
        </div>
      )}
    </header>
  );
}
