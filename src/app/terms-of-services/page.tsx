import type { Metadata } from "next";
import Footer from "@/components/sections/footer";
import LegalSection from "@/components/sections/legal";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ",
  description:
    "Điều khoản dịch vụ và chính sách quyền riêng tư áp dụng cho Reso trên Zalo Mini App và ứng dụng.",
};

export default function TermsOfServicesPage() {
  return (
    <>
      <main className="min-h-dvh">
        <LegalSection />
      </main>
      <Footer />
    </>
  );
}
