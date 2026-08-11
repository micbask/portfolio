import { FOOTER_TEXT } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule px-6 py-10 sm:px-10">
      <p className="mx-auto max-w-3xl text-[12px] leading-relaxed text-ink-faint">
        {FOOTER_TEXT}
      </p>
    </footer>
  );
}
