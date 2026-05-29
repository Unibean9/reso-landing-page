"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  MapPin,
  QrCode,
  ShieldCheck,
  Smartphone,
  Gift,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Iphone } from "@/components/ui/iphone";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StepStat {
  label: string;
  value: string;
}

interface HowItWorksItem {
  tag: string;
  title: string;
  body: string;
  image: string;
  badge: string;
  icon: LucideIcon;
  chips: string[];
  highlights: string[];
  stats: StepStat[];
  footnotes: [string, string];
}

interface HowItWorksProps {
  heading?: string;
  headingAccent?: string;
  items?: HowItWorksItem[];
  className?: string;
}

const defaultItems: HowItWorksItem[] = [
  {
    tag: "01",
    title: "Mở mini app & đăng ký",
    body: "Truy cập RESO qua mini app — đăng ký SĐT hoặc Google/Apple, nhận 50 điểm chào mừng. Chưa có trên App Store / CH Play.",
    image: "/assets/step1.svg",
    badge: "Mini app",
    icon: Smartphone,
    chips: ["Mini app", "Không cài đặt", "OTP 30 giây", "Miễn phí"],
    highlights: [
      "Mở mini app, không cần tải từ Store",
      "Đăng ký SĐT hoặc Google / Apple",
      "Nhận 50 điểm chào mừng ngay",
    ],
    stats: [
      { label: "Hình thức", value: "Mini app" },
      { label: "Điểm chào mừng", value: "+50" },
      { label: "App Store", value: "Sắp có" },
      { label: "CH Play", value: "Sắp có" },
    ],
    footnotes: [
      "Hiện dùng qua mini app — không cần cài từ App Store hay CH Play.",
      "Phiên bản Store đang hoàn thiện, sẽ ra mắt sau.",
    ],
  },
  {
    tag: "02",
    title: "Quét mã tích điểm",
    body: "Ghé cửa hàng đối tác, quét QR tại quầy — điểm cộng tức thì, lịch sử giao dịch minh bạch.",
    image: "/assets/step2.svg",
    badge: "Tại quầy",
    icon: QrCode,
    chips: ["QR động", "Chống gian lận", "Tại quầy", "Minh bạch"],
    highlights: [
      "QR động, chống gian lận",
      "Cộng điểm tức thì sau quét",
      "Lịch sử giao dịch minh bạch",
    ],
    stats: [
      { label: "Cửa hàng đối tác", value: "120+" },
      { label: "Tốc độ cộng điểm", value: "Tức thì" },
      { label: "Ghi nhận", value: "Theo CH" },
      { label: "Phí quét", value: "0đ" },
    ],
    footnotes: [
      "QR đổi mỗi giao dịch — an toàn cho merchant.",
      "Điểm hiển thị ngay trong ví RESO.",
    ],
  },
  {
    tag: "03",
    title: "Làm nhiệm vụ",
    body: "Hoàn thành nhiệm vụ ngày và tuần — tích thêm điểm, mở khóa phần thưởng và ưu đãi độc quyền.",
    image: "/assets/step3.svg",
    badge: "Nhiệm vụ",
    icon: Trophy,
    chips: ["Nhiệm vụ ngày", "Bonus chuỗi", "Tuần", "Điểm thưởng"],
    highlights: [
      "Nhiệm vụ ngày / tuần với bonus điểm",
      "Chuỗi hoàn thành nhận thưởng thêm",
      "Ưu đãi độc quyền khi hoàn tất",
    ],
    stats: [
      { label: "Nhiệm vụ mới", value: "Hàng ngày" },
      { label: "Bonus chuỗi", value: "x2 điểm" },
      { label: "Loại nhiệm vụ", value: "Ngày & tuần" },
      { label: "Phần thưởng", value: "Điểm + quà" },
    ],
    footnotes: [
      "Nhiệm vụ làm mới mỗi ngày — hoàn thành trước hết hạn.",
      "Chuỗi ngày liên tiếp nhận bonus điểm.",
    ],
  },
  {
    tag: "04",
    title: "Đổi quà",
    body: "Theo dõi số dư thời gian thực, đổi voucher & quà trong app — nhận tại cửa hàng hoặc ship.",
    image: "/assets/step4.svg",
    badge: "Ví điểm",
    icon: Gift,
    chips: ["Voucher", "Đồ uống", "Quà tặng", "Trong app"],
    highlights: [
      "Số dư cập nhật theo thời gian thực",
      "Voucher, đồ uống & quà vật lý",
      "Đổi trực tiếp trong app",
    ],
    stats: [
      { label: "Phần thưởng", value: "200+" },
      { label: "Đổi quà", value: "Trong app" },
      { label: "Nhận quà", value: "Tại CH / ship" },
      { label: "Điểm", value: "Real-time" },
    ],
    footnotes: [
      "Điểm hiển thị ngay sau mỗi giao dịch.",
      "Đổi quà trực tiếp tại cửa hàng hoặc ship.",
    ],
  },
];

