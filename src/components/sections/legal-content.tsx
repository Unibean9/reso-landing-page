"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

interface LegalContentProps {
  content: string;
}

export default function LegalContent({ content }: LegalContentProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-8 rounded-[1.5rem] border border-border/60 bg-background p-5 sm:p-7">
      <div className="relative">
        <div
          className={expanded ? "" : "max-h-[34rem] overflow-hidden"}
          aria-expanded={expanded}
        >
          <div className="prose prose-zinc max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-primary prose-strong:text-foreground dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background via-background/90 to-transparent" />
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-5"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Thu gọn điều khoản" : "Xem đầy đủ điều khoản"}
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
    </div>
  );
}
