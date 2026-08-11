import type { Metadata } from "next";
import Link from "next/link";
import { FeaturedTile } from "@/components/gallery/FeaturedTile";
import { THUMBNAILS } from "@/components/gallery/Thumbnails";
import { GALLERY_TILES, HEADER_LINKS, NAME, ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: ROUTES.home.title,
  description: ROUTES.home.description,
  openGraph: {
    title: ROUTES.home.title,
    description: ROUTES.home.description,
  },
};

export default function Page() {
  return (
    <>
      <header className="mx-auto flex max-w-[1120px] items-baseline justify-between gap-6 px-5 py-7 sm:px-8 sm:py-10">
        <span className="font-serif text-lg tracking-[-0.01em] sm:text-xl">{NAME}</span>
        <nav className="flex gap-5 sm:gap-7">
          {HEADER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 pb-20 sm:px-8 sm:pb-24">
        <FeaturedTile />

        <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
          {GALLERY_TILES.map((tile, index) => {
            const Thumbnail = THUMBNAILS[index];
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group block border border-rule bg-surface transition-colors hover:border-ink/25"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-ground/60 px-4 py-4">
                  <Thumbnail />
                </div>
                <p className="border-t border-rule px-5 py-4 text-[13px] leading-snug text-ink transition-colors group-hover:text-accent sm:text-sm">
                  {tile.caption}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
