"use client";

import { useEffect, useMemo, useState } from "react";
import { FadeIn } from "@/components/fade-in";
import { LayoutGrid, type LayoutGridCard } from "@/components/ui/layout-grid";
import {
  fetchPublicPrograms,
  formatCampaignDate,
  getCampaignStatusLabel,
  stripHtml,
  type Program,
  type ProgramCampaign,
} from "@/lib/api/programs";
import { cn } from "@/lib/utils";

interface CampaignsProps {
  heading?: string;
  headingAccent?: string;
  className?: string;
}

function CampaignCard({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xl font-bold text-white md:text-4xl">{title}</p>
      <p className="text-base font-medium text-white/90">{subtitle}</p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">{description}</p>
    </div>
  );
}

function buildCardsFromPrograms(programs: Program[]): LayoutGridCard[] {
  const runningCampaigns = programs.flatMap((program) =>
    program.campaigns
      .filter((campaign) => campaign.status === "RUNNING")
      .map((campaign) => ({ campaign, program })),
  );

  return runningCampaigns.map(({ campaign, program }) => toLayoutGridCard(campaign, program));
}

function toLayoutGridCard(campaign: ProgramCampaign, program: Program): LayoutGridCard {
  const subtitle = [
    program.name,
    getCampaignStatusLabel(campaign.status),
    formatCampaignDate(campaign.startDate),
  ].join(" · ");

  return {
    id: campaign.id,
    thumbnail: campaign.bannerImg,
    content: (
      <CampaignCard
        title={campaign.name}
        subtitle={subtitle}
        description={stripHtml(program.description)}
      />
    ),
  };
}

function CampaignsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="aspect-[16/10] animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export default function LayoutGridDemo({
  heading = "Các chiến dịch",
  headingAccent = "đang diễn ra trên RESO.",
  className,
}: CampaignsProps) {
  const [cards, setCards] = useState<LayoutGridCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPrograms() {
      try {
        setLoading(true);
        setError(null);
        const programs = await fetchPublicPrograms();
        if (!cancelled) {
          setCards(buildCardsFromPrograms(programs));
        }
      } catch {
        if (!cancelled) {
          setError("Không thể tải danh sách chiến dịch. Vui lòng thử lại sau.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrograms();
    return () => {
      cancelled = true;
    };
  }, []);

  const isEmpty = useMemo(() => !loading && !error && cards.length === 0, [loading, error, cards.length]);

  return (
    <section id="campaigns" className={cn("border-t border-border px-5 py-24", className)}>
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-12 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
            <br />
            <span className="text-muted-foreground">{headingAccent}</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          {loading && <CampaignsSkeleton />}
          {error && (
            <p className="rounded-xl border border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
              {error}
            </p>
          )}
          {isEmpty && (
            <p className="rounded-xl border border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
              Hiện chưa có chiến dịch nào đang diễn ra.
            </p>
          )}
          {!loading && !error && cards.length > 0 && <LayoutGrid cards={cards} />}
        </FadeIn>
      </div>
    </section>
  );
}
