import fs from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import LegalContent from "./legal-content";

async function getLegalMarkdown() {
  noStore();
  const filePath = path.join(process.cwd(), "docs", "terms-and-privacy-vi.md");
  return fs.readFile(filePath, "utf8");
}

export default async function LegalSection() {
  const content = await getLegalMarkdown();

  return (
    <section id="legal" className="bg-app-bg px-5 py-18 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-border/70 bg-background/95 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Pháp lý
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Điều khoản sử dụng và Chính sách quyền riêng tư
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              Nội dung bên dưới áp dụng cho việc truy cập và sử dụng Mini App
              Reso trên nền tảng Zalo Mini App.
            </p>
          </div>

          <LegalContent content={content} />
        </div>
      </div>
    </section>
  );
}
