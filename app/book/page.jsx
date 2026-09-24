import { Suspense } from "react";
import BookingFlow from "./BookingFlow";

export const metadata = { title: "Book an appointment", description: "Book a haircut, fade, beard trim or hot towel shave at Salt & Blade in Woodstock. Choose your barber and time, then add it to your calendar." };

export default function BookPage() {
  return (
    <section className="container-site py-10 md:py-14">
      <h1 className="sr-only">Book an appointment</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-ink-2" aria-label="Loading booking" />}>
        <BookingFlow />
      </Suspense>
    </section>
  );
}
