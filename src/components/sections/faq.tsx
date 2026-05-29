"use client";

import { FadeIn } from "@/components/fade-in";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  heading?: string;
  ctaText?: string;
  ctaHref?: string;
  items?: FAQItem[];
  className?: string;
}

const defaultItems: FAQItem[] = [
  {
    q: "RESO có mất phí khi đăng ký không?",
    a: "Không. Bạn đăng ký qua mini app miễn phí bằng SĐT hoặc Google/Apple và nhận 50 điểm chào mừng. Hiện chưa cần tải app từ App Store hay CH Play.",
  },
  {
    q: "Tích điểm bằng cách nào?",
    a: "Ghé cửa hàng đối tác, mở mini app và quét QR tại quầy. Điểm được cộng tức thì vào ví RESO; mỗi giao dịch dùng QR động để an toàn hơn.",
  },
  {
    q: "Hạng thành viên (Bronze → Platinum) hoạt động ra sao?",
    a: "Điểm tích lũy theo chu kỳ sẽ tự nâng hạng khi đạt ngưỡng. Hạng cao hơn mở thêm ưu đãi, voucher và quà độc quyền — chi tiết hiển thị ngay trong app.",
  },
  {
    q: "Đổi voucher hoặc quà như thế nào?",
    a: "Vào ví điểm trong mini app, chọn phần thưởng (voucher, đồ uống, quà vật lý) và đổi bằng số dư. Một số quà nhận tại quầy, một số hỗ trợ giao ship tùy chương trình.",
  },
  {
    q: "Điểm có bị hết hạn không?",
    a: "Điểm gắn với chu kỳ hạng thành viên; quy tắc hết hạn (nếu có) được thông báo rõ trong app trước khi áp dụng. Bạn luôn xem được lịch sử tích/lũy và số dư theo thời gian thực.",
  },
  {
    q: "Dữ liệu cá nhân và giao dịch có được bảo mật không?",
    a: "RESO chỉ dùng thông tin cần thiết cho tài khoản và tích điểm; không bán dữ liệu cho bên thứ ba. QR đổi theo từng lần quét, lịch sử giao dịch minh bạch để bạn và cửa hàng đối soát.",
  },
];

function FAQRow({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div layout className="border-b border-border">
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-4 py-5 text-left">
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border", isOpen && "border-foreground bg-foreground text-background")}
        >
          {isOpen ? <Minus className="size-3" /> : <Plus className="size-3" />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="overflow-hidden">
            <motion.p initial={{ y: -6 }} animate={{ y: 0 }} exit={{ y: -6 }} transition={{ duration: 0.25, ease: "easeOut" }} className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ({
  heading = "Câu hỏi thường gặp",
  ctaText = "Liên hệ",
  ctaHref = "#contact",
  items = defaultItems,
  className,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={cn("border-t border-border px-5 py-24", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <FadeIn>
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{heading}</h2>
              <ShinyButton href={ctaHref} className="mt-2 w-fit gap-2">{ctaText}</ShinyButton>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="border-t border-border">
              {items.map((item, idx) => (
                <FAQRow key={idx} q={item.q} a={item.a} isOpen={openIndex === idx} onToggle={() => setOpenIndex(openIndex === idx ? null : idx)} />
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
