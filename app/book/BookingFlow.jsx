"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, LoaderCircle, CircleAlert, CalendarPlus, Download, Users, Clock, Tag } from "lucide-react";
import DatePicker from "./DatePicker";
import { SERVICES, CATEGORIES, BARBERS, PROMO, SHOP, getService, getBarber, formatPrice, formatDuration } from "@/lib/data";
import { shopNow, addDays, isBookableDate, hoursFor, buildSlots, formatDateLong, formatDateShort, formatTime, toMinutes } from "@/lib/time";
import { eventFromBooking, googleCalendarUrl, outlookCalendarUrl, icsQuery } from "@/lib/calendar";
import { validators } from "@/lib/validate";
import { BOOKING_RULES } from "@/lib/data";

const STEPS = ["Service", "Barber", "Date and time", "Your details", "Confirm"];
const EMPTY_DETAILS = { name: "", phone: "", email: "", notes: "" };

function firstBookableDate() {
  const { date: today, minutes } = shopNow();
  for (let i = 0; i <= BOOKING_RULES.maxDaysAhead; i++) {
    const d = addDays(today, i);
    if (!isBookableDate(d)) continue;
    // Skip today if the shop closes within the hour
    if (i === 0 && toMinutes(hoursFor(d).close) - minutes < 60 + BOOKING_RULES.leadTimeMinutes) continue;
    return d;
  }
  return today;
}

