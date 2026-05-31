"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  FileCheck2,
  FileText,
  Gift,
  Globe,
  IdCard,
  Info,
  Landmark,
  Lock,
  Scale,
  Shield,
  ShieldAlert,
  UserCheck,
  Wallet,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

interface LegalContentProps {
  contents: {
    id: string;
    label: string;
    description: string;
    content: string;
  }[];
}

interface LegalSectionItem {
  title: string;
  body: string;
}

interface ParsedLegalContent {
  title: string;
  updatedAt: string;
  intro: string[];
  sections: LegalSectionItem[];
}

const sectionIcons = [
  Info,
  UserCheck,
  IdCard,
  Gift,
  ShieldAlert,
  Shield,
  Lock,
  FileCheck2,
  Globe,
  Scale,
  Bell,
  Landmark,
  BadgeCheck,
  Wallet,
  CircleHelp,
  FileText,
];

function parseLegalContent(content: string): ParsedLegalContent {
  const lines = content.split(/\r?\n/);
  const title =
    lines.find((line) => line.startsWith("# "))?.replace(/^# /, "").trim() ??
    "Điều khoản dịch vụ";
  const updatedAt = lines
    .find((line) => line.startsWith("Cập nhật lần cuối:"))
    ?.replace("Cập nhật lần cuối:", "")
    .trim() ?? "";

  const sections: LegalSectionItem[] = [];
  let currentSection: LegalSectionItem | null = null;
  let currentBody: string[] = [];
  const intro: string[] = [];
  let seenFirstSection = false;

  for (const line of lines) {
    if (line.startsWith("# ")) continue;
    if (line.startsWith("Áp dụng cho ")) continue;
    if (line.startsWith("Cập nhật lần cuối:")) continue;

    if (line.startsWith("## ")) {
      if (currentSection) {
        currentSection.body = currentBody.join("\n").trim();
        sections.push(currentSection);
      }

      seenFirstSection = true;
      currentSection = {
        title: line.replace(/^##\s*\d+\.\s*/, "").trim(),
        body: "",
      };
      currentBody = [];
      continue;
    }

    if (!seenFirstSection) {
      if (line.trim()) intro.push(line);
      continue;
    }

    currentBody.push(line);
  }

  if (currentSection) {
    currentSection.body = currentBody.join("\n").trim();
    sections.push(currentSection);
  }

  return { title, updatedAt, intro, sections };
}

function SectionCard({
  section,
  index,
}: {
  section: LegalSectionItem;
  index: number;
}) {
  const Icon = sectionIcons[index % sectionIcons.length];

  return (
    <article className="rounded-xl border border-white/8 bg-white/8 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            {section.title}
          </h3>
        </div>
      </div>

      <div className="mt-4 text-sm leading-7 text-white/72 sm:text-[15px]">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-3 ml-5 list-disc space-y-1.5 last:mb-0">
                {children}
              </ul>
            ),
            li: ({ children }) => <li>{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-primary underline underline-offset-4"
              >
                {children}
              </a>
            ),
          }}
        >
          {section.body}
        </ReactMarkdown>
      </div>
    </article>
  );
}

function SectionDivider({ section }: { section: LegalSectionItem }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,rgba(38,166,154,0.22),rgba(255,255,255,0.06))] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.22)] sm:p-7">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
      <div className="pl-3 sm:pl-4">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
          Quyền riêng tư
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {section.title}
        </h3>
        <div className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-[15px]">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p>{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
            }}
          >
            {section.body}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

export default function LegalContent({ contents }: LegalContentProps) {
  const [activeTab, setActiveTab] = useState(contents[0]?.id ?? "miniapp");
  const [expanded, setExpanded] = useState(false);
  const activeContent = useMemo(
    () => contents.find((item) => item.id === activeTab) ?? contents[0],
    [activeTab, contents],
  );
  const parsed = useMemo(
    () => parseLegalContent(activeContent?.content ?? ""),
    [activeContent],
  );
  const visibleSections = expanded
    ? parsed.sections
    : parsed.sections.slice(0, 3);

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
    setExpanded(false);
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Pháp lý
        </div>

        <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {parsed.title}
        </h2>

        {parsed.updatedAt ? (
          <p className="mt-3 text-sm text-white/60 sm:text-base">
            Cập nhật lần cuối: {parsed.updatedAt}
          </p>
        ) : null}

        {contents.length > 1 ? (
          <div className="mt-6 flex justify-center">
            <div className="inline-grid min-w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/6 p-2 sm:min-w-[30rem]">
              {contents.map((item) => {
                const isActive = item.id === activeTab;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={
                      isActive
                        ? "rounded-xl bg-white px-4 py-3 text-left shadow-sm transition"
                        : "rounded-xl px-4 py-3 text-left text-white/72 transition hover:bg-white/8 hover:text-white"
                    }
                  >
                    <div
                      className={
                        isActive
                          ? "text-sm font-semibold text-[#06211d]"
                          : "text-sm font-semibold text-white"
                      }
                    >
                      {item.label}
                    </div>
                    <div
                      className={
                        isActive
                          ? "mt-1 text-xs leading-5 text-[#33514d]"
                          : "mt-1 text-xs leading-5 text-white/55"
                      }
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {parsed.intro.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/8 p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
            <div className="space-y-3 text-sm leading-7 text-white/72 sm:text-[15px]">
              {parsed.intro.map((paragraph, index) => (
                <ReactMarkdown
                  key={`${paragraph}-${index}`}
                  components={{
                    p: ({ children }) => <p>{children}</p>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {paragraph}
                </ReactMarkdown>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-10 space-y-4">
        {visibleSections.map((section, index) => (
          section.title.toLowerCase().includes("chính sách quyền riêng tư") ? (
            <SectionDivider
              key={`${section.title}-${index}`}
              section={section}
            />
          ) : (
            <SectionCard
              key={`${section.title}-${index}`}
              section={section}
              index={index}
            />
          )
        ))}
      </div>

      {parsed.sections.length > 3 ? (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/15 bg-white/8 px-5 text-white hover:bg-white/12 hover:text-white"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Thu gọn nội dung" : "Xem đầy đủ điều khoản"}
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
