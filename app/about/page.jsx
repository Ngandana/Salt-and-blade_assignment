import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import BarberCard from "@/components/BarberCard";
import { BARBERS, SHOP } from "@/lib/data";

export const metadata = { title: "About us and our barbers", description: "The story of Salt & Blade Barber Co. and the four barbers behind the chairs in Woodstock, Cape Town." };

const values = [
  { title: "Time over turnover", text: "We book realistic appointment lengths so nobody's fade gets rushed to make the next slot." },
  { title: "Craft you can see", text: "Straight razors, hot towels and hand-blended fades. We train every Monday morning before opening." },
  { title: "Everyone's local", text: "Students, grandfathers, first haircuts and wedding mornings. If you're in the chair, you're a regular." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro title="One chair became four">
        Salt &amp; Blade opened in {SHOP.founded} in a converted warehouse on Albert Road. The salt is the sea air that blows up from the harbour. The blade is the part we take seriously.
      </PageIntro>

      <section className="container-site grid items-start gap-10 py-16 md:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="space-y-5 text-lg text-[#d6d0c4]">
          <p>Thabo Mokoena spent his twenties cutting hair wherever there was a plug point: his mother's stoep in Gugulethu, a friend's spaza shop, the back of a Mowbray salon. In 2016 he signed a lease on a tiny unit in Woodstock, bought one second-hand Belmont chair and put a kettle on.</p>
          <p>Word travelled. Yusuf joined in 2018 and brought his grandfather's straight razors from the Bo-Kaap. Lindi arrived in 2020 with a portfolio of designs nobody else in the city was cutting, and Ruan followed in 2022.</p>
          <p>We still do things the slow way. Every appointment starts with a conversation, every shave starts with three hot towels, and nobody leaves until they're happy with what they see in the mirror.</p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-2">
          <Image src="/images/tools.webp" alt="Straight razors, scissors and combs laid out on the Salt & Blade counter" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-salt-2 text-ink">
        <div className="on-light container-site py-16 lg:py-20">
          <h2 className="text-4xl font-semibold">What we care about</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="border-t-2 border-ink pt-5">
                <h3 className="text-2xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-[#3d4947]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="barbers" className="scroll-mt-24 container-site py-16 lg:py-24">
        <h2 className="text-4xl font-semibold md:text-5xl">The barbers</h2>
        <p className="mt-4 max-w-2xl text-rope">Everyone cuts everything, but each of us has a speciality. Not sure who to choose? Pick "Any available barber" when you book.</p>
        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {BARBERS.map((b) => <BarberCard key={b.id} barber={b} full />)}
        </div>
        <Link href="/book" className="btn btn-primary mt-14">Book an appointment</Link>
      </section>
    </>
  );
}
