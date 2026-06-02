"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

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

function LegalMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-5 ml-5 list-disc space-y-2 last:mb-0">
            {children}
          </ul>
        ),
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="font-medium text-primary underline underline-offset-4"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function ContentSection({
  section,
  index,
}: {
  section: LegalSectionItem;
  index: number;
}) {
  return (
    <section id={`legal-section-${index + 1}`} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {section.title}
      </h2>
      <div className="mt-5 text-base leading-8 text-muted-foreground">
        <LegalMarkdown content={section.body} />
      </div>
    </section>
  );
}

export default function LegalContent({ contents }: LegalContentProps) {
  const [activeTab, setActiveTab] = useState(contents[0]?.id ?? "miniapp");
  const activeContent = useMemo(
    () => contents.find((item) => item.id === activeTab) ?? contents[0],
    [activeTab, contents],
  );
  const parsed = useMemo(
    () => parseLegalContent(activeContent?.content ?? ""),
    [activeContent],
  );

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
  }

  return (
    <div>
      <header className="mx-auto max-w-5xl text-left sm:text-center">
        <h1 className="max-w-7xl text-5xl font-bold leading-[0.92] tracking-tight text-foreground sm:mx-auto sm:text-5xl lg:text-6xl">
          {parsed.title}
        </h1>

        {parsed.updatedAt ? (
          <p className="mt-5 text-sm font-semibold text-muted-foreground sm:text-base">
            Cập nhật lần cuối: {parsed.updatedAt}
          </p>
        ) : null}

        {contents.length > 1 ? (
          <div className="mt-8 flex justify-start sm:justify-center">
            <div className="inline-grid min-w-full grid-cols-2 gap-2 rounded-lg border border-border bg-background p-1.5 sm:min-w-[30rem]">
              {contents.map((item) => {
                const isActive = item.id === activeTab;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={
                      isActive
                        ? "rounded-md bg-primary px-4 py-3 text-left text-primary-foreground shadow-sm transition"
                        : "rounded-md px-4 py-3 text-left text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    <div
                      className={
                        isActive
                          ? "text-sm font-semibold text-primary-foreground"
                          : "text-sm font-semibold text-foreground"
                      }
                    >
                      {item.label}
                    </div>
                    <div
                      className={
                        isActive
                          ? "mt-1 text-xs leading-5 text-primary-foreground/75"
                          : "mt-1 text-xs leading-5 text-muted-foreground"
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
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <main className="order-2 max-w-2xl lg:order-1">
          {parsed.intro.length > 0 ? (
            <div className="mb-12 max-w-2xl text-2xl font-medium leading-tight text-foreground sm:text-3xl">
              {parsed.intro.map((paragraph, index) => (
                <ReactMarkdown
                  key={`${paragraph}-${index}`}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-4 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {paragraph}
                </ReactMarkdown>
              ))}
            </div>
          ) : null}

          <div className="space-y-14">
            {parsed.sections.map((section, index) => (
              <ContentSection
                key={`${section.title}-${index}`}
                section={section}
                index={index}
              />
            ))}
          </div>
        </main>

        <aside className="order-1 border-t border-border pt-8 lg:sticky lg:top-24 lg:order-2 lg:self-start lg:border-t-0 lg:pt-0">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-2xl">
            Mục lục
          </h2>
          <ol className="mt-6 list-decimal space-y-3 pl-6 text-base font-semibold leading-6 text-foreground lg:text-sm">
            {parsed.sections.map((section, index) => (
              <li key={`${section.title}-toc-${index}`}>
                <a
                  href={`#legal-section-${index + 1}`}
                  className="underline underline-offset-3 transition hover:text-primary"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>

          <div className="mt-8 hidden border-t border-border pt-5 lg:block">
            <a
              href="#legal"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              Lên đầu trang ↑
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