const stepEase = [0.22, 1, 0.36, 1] as const;

function accentPair(light: string, dark: string) {
  return cn(light, dark);
}

/** Brand teal palette — shared across all steps */
const BRAND_ACCENT = {
  badge: accentPair(
    "border-uni-cyan-100 bg-uni-cyan-50 text-uni-teal-800",
    "dark:border-primary/35 dark:bg-accent/55 dark:text-uni-teal-300",
  ),
  iconBox: accentPair(
    "border-uni-cyan-100 bg-uni-cyan-50",
    "dark:border-primary/35 dark:bg-accent/50",
  ),
  icon: accentPair("text-primary", "dark:text-uni-teal-300"),
  chip: accentPair(
    "border-border bg-accent/80 text-uni-teal-800/90",
    "dark:border-border dark:bg-accent/40 dark:text-uni-teal-300/90",
  ),
  check: accentPair("text-primary", "dark:text-uni-teal-300"),
  stat: accentPair("text-uni-teal-700", "dark:text-uni-teal-300"),
  label: accentPair("text-uni-teal-700", "dark:text-uni-teal-300"),
  title: accentPair("text-foreground", "dark:text-foreground"),
  highlight: accentPair("text-foreground/85", "dark:text-foreground/90"),
  watermark: accentPair("text-primary/[0.07]", "dark:text-uni-teal-300/[0.14]"),
  grid: accentPair("border-border bg-border/80", "dark:border-border dark:bg-border/50"),
  gridDivide: accentPair("divide-border/60", "dark:divide-border/40"),
  cell: accentPair("bg-accent/35", "dark:bg-accent/40"),
  section: accentPair("border-border/80", "dark:border-border/60"),
  panel: accentPair("border-border bg-accent/25", "dark:border-border dark:bg-accent/35"),
  pillActive: accentPair(
    "border-primary/45 bg-uni-cyan-50 text-uni-teal-800",
    "dark:border-primary/45 dark:bg-accent/55 dark:text-uni-teal-300",
  ),
  borderL: accentPair("border-l-primary/60", "dark:border-l-uni-teal-300/70"),
  bar: accentPair("bg-primary", "dark:bg-uni-teal-300"),
  scan: accentPair(
    "border-primary/40 bg-primary/8",
    "dark:border-primary/35 dark:bg-primary/12",
  ),
  scanCorner: accentPair("border-uni-teal-700/70", "dark:border-uni-teal-300/80"),
  solid: accentPair("bg-primary", "dark:bg-uni-teal-300"),
  solidFg: accentPair("text-primary-foreground", "dark:text-uni-teal-800"),
} as const;

type StepAccent = typeof BRAND_ACCENT;

function getStepAccent(_tag?: string): StepAccent {
  return BRAND_ACCENT;
}

