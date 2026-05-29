"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ColumnLines } from "@/components/ui/column-lines";
import { Announcement } from "@/components/ui/announcement";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroProps {
  announcementBadge?: string;
  announcementText?: string;
  announcementHref?: string;
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export default function Hero({
  announcementBadge = "Mới",
  announcementText = "Hạng thành viên & đổi thưởng — đã ra mắt",
  announcementHref = "#",
  headline = "Tích điểm thông minh.",
  description =
    "Hệ thống loyalty giúp khách hàng tích điểm, lên hạng Bronze → Gold và nhận ưu đãi tại mọi thương hiệu đối tác. Quản lý tập trung, triển khai chỉ trong vài ngày.",
  primaryCtaText = "Sử dụng app ngay",
  primaryCtaHref = "#contact",
  secondaryCtaText = "Xem tính năng",
  secondaryCtaHref = "#features",
  className,
}: HeroProps) {
  return (
    <ColumnLines
      columnWidth={80}
      columnCount={16}
      radialFadeStart={25}
      radialFadeEnd={65}
      noiseOpacity={0.04}
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center bg-app-bg pb-0",
        className
      )}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-5 pt-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex w-full justify-center"
        >
          <Announcement badge={announcementBadge} href={announcementHref}>
            {announcementText}
          </Announcement>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-7 w-full text-center text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-7 w-full max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center"
        >
          <ShinyButton href={primaryCtaHref} className="gap-2 px-7 py-3 text-sm">
            {primaryCtaText} <ArrowRight className="size-4" />
          </ShinyButton>
          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-7 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent"
          >
            {secondaryCtaText}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mt-12 w-full sm:mt-16"
        >
          <Image
            src="/assets/hero.svg"
            alt="Giao diện ứng dụng RESO — hệ thống tích điểm"
            width={2610}
            height={1779}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="block h-auto w-full max-w-full"
          />
        </motion.div>
      </div>
    </ColumnLines>
  );
}
