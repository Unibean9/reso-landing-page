"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { Twitter, Github, Linkedin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface FooterColumn {
  heading: string;
  links: { text: string; url: string }[];
}

interface FooterProps {
  brandName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  copyright?: string;
  legalLinks?: { text: string; url: string }[];
  className?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    heading: "Sản phẩm",
    links: [
      { text: "Tính năng", url: "#features" },
      { text: "Cách hoạt động", url: "#how-it-works" },
      { text: "Đánh giá", url: "#testimonials" },
    ],
  },
  {
    heading: "Công ty",
    links: [
      { text: "Giới thiệu", url: "#" },
      { text: "Blog", url: "#" },
      { text: "Tuyển dụng", url: "#" },
      { text: "Liên hệ", url: "#" },
    ],
  },
  {
    heading: "Tài nguyên",
    links: [
      { text: "Tài liệu", url: "#" },
      { text: "API", url: "#" },
      { text: "Trạng thái", url: "#" },
      { text: "Câu hỏi thường gặp", url: "#faq" },
    ],
  },
];

const defaultLegalLinks = [
  { text: "Điều khoản", url: "#" },
  { text: "Quyền riêng tư", url: "#" },
  { text: "Cookie", url: "#" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Footer({
  brandName = siteConfig.name,
  tagline = siteConfig.description,
  columns = defaultColumns,
  socials = { twitter: "#", github: "#", linkedin: "#" },
  copyright = `© ${new Date().getFullYear()} ${siteConfig.name}. Bảo lưu mọi quyền.`,
  legalLinks = defaultLegalLinks,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-background select-none",
        className,
      )}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-16"
      >
        <motion.p
          variants={itemVariants}
          className="mb-10 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
        >
          {tagline}
        </motion.p>

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-3 md:gap-x-16">
            {columns.map((col, ci) => (
              <motion.div key={ci} variants={itemVariants}>
                <p className="mb-4 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link, li) => (
                    <li key={li}>
                      <Link
                        href={link.url}
                        className="text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="md:text-right">
            <p className="mb-4 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Mạng xã hội
            </p>
            <div className="flex items-center gap-3 md:justify-end">
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-accent hover:text-foreground"
                >
                  <Twitter className="size-3.5" />
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-accent hover:text-foreground"
                >
                  <Github className="size-3.5" />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-accent hover:text-foreground"
                >
                  <Linkedin className="size-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-12 border-t border-border"
        />

        <motion.div
          variants={itemVariants}
          className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-xs text-muted-foreground">{copyright}</p>
          <div className="flex items-center gap-5">
            {legalLinks.map((l, i) => (
              <Link
                key={i}
                href={l.url}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.text}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="pointer-events-none inset-x-0 mt-8 bg-linear-to-b from-foreground/8 to-foreground/2 bg-clip-text pb-6 text-center font-bold text-transparent select-none dark:from-uni-teal-300/15 dark:to-foreground/5"
        style={{ fontSize: "clamp(3rem, 15vw, 13rem)" }}
        aria-hidden
      >
        {brandName}
      </motion.p>
    </footer>
  );
}

export { Footer as FooterWithFadedBrand };