export default function BookingFlow() {
  const params = useSearchParams();
  const headingRef = useRef(null);
  const topRef = useRef(null);

  const presetService = getService(params.get("service"))?.id || "";
  const presetBarberRaw = params.get("barber");
  const presetBarber = presetBarberRaw === "any" || getBarber(presetBarberRaw) ? presetBarberRaw : "";
  const presetPromo = (params.get("promo") || "").toUpperCase() === PROMO.code ? PROMO.code : "";

  const [step, setStep] = useState(presetService ? (presetBarber ? 2 : 1) : 0);
  const [serviceId, setServiceId] = useState(presetService);
  const [barberId, setBarberId] = useState(presetBarber);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [errors, setErrors] = useState({});
  const [promoInput, setPromoInput] = useState(presetPromo);
  const [promo, setPromo] = useState(presetPromo);
  const [promoError, setPromoError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [availability, setAvailability] = useState({ date: "", bookings: [], loading: false, error: "" });
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const minDate = shopNow().date;
  const maxDate = addDays(minDate, BOOKING_RULES.maxDaysAhead);
  const service = getService(serviceId);
  const barber = barberId === "any" ? null : getBarber(barberId);

  useEffect(() => { if (!date) setDate(firstBookableDate()); }, [date]);

  const loadAvailability = useCallback(async (d) => {
    setAvailability((a) => ({ ...a, date: d, loading: true, error: "" }));
    try {
      const res = await fetch(`/api/availability?date=${d}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvailability({ date: d, bookings: data.bookings, loading: false, error: "" });
    } catch (e) {
      setAvailability({ date: d, bookings: [], loading: false, error: e.message || "Couldn't load times. Try again." });
    }
  }, []);

  useEffect(() => { if (step === 2 && date) loadAvailability(date); }, [step, date, loadAvailability]);

  const slots = useMemo(() => {
    if (!service || !date || availability.date !== date) return [];
    const ids = barberId === "any" || !barberId ? BARBERS.map((b) => b.id) : [barberId];
    return buildSlots({ dateStr: date, duration: service.duration, bookings: availability.bookings, barberIds: ids });
  }, [service, date, barberId, availability]);

  // Drop a chosen time that is no longer valid (service changed, slot taken, etc.)
  useEffect(() => {
    if (time && availability.date === date && !availability.loading && !slots.some((s) => s.time === time && s.freeBarbers.length)) setTime("");
  }, [slots, time, date, availability]);

  const goTo = (n) => {
    setStep(n);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const canReach = (n) => {
    if (n <= 0) return true;
    if (n === 1) return !!serviceId;
    if (n === 2) return !!serviceId && !!barberId;
    if (n === 3) return !!serviceId && !!barberId && !!time;
    if (n === 4) return canReach(3) && !Object.values(validateDetails(details)).some(Boolean);
    return false;
  };

  function validateDetails(v) {
    return { name: validators.name(v.name), phone: validators.phone(v.phone), email: validators.email(v.email) };
  }

  const setField = (k) => (e) => {
    const val = e.target.value;
    setDetails((d) => ({ ...d, [k]: val }));
    if (errors[k] && validators[k]) setErrors((er) => ({ ...er, [k]: validators[k](val) }));
  };
  const blurField = (k) => () => validators[k] && setErrors((er) => ({ ...er, [k]: validators[k](details[k]) }));

  const submitDetails = (e) => {
    e.preventDefault();
    const next = validateDetails(details);
    setErrors(next);
    const firstBad = Object.keys(next).find((k) => next[k]);
    if (firstBad) { document.getElementById(`b-${firstBad}`)?.focus(); return; }
    goTo(4);
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromo(""); setPromoError(""); return; }
    if (code === PROMO.code) { setPromo(code); setPromoError(""); }
    else { setPromo(""); setPromoError(`"${code}" isn't a valid code.`); }
  };

  const total = service ? (promo ? Math.round(service.price * (1 - PROMO.percent / 100)) : service.price) : 0;

  const confirmBooking = async () => {
    if (!acceptTerms) { setTermsError("Accept the booking terms to continue."); document.getElementById("b-terms")?.focus(); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, barberId, date, time, ...details, promo, acceptTerms }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setTime("");
        setNotice(data.error);
        await loadAvailability(date);
        goTo(2);
        return;
      }
      if (!res.ok) {
        if (data.fieldErrors) { setErrors(data.fieldErrors); goTo(3); return; }
        throw new Error(data.error);
      }
      setConfirmed(data.booking);
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("confirm-title")?.focus({ preventScroll: true });
      });
    } catch (e) {
      setSubmitError(e.message || "We couldn't save your booking. Try again, or call us to book.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setConfirmed(null); setStep(0); setServiceId(""); setBarberId(""); setTime(""); setDetails(EMPTY_DETAILS);
    setErrors({}); setAcceptTerms(false); setPromo(""); setPromoInput(""); setNotice(""); setDate(firstBookableDate());
  };

  if (confirmed) return <div ref={topRef} className="scroll-mt-24"><Confirmation booking={confirmed} onReset={reset} /></div>;

  const periods = [
    { label: "Morning", test: (m) => m < 12 * 60 },
    { label: "Afternoon", test: (m) => m >= 12 * 60 && m < 17 * 60 },
    { label: "Evening", test: (m) => m >= 17 * 60 },
  ];

  return (
    <div ref={topRef} className="scroll-mt-24 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <div className="min-w-0">
        {/* Stepper */}
        <nav aria-label="Booking progress">
          <ol className="flex gap-1.5 sm:gap-2">
            {STEPS.map((label, i) => {
              const done = i < step;
              const current = i === step;
              const reachable = i < step && canReach(i);
              return (
                <li key={label} className="flex-1">
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => goTo(i)}
                    aria-current={current ? "step" : undefined}
                    className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                  >
                    <span className={`h-1.5 w-full rounded-full transition-colors duration-300 ${done || current ? "bg-brass" : "bg-ink-3"}`} />
                    <span className={`hidden text-xs font-medium sm:block ${current ? "text-salt" : done ? "text-rope group-hover:text-brass" : "text-[#7f8f89]"}`}>
                      {done && <Check size={12} className="mr-1 inline" aria-hidden />}{label}
                    </span>
                    <span className="sr-only">{done ? ", completed" : current ? ", current step" : ""}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-sm text-rope sm:hidden">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </nav>

        <div key={step} className="fade-in mt-8">
          {step > 0 && (
            <button type="button" onClick={() => goTo(step - 1)} className="mb-4 inline-flex min-h-11 items-center gap-1 text-rope transition-colors duration-200 hover:text-salt">
              <ChevronLeft size={18} aria-hidden /> Back
            </button>
          )}

          {/* Step 1: service */}
          {step === 0 && (
            <fieldset>
              <legend><h2 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none md:text-4xl">Choose a service</h2></legend>
              <div className="mt-8 space-y-10">
                {CATEGORIES.map((c) => (
                  <div key={c.id}>
                    <h3 className="font-sans text-sm font-semibold text-rope">{c.name}</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {SERVICES.filter((s) => s.category === c.id).map((s) => (
                        <label key={s.id} className={`relative flex cursor-pointer flex-col rounded-2xl border-[1.5px] p-4 transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass ${serviceId === s.id ? "border-brass bg-brass/10" : "border-ink-3 hover:border-rope"}`}>
                          <input type="radio" name="service" value={s.id} checked={serviceId === s.id}
                            onChange={() => { setServiceId(s.id); setTime(""); }} className="sr-only" />
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="font-semibold">{s.name}</span>
                            <span className="font-display text-lg font-semibold text-brass tabular-nums">{formatPrice(s.price)}</span>
                          </span>
                          <span className="mt-1 text-sm text-rope">{s.description}</span>
                          <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-salt"><Clock size={14} aria-hidden /> {formatDuration(s.duration)}</span>
                          {serviceId === s.id && <Check size={18} className="absolute right-3 top-3 hidden text-brass" aria-hidden />}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <StepActions onNext={() => goTo(1)} disabled={!serviceId} hint={!serviceId ? "Choose a service to continue." : ""} />
            </fieldset>
          )}

          {/* Step 2: barber */}
          {step === 1 && (
            <fieldset>
              <legend><h2 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none md:text-4xl">Choose your barber</h2></legend>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <BarberOption id="any" checked={barberId === "any"} onSelect={setBarberId}
                  title="Any available barber" subtitle="Shows the most times. We'll match you with whoever is free." icon />
                {BARBERS.map((b) => (
                  <BarberOption key={b.id} id={b.id} checked={barberId === b.id} onSelect={setBarberId}
                    title={b.name} subtitle={b.specialty} image={b.image} />
                ))}
              </div>
              <StepActions onNext={() => goTo(2)} disabled={!barberId} hint={!barberId ? "Choose a barber to continue." : ""} />
            </fieldset>
          )}

          {/* Step 3: date and time */}
          {step === 2 && (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none md:text-4xl">Pick a date and time</h2>
              {notice && (
                <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-danger">
                  <CircleAlert size={18} aria-hidden /> {notice}
                </p>
              )}
              <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,20rem)_1fr]">
                <DatePicker value={date} onChange={(d) => { setDate(d); setTime(""); setNotice(""); }} minDate={minDate} maxDate={maxDate} />
                <div aria-live="polite" aria-busy={availability.loading}>
                  <p className="font-semibold">{date && formatDateLong(date)}</p>
                  <p className="text-sm text-rope">{service?.name}, {service && formatDuration(service.duration)}. Times are Cape Town time.</p>
                  {availability.loading ? (
                    <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4" aria-label="Loading times">
                      {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-11 animate-pulse rounded-xl bg-ink-2" />)}
                    </div>
                  ) : availability.error ? (
                    <div className="mt-6 rounded-xl border border-danger/40 bg-danger/10 p-4">
                      <p className="text-danger">{availability.error}</p>
                      <button type="button" onClick={() => loadAvailability(date)} className="btn btn-ghost mt-3 !min-h-11">Try again</button>
                    </div>
                  ) : slots.filter((s) => s.freeBarbers.length).length === 0 ? (
                    <p className="mt-6 rounded-xl border border-ink-3 bg-ink-2 p-4 text-rope">No times left on this day for this service. Choose another date{barberId !== "any" ? ", or switch to any available barber" : ""}.</p>
                  ) : (
                    <div className="mt-6 space-y-6">
                      {periods.map((p) => {
                        const list = slots.filter((s) => p.test(toMinutes(s.time)));
                        if (!list.length) return null;
                        return (
                          <fieldset key={p.label}>
                            <legend className="text-sm font-semibold text-rope">{p.label}</legend>
                            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {list.map((s) => {
                                const free = s.freeBarbers.length > 0;
                                const selected = time === s.time;
                                return (
                                  <button key={s.time} type="button" disabled={!free} onClick={() => setTime(s.time)} aria-pressed={selected}
                                    aria-label={`${formatTime(s.time)}${free ? "" : ", booked"}`}
                                    className={`h-11 rounded-xl border-[1.5px] text-sm font-medium tabular-nums transition-colors duration-200 ${
                                      selected ? "border-brass bg-brass text-ink" : free ? "border-ink-3 hover:border-brass" : "border-transparent bg-ink-2 text-[#5d6d68] line-through"
                                    }`}>
                                    {formatTime(s.time)}
                                  </button>
                                );
                              })}
                            </div>
                          </fieldset>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <StepActions onNext={() => goTo(3)} disabled={!time} hint={!time ? "Choose a time to continue." : ""} />
            </div>
          )}

          {/* Step 4: details */}
          {step === 3 && (
            <form onSubmit={submitDetails} noValidate>
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none md:text-4xl">Your details</h2>
              <p className="mt-2 text-rope">We'll only use these to confirm and manage your booking.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <TextField id="name" label="Full name" autoComplete="name" value={details.name} error={errors.name} onChange={setField("name")} onBlur={blurField("name")} className="sm:col-span-2" />
                <TextField id="phone" label="Mobile number" type="tel" autoComplete="tel" placeholder="082 123 4567" value={details.phone} error={errors.phone} onChange={setField("phone")} onBlur={blurField("phone")} />
                <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="name@example.com" value={details.email} error={errors.email} onChange={setField("email")} onBlur={blurField("email")} />
                <div className="sm:col-span-2">
                  <label htmlFor="b-notes" className="mb-2 block font-medium">Anything we should know? <span className="font-normal text-rope">(optional)</span></label>
                  <textarea id="b-notes" rows={3} maxLength={500} value={details.notes} onChange={setField("notes")} className="field resize-y" placeholder="Reference photo on the way, sensitive skin, first haircut..." />
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button type="submit" className="btn btn-primary w-full sm:w-auto">Review booking</button>
              </div>
            </form>
          )}

          {/* Step 5: review */}
          {step === 4 && (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none md:text-4xl">Check and confirm</h2>
              <dl className="mt-8 divide-y divide-ink-3 rounded-2xl border border-ink-3 bg-ink-2 px-5">
                <ReviewRow label="Service" value={`${service.name} (${formatDuration(service.duration)})`} onEdit={() => goTo(0)} />
                <ReviewRow label="Barber" value={barber ? barber.name : "Any available barber"} onEdit={() => goTo(1)} />
                <ReviewRow label="When" value={`${formatDateLong(date)} at ${formatTime(time)}`} onEdit={() => goTo(2)} />
                <ReviewRow label="Your details" value={`${details.name}, ${details.phone}, ${details.email}`} onEdit={() => goTo(3)} />
              </dl>

              <div className="mt-6">
                <label htmlFor="b-promo" className="mb-2 block font-medium">Promo code <span className="font-normal text-rope">(optional)</span></label>
                <div className="flex gap-2">
                  <input id="b-promo" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} onBlur={applyPromo}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }}
                    aria-invalid={!!promoError} aria-describedby="b-promo-msg" className="field font-mono uppercase" placeholder={PROMO.code} autoComplete="off" />
                  <button type="button" onClick={applyPromo} className="btn btn-ghost shrink-0">Apply</button>
                </div>
                <p id="b-promo-msg" aria-live="polite" className={`mt-2 flex items-center gap-2 text-sm ${promoError ? "text-danger" : "text-success"}`}>
                  {promoError ? <><CircleAlert size={16} aria-hidden /> {promoError}</> : promo ? <><Tag size={16} aria-hidden /> {PROMO.label} applied.</> : null}
                </p>
              </div>

              <div className="mt-6">
                <label htmlFor="b-terms" className="flex cursor-pointer items-start gap-3">
                  <input id="b-terms" type="checkbox" checked={acceptTerms} onChange={(e) => { setAcceptTerms(e.target.checked); setTermsError(""); }}
                    aria-invalid={!!termsError} aria-describedby={termsError ? "b-terms-err" : undefined}
                    className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-[#cfa55b]" />
                  <span>I agree to the <Link href="/terms" target="_blank" className="text-brass underline underline-offset-4">Terms &amp; Conditions</Link>, including 24 hours' notice for cancellations.</span>
                </label>
                {termsError && <p id="b-terms-err" className="mt-2 flex items-center gap-2 text-sm text-danger"><CircleAlert size={16} aria-hidden /> {termsError}</p>}
              </div>

              {submitError && <p role="alert" className="mt-6 flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-danger"><CircleAlert size={18} aria-hidden /> {submitError}</p>}

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-lg">Total at the shop: <span className="font-display text-2xl font-semibold text-brass">{formatPrice(total)}</span>{promo && <span className="ml-2 text-sm text-rope line-through">{formatPrice(service.price)}</span>}</p>
                <button type="button" onClick={confirmBooking} disabled={submitting} className="btn btn-primary text-lg">
                  {submitting ? <><LoaderCircle size={20} className="animate-spin" aria-hidden /> Confirming</> : "Confirm booking"}
                </button>
              </div>
              <p className="mt-3 text-sm text-rope">No payment needed now. Pay by card or cash after your appointment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <aside aria-label="Booking summary" className="h-fit rounded-2xl border border-ink-3 bg-ink-2 p-5 lg:sticky lg:top-24">
        <h2 className="font-sans text-sm font-semibold text-rope">Your booking</h2>
        <dl className="mt-4 space-y-3 text-[0.95rem]">
          <SummaryRow label="Service" value={service ? service.name : "Not chosen"} muted={!service} />
          <SummaryRow label="Barber" value={barberId === "any" ? "Any available" : barber?.name || "Not chosen"} muted={!barberId} />
          <SummaryRow label="Date" value={time && date ? formatDateShort(date) : "Not chosen"} muted={!time} />
          <SummaryRow label="Time" value={time ? `${formatTime(time)} to ${formatTime(endTime(time, service?.duration))}` : "Not chosen"} muted={!time} />
        </dl>
        <div className="mt-5 flex items-baseline justify-between border-t border-ink-3 pt-4">
          <span className="text-rope">Total</span>
          <span className="font-display text-2xl font-semibold text-brass">{service ? formatPrice(total) : "R0"}</span>
        </div>
        <p className="mt-4 text-xs text-rope">Questions? Call <a href={SHOP.phoneHref} className="underline underline-offset-2">{SHOP.phone}</a></p>
      </aside>
    </div>
  );
}

function endTime(time, duration = 0) {
  const m = toMinutes(time) + duration;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function StepActions({ onNext, disabled, hint }) {
  return (
    <div className="mt-10 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
      {hint && <p className="text-sm text-rope sm:order-first">{hint}</p>}
      <button type="button" onClick={onNext} disabled={disabled} className="btn btn-primary">Continue</button>
    </div>
  );
}

function BarberOption({ id, checked, onSelect, title, subtitle, image, icon }) {
  return (
    <label className={`flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] p-3 transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass ${checked ? "border-brass bg-brass/10" : "border-ink-3 hover:border-rope"}`}>
      <input type="radio" name="barber" value={id} checked={checked} onChange={() => onSelect(id)} className="sr-only" />
      {icon ? (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ink-3 text-brass"><Users size={26} aria-hidden /></span>
      ) : (
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-3">
          <Image src={image} alt="" fill sizes="64px" className="object-cover" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-rope">{subtitle}</span>
      </span>
      <span className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-brass bg-brass text-ink" : "border-ink-3"}`} aria-hidden>
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
    </label>
  );
}

function TextField({ id, label, error, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={`b-${id}`} className="mb-2 block font-medium">{label}</label>
      <input id={`b-${id}`} name={id} aria-invalid={!!error} aria-describedby={error ? `b-${id}-err` : undefined} className="field" {...props} />
      {error && <p id={`b-${id}-err`} className="mt-2 flex items-center gap-2 text-sm text-danger"><CircleAlert size={16} className="shrink-0" aria-hidden /> {error}</p>}
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <dt className="text-sm text-rope">{label}</dt>
        <dd className="mt-0.5 break-words font-medium">{value}</dd>
      </div>
      <button type="button" onClick={onEdit} className="min-h-11 shrink-0 px-2 text-sm font-medium text-brass underline underline-offset-4" aria-label={`Change ${label.toLowerCase()}`}>Change</button>
    </div>
  );
}

function SummaryRow({ label, value, muted }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-rope">{label}</dt>
      <dd className={`text-right ${muted ? "text-[#7f8f89]" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

function Confirmation({ booking, onReset }) {
  const service = getService(booking.serviceId);
  const barber = getBarber(booking.barberId);
  const ev = eventFromBooking(booking);
  const icsHref = `/api/ics?${icsQuery(booking)}`;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success"><Check size={28} strokeWidth={2.5} aria-hidden /></span>
        <h2 id="confirm-title" tabIndex={-1} className="mt-5 text-4xl font-semibold outline-none md:text-5xl">You're booked in, {booking.name.split(" ")[0]}.</h2>
        <p className="mt-3 text-rope">We've saved your appointment. Add it to your calendar so you don't miss it.</p>
      </div>

      {/* Ticket */}
      <div className="on-light mt-10 overflow-hidden rounded-3xl bg-salt-2 text-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]">
        <div className="flex h-2.5" aria-hidden>
          <span className="flex-1 bg-pole" /><span className="flex-1 bg-salt" /><span className="flex-1 bg-[#2f5d8a]" /><span className="flex-1 bg-salt" /><span className="flex-1 bg-pole" /><span className="flex-1 bg-salt" />
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <p className="text-sm text-[#4a5553]">Appointment</p>
            <p className="font-display text-3xl font-semibold">{service.name}</p>
            <p className="mt-1 text-[#3d4947]">with {barber.name}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-[#4a5553]">Reference</p>
            <p className="font-mono text-2xl font-semibold tracking-wider">{booking.ref}</p>
          </div>
        </div>
        <div className="ticket-perf" aria-hidden />
        <dl className="grid gap-5 bg-salt p-6 sm:grid-cols-3 sm:p-8">
          <div><dt className="text-sm text-[#4a5553]">Date</dt><dd className="mt-1 font-semibold">{formatDateLong(booking.date)}</dd></div>
          <div><dt className="text-sm text-[#4a5553]">Time</dt><dd className="mt-1 font-semibold">{formatTime(booking.time)} to {formatTime(endTime(booking.time, service.duration))}</dd></div>
          <div><dt className="text-sm text-[#4a5553]">Pay at the shop</dt><dd className="mt-1 font-semibold">{formatPrice(booking.total)}{booking.promo && <span className="block text-sm font-normal text-[#4a5553]">{booking.promo} applied</span>}</dd></div>
          <div className="sm:col-span-3"><dt className="text-sm text-[#4a5553]">Where</dt><dd className="mt-1 font-semibold">{SHOP.name}, {SHOP.address}</dd></div>
        </dl>
      </div>

      <section aria-labelledby="cal-title" className="mt-10">
        <h3 id="cal-title" className="text-2xl font-semibold">Add to your calendar</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <a href={googleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <CalendarPlus size={18} aria-hidden /> Google Calendar
          </a>
          <a href={icsHref} className="btn btn-ghost">
            <Download size={18} aria-hidden /> Apple Calendar
          </a>
          <a href={outlookCalendarUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <CalendarPlus size={18} aria-hidden /> Outlook
          </a>
        </div>
        <p className="mt-3 text-sm text-rope">
          The Apple option downloads an .ics file that also works with Outlook desktop, Samsung Calendar and most other calendar apps. It includes a reminder one hour before.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-ink-3 bg-ink-2 p-6">
        <h3 className="text-xl font-semibold">Before you come in</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[#d6d0c4]">
          <li>Arrive five minutes early. We hold your chair for 10 minutes after your start time.</li>
          <li>Need to change or cancel? WhatsApp <a href={SHOP.whatsapp} target="_blank" rel="noopener noreferrer" className="text-brass underline underline-offset-4">{SHOP.whatsappDisplay}</a> with your reference at least 24 hours before.</li>
          <li>Free street parking is available on Albert Road.</li>
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={onReset} className="btn btn-ghost">Book another appointment</button>
        <Link href="/" className="btn btn-ghost">Back to home</Link>
      </div>
    </div>
  );
}
