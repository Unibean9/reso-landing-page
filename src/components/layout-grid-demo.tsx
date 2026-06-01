"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { useRunningCampaigns } from "@/hooks/use-running-campaigns";
import {
  formatCampaignPeriod,
  getCampaignStatusLabel,
  stripHtml,
} from "@/lib/api/programs";
import { cn, safeImage } from "@/lib/utils";

interface CampaignsProps {
  heading?: string;
  headingAccent?: string;
  className?: string;
}

function CampaignSlideSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#051412] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-5 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mx-auto mt-4 h-12 w-72 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="mt-10 flex items-center justify-center gap-6">
        <div className="hidden h-[14rem] w-[22rem] animate-pulse rounded-[1.75rem] bg-white/10 blur-[1px] sm:block" />
        <div className="h-[14rem] w-[22rem] animate-pulse rounded-[1.75rem] bg-white/10 sm:h-[18rem] sm:w-[28rem]" />
        <div className="hidden h-[14rem] w-[22rem] animate-pulse rounded-[1.75rem] bg-white/10 blur-[1px] sm:block" />
      </div>
    </div>
  );
}

function getRelativePosition(index: number, activeIndex: number, total: number) {
  if (total <= 1) return 0;

  const forward = (index - activeIndex + total) % total;
  const backward = (activeIndex - index + total) % total;

  if (forward === 0) return 0;
  if (forward <= backward) return forward;
  return -backward;
}

