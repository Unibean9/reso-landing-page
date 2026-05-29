"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeIn } from "@/components/fade-in";
import { CheckCircle2, Circle, Zap, Shield, BarChart2, Bot, Link2, ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function useLoop(ms: number) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

function InferenceViz() {
  const loop = useLoop(3800);
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const t = [
      setTimeout(() => setStep(0), 0),
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1900),
    ];
    return () => t.forEach(clearTimeout);
  }, [loop]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 font-mono text-sm text-muted-foreground">
        <Zap className="size-4 text-uni-teal-300" />
        RESO · quét QR
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Quét mã tại quầy", ms: null },
          { label: "Xác thực giao dịch", ms: "0.3s" },
          { label: "Cộng điểm vào ví", ms: "Tức thì" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            animate={{ opacity: step >= i ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <AnimatePresence mode="wait">
              {step >= i ? (
                <motion.div key="y" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                </motion.div>
              ) : (
                <Circle className="size-4 shrink-0 text-border" />
              )}
            </AnimatePresence>
            <span className="flex-1 text-sm text-foreground">{s.label}</span>
            {s.ms && step >= i && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                {s.ms}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3">
        <span className="text-sm text-muted-foreground">Tốc độ cộng điểm</span>
        <motion.span animate={{ opacity: step === 3 ? 1 : 0.3 }} className="font-mono text-xl font-bold text-foreground">
          Tức thì
        </motion.span>
      </div>
    </div>
  );
}

function IntegrationsViz() {
  const loop = useLoop(4500);
  const [connected, setConnected] = React.useState<number[]>([]);
  const items = React.useMemo(
    () => [
      { name: "BEATEA", color: "bg-uni-teal-800" },
      { name: "DEER", color: "bg-muted-foreground dark:bg-uni-cyan-100" },
      { name: "PASSIO", color: "bg-uni-teal-300" },
      { name: "HIGHLANDS", color: "bg-uni-teal-800" },
      { name: "PHÚC LONG", color: "bg-uni-teal-700" },
      { name: "KATINAT", color: "bg-uni-teal-500" },
      { name: "THE COFFEE", color: "bg-uni-teal-500" },
      { name: "+113", color: "bg-foreground" },
    ],
    [],
  );
  React.useEffect(() => {
    const resetId = setTimeout(() => setConnected([]), 0);
    const timeouts = items.map((_, i) => setTimeout(() => setConnected((p) => [...p, i]), 300 + i * 280));
    return () => { clearTimeout(resetId); timeouts.forEach(clearTimeout); };
  }, [loop, items]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="grid grid-cols-4 gap-2">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            animate={{ opacity: connected.includes(i) ? 1 : 0.2, scale: connected.includes(i) ? 1 : 0.92 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/30 py-3"
          >
            <div className={cn("size-5 rounded-md", item.color)} />
            <span className="text-[10px] text-muted-foreground">{item.name}</span>
            {connected.includes(i) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-1.5 rounded-full bg-primary" />
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Đối tác</span>
        </div>
        <span className="font-mono text-xl font-bold text-foreground">
          {connected.length}<span className="text-sm font-normal text-muted-foreground">/120+</span>
        </span>
      </div>
    </div>
  );
}

function SecurityViz() {
  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center gap-5 p-6">
      <div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
        <Shield className="size-8 text-primary" />
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-2xl border border-primary/30" />
        <motion.div animate={{ scale: [1, 1.9, 1], opacity: [0.15, 0, 0.15] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute inset-0 rounded-2xl border border-primary/20" />
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {["QR động mỗi lần quét", "Lịch sử minh bạch", "Chống gian lận", "Không bán dữ liệu"].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
            <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
            <span className="text-xs text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsViz() {
  const loop = useLoop(4000);
  const targets = React.useMemo(() => [42, 68, 38, 82, 55, 91, 74, 96, 62, 100, 78, 88], []);
  const [bars, setBars] = React.useState(targets.map(() => 0));
  React.useEffect(() => {
    const resetId = setTimeout(() => setBars(targets.map(() => 0)), 0);
    const timeouts = targets.map((target, i) =>
      setTimeout(() => setBars((p) => { const n = [...p]; n[i] = target; return n; }), 150 + i * 100)
    );
    return () => { clearTimeout(resetId); timeouts.forEach(clearTimeout); };
  }, [loop, targets]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="flex h-24 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.div key={i} animate={{ height: `${h}%` }} initial={{ height: "0%" }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex-1 rounded-sm bg-foreground/20" style={{ minHeight: 2 }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Điểm hôm nay", val: "+240", color: "text-primary" },
          { label: "Giao dịch", val: "12", color: "text-foreground" },
          { label: "Hạng", val: "Gold", color: "text-uni-teal-300" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center">
            <p className={cn("text-xl font-bold", m.color)}>{m.val}</p>
            <p className="text-[11px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentsViz() {
  const loop = useLoop(5000);
  const [activeStep, setActiveStep] = React.useState(-1);
  const steps = React.useMemo(
    () => [
      "Nhiệm vụ ngày mới",
      "Quét QR / mua hàng",
      "Nhận bonus điểm",
      "Cập nhật hạng",
      "Hoàn thành ✓",
    ],
    [],
  );
  React.useEffect(() => {
    const timeouts = steps.map((_, i) => setTimeout(() => setActiveStep(i), 500 + i * 700));
    timeouts.unshift(setTimeout(() => setActiveStep(-1), 0));
    return () => timeouts.forEach(clearTimeout);
  }, [loop, steps]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2.5">
        <Bot className="size-4 text-uni-teal-800" />
        <span className="font-mono text-sm text-muted-foreground">reso:mission-daily</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {steps.map((step, i) => (
          <motion.div key={step} animate={{ opacity: activeStep >= i ? 1 : 0.2 }} transition={{ duration: 0.25 }} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", activeStep === i && "bg-muted")}>
            <motion.div animate={{ scale: activeStep === i ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }} className={cn("size-2 shrink-0 rounded-full", activeStep > i ? "bg-primary" : activeStep === i ? "bg-uni-teal-800" : "bg-border")} />
            <span className="text-sm text-foreground">{step}</span>
            {activeStep > i && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                <CheckCircle2 className="size-3.5 text-primary" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EdgeViz() {
  const pops = [{ x: 20, y: 40 }, { x: 48, y: 28 }, { x: 76, y: 52 }, { x: 12, y: 62 }, { x: 60, y: 70 }, { x: 88, y: 35 }];
  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-border bg-muted/20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {pops.map((p, i) => (
          <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <motion.div animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }} className="absolute -inset-2 rounded-full bg-primary/20" />
            <div className="size-2.5 rounded-full bg-primary" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3">
        <span className="text-sm text-muted-foreground">Cửa hàng đối tác</span>
        <span className="font-mono text-xl font-bold text-foreground">120+</span>
      </div>
    </div>
  );
}

export interface Feature {
  title: string;
  description: string;
  viz: React.ComponentType;
  icon: LucideIcon;
  iconColor: string;
  badge: string;
  span?: string;
}

const defaultFeatures: Feature[] = [
  {
    title: "Cộng điểm tức thì",
    description:
      "Quét QR tại quầy — điểm vào ví RESO ngay sau giao dịch, không chờ đối soát, không nhầm số dư.",
    viz: InferenceViz,
    icon: Zap,
    iconColor: "text-uni-teal-300",
    badge: "Tức thì",
    span: "lg:col-span-2",
  },
  {
    title: "An toàn & minh bạch",
    description:
      "QR động đổi mỗi lần quét, lịch sử giao dịch rõ ràng — bảo vệ khách hàng và cửa hàng đối tác.",
    viz: SecurityViz,
    icon: Shield,
    iconColor: "text-primary",
    badge: "QR động",
  },
  {
    title: "Theo dõi ví & hạng",
    description:
      "Xem điểm tích lũy, giao dịch và hạng thành viên theo thời gian thực — mọi thứ trong một màn hình.",
    viz: AnalyticsViz,
    icon: BarChart2,
    iconColor: "text-uni-teal-800",
    badge: "Real-time",
  },
  {
    title: "Mạng cửa hàng đối tác",
    description:
      "BEATEA, DEER, PASSIO và hơn 120 thương hiệu F&B — tích điểm ở bất kỳ đâu trong hệ sinh thái RESO.",
    viz: IntegrationsViz,
    icon: Link2,
    iconColor: "text-uni-teal-700",
    badge: "120+ CH",
    span: "lg:col-span-2",
  },
  {
    title: "Nhiệm vụ & bonus",
    description:
      "Nhiệm vụ ngày/tuần, chuỗi hoàn thành và thưởng điểm — giữ chân người dùng và tăng tần suất ghé cửa hàng.",
    viz: AgentsViz,
    icon: Bot,
    iconColor: "text-uni-teal-300",
    badge: "Hàng ngày",
  },
  {
    title: "Phủ sóng toàn quốc",
    description:
      "Mạng lưới cửa hàng mở rộng liên tục — tích điểm gần bạn, mọi lúc trong ngày.",
    viz: EdgeViz,
    icon: Zap,
    iconColor: "text-primary",
    badge: "120+ CH",
  },
];

interface FeaturesProps {
  heading?: string;
  headingAccent?: string;
  features?: Feature[];
  className?: string;
}

export default function Features({
  heading = "Mọi thứ bạn cần",
  headingAccent = "để tích điểm thông minh.",
  features = defaultFeatures,
  className,
}: FeaturesProps) {
  return (
    <section id="features" className={cn("border-t border-border py-28 px-5", className)}>
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="mb-16 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
            <br />
            <span className="text-muted-foreground">{headingAccent}</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:auto-rows-fr">
          {features.map((feat, i) => {
            const Viz = feat.viz;
            const Icon = feat.icon;
            return (
              <FadeIn key={feat.title} delay={i * 0.05}>
                <div className={cn("group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-sm", feat.span)}>
                  <div className="flex flex-col justify-between gap-4 p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted">
                        <Icon className={cn("size-4", feat.iconColor)} />
                      </div>
                      <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {feat.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-foreground">{feat.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feat.description}</p>
                    </div>
                    <a
                      href="#how-it-works"
                      className="flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Xem cách hoạt động <ArrowRight className="size-3" />
                    </a>
                  </div>
                  <div className="mt-auto min-h-80 border-t border-border bg-muted/20">
                    <Viz />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}