function StepVisualFrame({
  accent,
  children,
}: {
  accent: StepAccent;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative size-17 shrink-0 overflow-hidden rounded-lg",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        accent.scan,
      )}
    >
      <span
        className={cn(
          "absolute left-1.5 top-1.5 size-2 rounded-sm border-l-2 border-t-2",
          accent.scanCorner,
        )}
      />
      <span
        className={cn(
          "absolute right-1.5 top-1.5 size-2 rounded-sm border-r-2 border-t-2",
          accent.scanCorner,
        )}
      />
      <span
        className={cn(
          "absolute bottom-1.5 left-1.5 size-2 rounded-sm border-b-2 border-l-2",
          accent.scanCorner,
        )}
      />
      <span
        className={cn(
          "absolute bottom-1.5 right-1.5 size-2 rounded-sm border-b-2 border-r-2",
          accent.scanCorner,
        )}
      />
      {children}
    </div>
  );
}

function StepAnimatedVisual({ tag, accent }: { tag: string; accent: StepAccent }) {
  if (tag === "01") {
    return (
      <StepVisualFrame accent={accent}>
        <div className="flex size-full flex-col items-center justify-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.88, 1, 0.88] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Smartphone className={cn("size-7", accent.icon)} strokeWidth={1.75} />
          </motion.div>
          <div className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={cn("size-1 rounded-full", accent.bar)}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </div>
        </div>
        <motion.div
          className={cn("pointer-events-none absolute inset-x-2 z-10 h-0.5 rounded-full", accent.bar)}
          animate={{ top: ["62%", "28%", "62%"] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        />
      </StepVisualFrame>
    );
  }

  if (tag === "02") {
    return <Step02QrScanner accent={accent} compact />;
  }

  if (tag === "03") {
    const barHeights = [10, 16, 11] as const;
    return (
      <StepVisualFrame accent={accent}>
        <div className="flex size-full flex-col items-center justify-center gap-1 px-1.5">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Trophy className={cn("size-6", accent.icon)} strokeWidth={1.75} />
          </motion.div>
          <div className="flex h-5 w-full items-end justify-center gap-0.5" aria-hidden>
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                className={cn("w-2 rounded-t-sm", i === 1 ? accent.solid : accent.bar)}
                animate={{ height: [h, h + 5, h] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-lg",
            "bg-linear-to-t from-transparent via-transparent to-white/10 dark:to-white/5",
          )}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </StepVisualFrame>
    );
  }

  if (tag === "04") {
    return (
      <StepVisualFrame accent={accent}>
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-full items-center justify-center"
        >
          <Gift className={cn("size-8", accent.icon)} strokeWidth={1.75} />
        </motion.div>
        {[
          { top: "16%", left: "20%" },
          { top: "24%", right: "18%" },
          { bottom: "20%", left: "28%" },
        ].map((pos, i) => (
          <motion.span
            key={i}
            className={cn("absolute size-1 rounded-full", accent.bar)}
            style={pos}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.22 }}
            aria-hidden
          />
        ))}
        <motion.span
          className={cn(
            "absolute bottom-1.5 right-1.5 rounded px-1 py-px font-mono text-[8px] font-bold leading-none",
            accent.solid,
            accent.solidFg,
          )}
          animate={{ opacity: [0.65, 1, 0.65], y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          +50
        </motion.span>
      </StepVisualFrame>
    );
  }

  return null;
}

/** Decorative QR grid — not a real encode */
const QR_TILE_PATTERN = [
  [1, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 0, 1],
  [0, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 0, 1, 1],
  [0, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 1, 1],
] as const;

const STEP02_PHASES = ["Đang quét", "Xác thực", "Thành công"] as const;

const STEP02_FLOW = [
  { key: "scan", label: "Quét mã" },
  { key: "verify", label: "Xác thực" },
  { key: "points", label: "Cộng điểm" },
] as const;

function Step02QrScanner({
  accent,
  compact = false,
}: {
  accent: StepAccent;
  compact?: boolean;
}) {
  const size = compact ? "size-[4.25rem]" : "size-20";
  const gridInset = compact ? "inset-1.5" : "inset-2.5";
  const cols = compact ? "grid-cols-5 grid-rows-5 gap-px" : "grid-cols-7 grid-rows-7 gap-px";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        size,
        accent.scan,
      )}
    >
      <span className={cn("absolute left-1.5 top-1.5 size-2 rounded-sm border-l-2 border-t-2", accent.scanCorner)} />
      <span className={cn("absolute right-1.5 top-1.5 size-2 rounded-sm border-r-2 border-t-2", accent.scanCorner)} />
      <span className={cn("absolute bottom-1.5 left-1.5 size-2 rounded-sm border-b-2 border-l-2", accent.scanCorner)} />
      <span className={cn("absolute bottom-1.5 right-1.5 size-2 rounded-sm border-b-2 border-r-2", accent.scanCorner)} />
      <div
        className={cn("absolute grid opacity-[0.22] dark:opacity-[0.18]", gridInset, cols)}
        aria-hidden
      >
        {(compact ? QR_TILE_PATTERN.slice(0, 5) : QR_TILE_PATTERN).flatMap((row, ri) =>
          row.slice(0, compact ? 5 : 7).map((on, ci) => (
            <span
              key={`${ri}-${ci}`}
              className={cn("rounded-[1px]", on ? accent.bar : "bg-transparent")}
            />
          )),
        )}
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <QrCode
            className={cn(compact ? "size-7" : "size-9", accent.icon)}
            strokeWidth={1.75}
            aria-hidden
          />
        </motion.div>
      </div>
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-x-1.5 z-10 h-0.5 rounded-full shadow-[0_0_6px_currentColor]",
          accent.bar,
        )}
        animate={{ top: ["18%", "82%", "18%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {!compact && (
        <motion.div
          className="absolute inset-0 z-5 bg-primary/10"
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function Step02ScanDetail({ accent }: { accent: StepAccent }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % STEP02_PHASES.length), 2800);
    return () => clearInterval(id);
  }, []);

  const points = phase < 2 ? 0 : 120;
  const partners = ["BEATEA", "DEER", "PASSIO", "HIGHLANDS", "+116"];

  return (
    <div className={cn("overflow-hidden rounded-xl border", accent.panel)}>
      <div className="flex gap-3 p-2.5 sm:p-3">
        <Step02QrScanner accent={accent} compact />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={cn("truncate text-sm font-semibold leading-tight", accent.title)}>BEATEA</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="size-2.5 shrink-0" aria-hidden />
                <span className="truncate">Quận 1 · Cửa hàng đối tác</span>
              </p>
            </div>
            <motion.span
              key={phase}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                phase === 2
                  ? cn(accent.solid, accent.solidFg, "border-transparent")
                  : accent.pillActive,
              )}
            >
              {STEP02_PHASES[phase]}
            </motion.span>
          </div>

          <div className="flex items-center gap-0.5" aria-label="Luồng quét QR">
            {STEP02_FLOW.map((step, i) => (
              <div key={step.key} className="flex min-w-0 flex-1 items-center gap-0.5">
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <motion.div
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full border text-[9px] font-bold",
                      i <= phase
                        ? cn(accent.solid, accent.solidFg, "border-transparent")
                        : "border-border bg-background/50 text-muted-foreground dark:bg-background/30",
                    )}
                    animate={i === phase ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.8, repeat: i === phase ? Infinity : 0 }}
                  >
                    {i < phase ? "✓" : i + 1}
                  </motion.div>
                  <span
                    className={cn(
                      "w-full truncate text-center text-[9px]",
                      i <= phase ? accent.label : "text-muted-foreground/70",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEP02_FLOW.length - 1 && (
                  <div
                    className={cn(
                      "mb-3 h-px w-full max-w-3 flex-1",
                      i < phase ? accent.bar : "bg-border dark:bg-muted",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.div
            className={cn(
              "flex items-center justify-between rounded-lg border px-2.5 py-2",
              accent.scan,
            )}
            animate={phase === 2 ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-[10px] text-muted-foreground">Điểm cộng</p>
              <motion.p
                key={points}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("font-mono text-xl font-bold leading-none tabular-nums", accent.stat)}
              >
                +{points}
              </motion.p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Mã GD</p>
              <p className="font-mono text-[10px] font-medium text-foreground/80 dark:text-foreground/90">
                #RESO-{phase === 2 ? "8F2A" : "····"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between gap-2 border-t px-2.5 py-2 sm:px-3",
          accent.section,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">
          {partners.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                "rounded-md border px-1.5 py-px text-[10px] font-medium",
                name.startsWith("+")
                  ? cn(accent.pillActive, "border-transparent")
                  : "border-border/70 bg-background/50 text-muted-foreground dark:bg-background/25",
              )}
            >
              {name}
            </motion.span>
          ))}
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 text-[10px] font-medium",
            accent.label,
          )}
        >
          <ShieldCheck className="size-3" aria-hidden />
          QR động
        </span>
      </div>
    </div>
  );
}

