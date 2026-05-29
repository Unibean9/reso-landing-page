"use client";

import { FadeIn } from "@/components/fade-in";
import { KineticTestimonials, type Testimonial } from "@/components/ui/kinetic-testimonials";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  heading?: string;
  rows?: Testimonial[][];
  className?: string;
}

const defaultRow1: Testimonial[] = [
  {
    quote: "RESO gom toàn bộ điểm thưởng vào một nơi. Team vận hành tiết kiệm được vài ngày mỗi tuần.",
    name: "Nguyễn Thị Lan",
    role: "Giám đốc vận hành — Deer Coffee",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    quote: "Bảng báo cáo chiến dịch rất rõ. Tháng đầu đã giảm gần 80% thời gian làm báo cáo thủ công.",
    name: "Trần Minh Đức",
    role: "Nhà sáng lập — Betea",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    quote: "Bảo mật và phân quyền làm chúng tôi yên tâm triển khai cho hàng nghìn thành viên.",
    name: "Phạm Hương Giang",
    role: "Trưởng marketing — Passio Coffee",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    quote: "Tưởng phải mất vài tháng, nhưng chương trình loyalty chạy ổn chỉ sau vài ngày triển khai.",
    name: "Lê Hoàng Nam",
    role: "Chuỗi F&B — 12 chi nhánh",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
];

const defaultRow2: Testimonial[] = [
  {
    quote: "Tạo chiến dịch tặng điểm nhanh như đăng bài. Team marketing tự làm được, không cần chờ dev.",
    name: "Võ Thị Mai",
    role: "Trưởng phòng chăm sóc khách hàng",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    quote: "Chuyển từ Excel và nhiều app rời — khách check-in mượt, số liệu khớp ngay trong ngày.",
    name: "Hoàng Quốc Bảo",
    role: "Quản lý sản phẩm",
    avatar: "https://i.pravatar.cc/100?img=6",
  },
  {
    quote: "Khách quét QR là tích điểm xong. Tỷ lệ quay lại cửa hàng tăng rõ sau hai tháng.",
    name: "Đặng Thu Hà",
    role: "Chủ cửa hàng — Specialty Coffee",
    avatar: "https://i.pravatar.cc/100?img=7",
  },
  {
    quote: "Tích hợp POS ổn định, API dễ dùng. Team kỹ thuật triển khai không phải thức đêm.",
    name: "Bùi Văn Kiệt",
    role: "Kỹ thuật — Tập đoàn F&B",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
];

export default function Testimonials({
  heading = "Được tin dùng trên toàn quốc.",
  rows = [defaultRow1, defaultRow2],
  className,
}: TestimonialsProps) {
  return (
    <section id="testimonials" className={cn("border-t border-border py-24 overflow-hidden", className)}>
      <div className="mx-auto max-w-6xl px-5">
        <FadeIn>
          <h2 className="mb-16 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
        </FadeIn>
      </div>
      <KineticTestimonials rows={rows} />
    </section>
  );
}