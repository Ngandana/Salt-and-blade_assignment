import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="h-16 w-16 text-brass" />
      <h1 className="mt-6 text-4xl font-semibold md:text-5xl">This page took a little off the top.</h1>
      <p className="mt-4 max-w-md text-rope">The page you're looking for doesn't exist or has moved. Your next haircut, however, is two clicks away.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/book" className="btn btn-primary">Book an appointment</Link>
        <Link href="/" className="btn btn-ghost">Back to home</Link>
      </div>
    </section>
  );
}