function StepDetailCard({
  accent,
  tag,
  children,
}: {
  accent: StepAccent;
  tag: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-stretch gap-3 rounded-xl border p-2.5 sm:gap-3.5 sm:p-3",
        accent.panel,
      )}
    >
      <StepAnimatedVisual tag={tag} accent={accent} />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">{children}</div>
    </div>
  );
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: stepEase },
  },
};

/** Map scroll progress → step index (advances earlier within each zone). */
function progressToStepIndex(raw: number, stepCount: number) {
  if (stepCount <= 1) return 0;
  const biased = raw * stepCount + 0.28;
  return Math.min(stepCount - 1, Math.max(0, Math.floor(biased)));
}

function usePageScrollSteps(
  sectionRef: React.RefObject<HTMLElement | null>,
  stepCount: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(() => {
    const section = sectionRef.current;
    if (!section || stepCount < 1) return;

    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setActiveIndex(0);
      return;
    }

    const rect = section.getBoundingClientRect();
    const raw = Math.min(1, Math.max(0, -rect.top / scrollable));
    setActiveIndex(progressToStepIndex(raw, stepCount));
  }, [sectionRef, stepCount]);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return { activeIndex };
}

function StepBottomPanel({ item }: { item: HowItWorksItem }) {
  const accent = getStepAccent(item.tag);

  if (item.tag === "01") {
    return (
      <StepDetailCard accent={accent} tag={item.tag}>
        <div>
          <p className={cn("text-sm font-medium leading-snug", accent.title)}>Đăng ký mini app</p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            SĐT / Google / Apple · OTP 30 giây
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "RESO Mini App", active: true },
            { label: "App Store · sắp có", active: false },
            { label: "CH Play · sắp có", active: false },
          ].map((platform) => (
            <span
              key={platform.label}
              className={cn(
                "rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-2.5 sm:text-xs",
                platform.active
                  ? accent.pillActive
                  : "border-border bg-muted/40 text-muted-foreground dark:bg-muted/25",
              )}
            >
              {platform.label}
            </span>
          ))}
        </div>
        <div className="space-y-1.5">
          {["Mở mini app", "Xác thực OTP", "Nhận 50 điểm"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border dark:bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", accent.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: i < 2 ? "100%" : "35%" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-[10px] text-muted-foreground sm:w-28 sm:text-[11px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </StepDetailCard>
    );
  }

  if (item.tag === "02") {
    return <Step02ScanDetail accent={accent} />;
  }

  if (item.tag === "03") {
    const missions = [
      { label: "Quét QR tại cửa hàng", progress: "2/3", pct: 67 },
      { label: "Check-in 3 ngày liên tiếp", progress: "1/3", pct: 33 },
      { label: "Mời bạn bè tham gia", progress: "0/1", pct: 0 },
    ];
    return (
      <StepDetailCard accent={accent} tag={item.tag}>
        <div>
          <p className={cn("text-sm font-medium leading-snug", accent.title)}>Nhiệm vụ hôm nay</p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            Hoàn thành trước hết hạn · nhận bonus điểm
          </p>
        </div>
        <div className="space-y-2">
          {missions.map((mission, i) => (
            <motion.div
              key={mission.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] text-foreground sm:text-xs">{mission.label}</span>
                <span className={cn("shrink-0 font-mono text-[10px] sm:text-[11px]", accent.label)}>
                  {mission.progress}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border dark:bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", accent.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-2 py-1.5 dark:bg-background/30">
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Trophy className={cn("size-3.5", accent.icon)} />
          </motion.div>
          <span className="text-[11px] text-muted-foreground">Chuỗi 3 ngày</span>
          <span className={cn("ml-auto font-mono text-[11px] font-semibold", accent.stat)}>
            +120 điểm
          </span>
        </div>
      </StepDetailCard>
    );
  }

  return (
    <StepDetailCard accent={accent} tag={item.tag}>
      <div>
        <p className={cn("text-sm font-medium leading-snug", accent.title)}>Đổi quà trong app</p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          Số dư real-time · nhận tại CH hoặc ship
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "Voucher cafe", pts: "500" },
          { label: "Trà sữa", pts: "120" },
          { label: "Quà box", pts: "800" },
        ].map((reward, i) => (
          <motion.div
            key={reward.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.05 }}
            className={cn(
              "rounded-lg border border-border/80 bg-background/60 px-1.5 py-1.5 text-center dark:bg-background/30",
            )}
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
            >
              <Gift className={cn("mx-auto size-3", accent.icon)} />
            </motion.div>
            <p className="mt-0.5 text-[9px] text-muted-foreground">{reward.label}</p>
            <p className={cn("font-mono text-[10px] font-semibold sm:text-xs", accent.stat)}>
              {reward.pts} đ
            </p>
          </motion.div>
        ))}
      </div>
    </StepDetailCard>
  );
}

