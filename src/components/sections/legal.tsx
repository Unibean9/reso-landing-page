import fs from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import LegalContent from "./legal-content";

async function getLegalMarkdown() {
  noStore();
  const docsPath = path.join(process.cwd(), "docs");

  const [miniAppContent, appContent] = await Promise.all([
    fs.readFile(
      path.join(docsPath, "terms-and-privacy-zalo-miniapp-vi.md"),
      "utf8",
    ),
    fs.readFile(path.join(docsPath, "terms-and-privacy-app-vi.md"), "utf8"),
  ]);

  return {
    miniApp: miniAppContent,
    app: appContent,
  };
}

export default async function LegalSection() {
  const content = await getLegalMarkdown();

  return (
    <section id="legal" className="bg-app-bg px-5 py-18 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <LegalContent
          contents={[
            {
              id: "miniapp",
              label: "Zalo Mini App",
              description: "Điều khoản áp dụng cho Reso trên nền tảng Zalo.",
              content: content.miniApp,
            },
            {
              id: "app",
              label: "Ứng dụng",
              description: "Điều khoản áp dụng cho phiên bản app độc lập.",
              content: content.app,
            },
          ]}
        />
      </div>
    </section>
  );
}
