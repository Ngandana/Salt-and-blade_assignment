import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { GALLERY } from "@/lib/data";

export const metadata = { title: "Gallery", description: "Fades, designs, beards and shaves from the chairs at Salt & Blade, Woodstock." };

export default function GalleryPage() {
  return (
    <>
      <PageIntro title="Fresh off the chair">A few recent favourites. Follow us on Instagram for the daily feed.</PageIntro>
      <section className="container-site py-12 md:py-16">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g) => (
            <li key={g.src} className="relative aspect-square overflow-hidden rounded-2xl bg-ink-2">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Link href="/book" className="btn btn-primary">Book your cut</Link>
        </div>
      </section>
    </>
  );
}
