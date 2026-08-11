import Link from "next/link";
import { BACK_TO_GALLERY, NOT_FOUND_TITLE, ROUTES } from "@/content/site";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 sm:px-10">
      <h1 className="font-serif text-3xl">{NOT_FOUND_TITLE}</h1>
      <Link
        href={ROUTES.home.path}
        className="mt-6 w-fit text-sm text-ink-muted transition-colors hover:text-ink"
      >
        {BACK_TO_GALLERY}
      </Link>
    </main>
  );
}
