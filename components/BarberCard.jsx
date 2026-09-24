import Image from "next/image";
import Link from "next/link";

export default function BarberCard({ barber, full = false }) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2">
        <Image
          src={barber.image}
          alt={`Portrait of ${barber.name}, ${barber.role.toLowerCase()}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{barber.name}</h3>
      <p className="mt-1 text-rope">{barber.role}, {barber.years} years behind the chair</p>
      <p className="mt-1 text-sm text-brass">{barber.specialty}</p>
      {full && <p className="mt-3 text-[#d6d0c4]">{barber.bio}</p>}
      <Link href={`/book?barber=${barber.id}`} className="link-underline mt-3 inline-flex min-h-11 items-center self-start font-medium">
        Book with {barber.name.split(" ")[0]}
      </Link>
    </article>
  );
}