export default function LayoutGridDemo({
  heading = "Các chiến dịch",
  headingAccent = "đang diễn ra trên RESO.",
  className,
}: CampaignsProps) {
  const { campaigns, loading, error } = useRunningCampaigns();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const hasCampaigns = campaigns.length > 0;
  const isEmpty = !loading && !error && !hasCampaigns;

  const summary = useMemo(() => {
    if (!hasCampaigns) return null;

    const runningPrograms = new Set(campaigns.map((item) => item.program.id)).size;

    return `${campaigns.length} chiến dịch từ ${runningPrograms} chương trình đang mở`;
  }, [campaigns, hasCampaigns]);

  const activeEntry = campaigns[activeIndex] ?? null;
  const activeDescription = activeEntry
    ? stripHtml(activeEntry.program.description) ||
      "Chương trình công khai đang mở trên RESO."
    : "";

  function goToSlide(index: number) {
    if (!campaigns.length) return;
    const total = campaigns.length;
    setActiveIndex((index + total) % total);
  }

  function scrollToMobileCard(index: number) {
    const total = campaigns.length;
    if (!total) return;

    const nextIndex = (index + total) % total;
    const track = mobileTrackRef.current;
    const card = mobileCardRefs.current[nextIndex];

    if (track && card) {
      const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
      track.scrollTo({
        left,
        behavior: "smooth",
      });
      setMobileIndex(nextIndex);
    }
  }

  function handleMobileScroll() {
    const track = mobileTrackRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    mobileCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== mobileIndex) {
      setMobileIndex(closestIndex);
    }
  }

  return (
    <section
      id="campaigns"
      className={cn("border-t border-border px-5 py-24", className)}
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn className="rounded-[2rem] border border-white/10 bg-[#030807] px-5 py-2 text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-8 sm:py-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-300/80">
              {summary ?? "Chiến dịch nổi bật"}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              {heading}
              <br />
              <span className="text-white/65">{headingAccent}</span>
            </h2>
          </div>

          <div className="relative">
            {loading && <CampaignSlideSkeleton />}
            {error && (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
                {error}
              </p>
            )}
            {isEmpty && (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
                Hiện chưa có chiến dịch nào đang diễn ra.
              </p>
            )}
            {!loading && !error && hasCampaigns && activeEntry ? (
              <>
                {/* MOBILE VIEW: Mở rộng chiều cao Carousel bằng h-[26rem] để hiện thị trọn vẹn Banner và chữ */}
                <div className="block md:hidden mt-8">
                  <div
                    ref={mobileTrackRef}
                    onScroll={handleMobileScroll}
                    className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 items-stretch h-[26rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {campaigns.map((entry, i) => {
                      return (
                        <div
                          key={entry.campaign.id}
                          ref={(node) => {
                            mobileCardRefs.current[i] = node;
                          }}
                          className="min-w-0 shrink-0 basis-[88%] snap-center flex h-full"
                        >
                          <div className="group flex w-full h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#051412] transition-all duration-300">
                            {/* 1. Banner ảnh đặt ở TRÊN CÙNG: Cố định h-44 shrink-0 đảm bảo hiển thị 100% */}
                            <div className="relative h-44 w-full overflow-hidden bg-white/5 shrink-0">
                              <Image
                                src={safeImage(entry.campaign.bannerImg)}
                                alt={entry.campaign.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 42rem"
                                className="object-cover transition duration-500 group-hover:scale-105"
                                priority={i === 0}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                            </div>

                            {/* 2. Nội dung text ở DƯỚI CÙNG: justify-between để căn đáy thẳng hàng tắp */}
                            <div className="flex flex-col p-5 flex-1 justify-between gap-3 overflow-hidden">
                              <div>
                                <h3 className="text-base font-bold tracking-tight text-white line-clamp-1">
                                  {entry.campaign.name}
                                </h3>
                                <p 
                                  className="mt-2 text-xs leading-relaxed text-white/60"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                  }}
                                >
                                  {stripHtml(entry.program.description) ||
                                    "Chương trình công khai đang mở trên RESO."}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-[11px] border-t border-white/5 pt-2.5 shrink-0">
                                <span className="text-white/40">
                                  {formatCampaignPeriod(
                                    entry.campaign.startDate,
                                    entry.campaign.expirationDate,
                                  )}
                                </span>
                                <Link
                                  href="/#contact"
                                  className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                                >
                                  Khám phá ngay <ArrowUpRight className="size-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {campaigns.length > 1 ? (
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {campaigns.map((entry, index) => (
                          <button
                            key={entry.campaign.id}
                            type="button"
                            aria-label={`Đi tới chiến dịch ${index + 1}`}
                            onClick={() => scrollToMobileCard(index)}
                            className={cn(
                              "h-2 rounded-full bg-white/15 transition-all",
                              mobileIndex === index ? "w-6 bg-emerald-400" : "w-2",
                            )}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Chiến dịch trước"
                          onClick={() => scrollToMobileCard(mobileIndex - 1)}
                          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                        >
                          <ArrowLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Chiến dịch tiếp theo"
                          onClick={() => scrollToMobileCard(mobileIndex + 1)}
                          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                        >
                          <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* DESKTOP VIEW: Giữ nguyên giao diện cũ của Desktop */}
                <div className="hidden md:block relative mt-10">
                  <div className="absolute inset-x-[15%] top-20 h-56 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28),rgba(6,95,70,0.08)_45%,transparent_72%)] blur-3xl" />

                  <div className="relative mx-auto flex h-[27rem] max-w-6xl items-center justify-center overflow-hidden sm:h-[40rem]">
                    {campaigns.length > 1 ? (
                      <>
                        <button
                          type="button"
                          aria-label="Chiến dịch trước"
                          onClick={() => goToSlide(activeIndex - 1)}
                          className="absolute left-0 top-1/2 z-40 flex size-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/70 text-white/80 transition hover:bg-black hover:text-white"
                        >
                          <ArrowLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Chiến dịch tiếp theo"
                          onClick={() => goToSlide(activeIndex + 1)}
                          className="absolute right-0 top-1/2 z-40 flex size-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/70 text-white/80 transition hover:bg-black hover:text-white"
                        >
                          <ArrowRight className="size-4" />
                        </button>
                      </>
                    ) : null}

                    {campaigns.map(({ campaign, program }, index) => {
                      const offset = getRelativePosition(index, activeIndex, campaigns.length);
                      const isActive = offset === 0;
                      const isAdjacent = Math.abs(offset) === 1;
                      const isVisible = isActive || isAdjacent;

                      return (
                        <article
                          key={campaign.id}
                          aria-hidden={!isActive}
                          className={cn(
                            "absolute left-1/2 top-1/2 w-[24rem] -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out sm:w-[42rem]",
                            isActive &&
                              "z-30 -translate-x-1/2 scale-100 opacity-100 blur-0",
                            offset === -1 &&
                              "z-20 hidden -translate-x-[80%] scale-[0.82] opacity-18 blur-[2px] sm:block",
                            offset === 1 &&
                              "z-20 hidden -translate-x-[20%] scale-[0.82] opacity-18 blur-[2px] sm:block",
                            !isVisible && "pointer-events-none z-0 opacity-0",
                          )}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                            <Image
                              src={safeImage(campaign.bannerImg)}
                              alt={campaign.name}
                              fill
                              sizes="(max-width: 640px) 24rem, 42rem"
                              className={cn(
                                "object-cover transition duration-500",
                                isActive ? "scale-100" : "scale-105",
                              )}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/75 backdrop-blur">
                              {program.name}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300/90">
                        <span>{getCampaignStatusLabel(activeEntry.campaign.status)}</span>
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <span className="text-white/55">
                          {formatCampaignPeriod(
                            activeEntry.campaign.startDate,
                            activeEntry.campaign.expirationDate,
                          )}
                        </span>
                      </div>

                      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {activeEntry.campaign.name}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                        {activeDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {campaigns.length > 1 ? (
                        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 backdrop-blur">
                          <button
                            type="button"
                            aria-label="Chiến dịch trước"
                            onClick={() => goToSlide(activeIndex - 1)}
                            className="rounded-full p-1 text-white/70 transition hover:text-white"
                          >
                            <ArrowLeft className="size-4" />
                          </button>
                          <span className="min-w-16 text-center tabular-nums">
                            {activeIndex + 1} / {campaigns.length}
                          </span>
                          <button
                            type="button"
                            aria-label="Chiến dịch tiếp theo"
                            onClick={() => goToSlide(activeIndex + 1)}
                            className="rounded-full p-1 text-white/70 transition hover:text-white"
                          >
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                      ) : null}

                      <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        Khám phá
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