function StepOverview({
  items,
  activeIndex,
}: {
  items: HowItWorksItem[];
  activeIndex: number;
}) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] sm:text-xs">
      {items.map((step, index) => {
        return (
          <span
            key={step.tag}
            className={cn(
              "transition-colors",
              index === activeIndex
                ? cn("font-semibold text-primary dark:text-uni-teal-300")
                : "text-muted-foreground/45",
            )}
          >
            {step.tag} {step.title}
          </span>
        );
      })}
    </div>
  );
}

function StepCopy({
  item,
  items,
  activeIndex,
}: {
  item: HowItWorksItem;
  items: HowItWorksItem[];
  activeIndex: number;
}) {
  const Icon = item.icon;
  const accent = getStepAccent(item.tag);

  return (
    <motion.div
      key={item.tag}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.35, ease: stepEase }}
      className="relative w-full max-w-none lg:pr-4"
    >
      <span
        className={cn(
          "pointer-events-none absolute -top-1 right-0 select-none font-mono text-[5rem] font-bold leading-none tracking-tighter sm:text-[6rem] lg:left-auto lg:right-4",
          accent.watermark,
        )}
        aria-hidden
      >
        {item.tag}
      </span>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full flex-col gap-3 sm:gap-3.5"
      >
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              accent.badge,
            )}
          >
            <Icon className="size-3" />
            {item.badge}
          </span>
          <span className="font-mono text-xs tracking-widest text-muted-foreground">
            Bước {item.tag}
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-start gap-3">
          <motion.div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border",
              accent.iconBox,
            )}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={
                item.tag === "02"
                  ? { rotate: [0, 2, 0, -2, 0] }
                  : item.tag === "03"
                    ? { rotate: [-4, 4, -4] }
                    : item.tag === "04"
                      ? { y: [0, -2, 0] }
                      : { y: [0, -1, 0] }
              }
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className={cn("size-5", accent.icon)} />
            </motion.div>
          </motion.div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl",
                accent.title,
              )}
            >
              {item.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.chips.map((chip) => (
                <span
                  key={chip}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px] font-medium",
                    accent.chip,
                  )}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="w-full text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {item.body}
        </motion.p>

        <motion.ul
          variants={fadeUp}
          className={cn(
            "grid w-full gap-2 border-y py-3 sm:grid-cols-3 sm:gap-0 sm:divide-x",
            accent.section,
            accent.gridDivide,
          )}
        >
          {item.highlights.map((line) => (
            <li
              key={line}
              className={cn(
                "flex items-start gap-2 px-0 text-xs leading-snug sm:px-4 sm:text-sm first:sm:pl-0 last:sm:pr-0",
                accent.highlight,
              )}
            >
              <CheckCircle2 className={cn("mt-0.5 size-3.5 shrink-0", accent.check)} />
              <span>{line}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeUp}
          className={cn("grid grid-cols-2 gap-px border sm:grid-cols-4", accent.grid)}
        >
          {item.stats.map((stat) => (
            <div key={stat.label} className={cn("px-3 py-2.5 sm:px-4 sm:py-3", accent.cell)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className={cn("mt-0.5 font-mono text-base font-bold sm:text-lg", accent.stat)}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={cn("flex flex-col gap-2.5 border-t pt-3", accent.section)}
        >
          <StepOverview items={items} activeIndex={activeIndex} />
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Chi tiết bước {item.tag}
            </p>
            <StepBottomPanel item={item} />
          </div>
          {item.tag !== "02" && (
            <div
              className={cn(
                "grid gap-1.5 border-t pt-2.5 sm:grid-cols-2 sm:gap-3",
                accent.section,
              )}
            >
              {item.footnotes.map((note) => (
                <p key={note} className="text-xs leading-snug text-muted-foreground">
                  {note}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PhoneScreen({ image, title }: { image: string; title: string }) {
  return (
    <motion.div
      key={image}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: stepEase }}
      className="absolute inset-0 overflow-hidden bg-white dark:bg-black"
    >
      <Image
        src={image}
        alt={title}
        fill
        unoptimized
        sizes="(max-width: 1024px) 260px, 320px"
        className="min-h-full min-w-full origin-end mt-3 scale-[1.40] object-cover object-[center_46%]"
        draggable={false}
      />
    </motion.div>
  );
}

export default function HowItWorks({
  heading = "Cách RESO hoạt động",
  headingAccent = "chỉ với bốn bước đơn giản.",
  items = defaultItems,
  className,
}: HowItWorksProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeIndex } = usePageScrollSteps(sectionRef, items.length);
  const activeItem = items[activeIndex];

  const sectionHeightVh = (items.length - 1) * 72 + 100;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={cn(
        "relative shrink-0 border-t border-border bg-app-bg dark:border-border/60",
        className,
      )}
      style={{ height: `${sectionHeightVh}dvh` }}
      aria-label="Cách RESO hoạt động"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 30% 50%, black, transparent)",
          }}
        />
      </div>

      <div className="sticky top-14 flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-app-bg dark:bg-app-bg">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden px-5 py-3 sm:px-8 sm:py-4">
          <header className="shrink-0">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {heading}
              <br />
              <span className="text-muted-foreground">{headingAccent}</span>
            </h2>
          </header>

          <div
            id="how-it-works-panel"
            aria-live="polite"
            className="mt-3 grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 overflow-hidden sm:mt-4 lg:grid-cols-[1fr_minmax(260px,380px)] lg:grid-rows-1 lg:gap-10"
          >
            <div className="relative flex min-h-0 items-start justify-start overflow-y-auto pt-1 lg:pt-2">
              <AnimatePresence mode="wait">
                {activeItem && (
                  <StepCopy
                    key={activeItem.tag}
                    item={activeItem}
                    items={items}
                    activeIndex={activeIndex}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex h-full min-h-0 items-center justify-center pt-1 lg:justify-end lg:pt-2">
              <motion.div
                className="pointer-events-none absolute right-0 top-1/2 size-56 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/15 lg:size-64"
                aria-hidden
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 flex h-full min-h-0 w-full items-center justify-center @container-[size] lg:justify-end">
                <Iphone
                  screenFullBleed
                  screenClassName="bg-white dark:bg-black"
                  className="max-h-full w-[min(100%,260px,calc(100cqh*433/882))] lg:w-[min(100%,320px,calc(100cqh*433/882))]"
                  aria-label={activeItem?.title ?? "RESO app"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {activeItem && (
                      <PhoneScreen
                        key={activeItem.image}
                        image={activeItem.image}
                        title={activeItem.title}
                      />
                    )}
                  </AnimatePresence>
                </Iphone>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
