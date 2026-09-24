"use client";
import { useState } from "react";
import { LoaderCircle, CircleCheck, CircleAlert } from "lucide-react";
import { validators } from "@/lib/validate";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverError, setServerError] = useState("");

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validators[k](e.target.value) }));
  };
  const blur = (k) => () => setErrors((er) => ({ ...er, [k]: validators[k](values[k]) }));

  const submit = async (e) => {
    e.preventDefault();
    const next = Object.fromEntries(Object.keys(values).map((k) => [k, validators[k](values[k])]));
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      document.getElementById(`c-${Object.keys(next).find((k) => next[k])}`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json();
      if (!res.ok) { setErrors(data.fieldErrors || {}); throw new Error(data.error); }
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setServerError(err.message || "Your message didn't send. Try again or WhatsApp us.");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="fade-in mt-6 flex gap-3 rounded-2xl border border-success/40 bg-success/10 p-5">
        <CircleCheck className="shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-semibold">Message sent.</p>
          <p className="mt-1 text-rope">Thanks for getting in touch. We'll reply by email within one working day.</p>
          <button type="button" onClick={() => setStatus("idle")} className="link-underline mt-3 min-h-11 font-medium">Send another message</button>
        </div>
      </div>
    );
  }

  const Field = ({ id, label, type = "text", autoComplete, textarea }) => {
    const Comp = textarea ? "textarea" : "input";
    return (
      <div>
        <label htmlFor={`c-${id}`} className="mb-2 block font-medium">{label}</label>
        <Comp
          id={`c-${id}`} name={id} type={textarea ? undefined : type} autoComplete={autoComplete} rows={textarea ? 5 : undefined}
          value={values[id]} onChange={set(id)} onBlur={blur(id)}
          aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `c-${id}-err` : undefined}
          className={`field ${textarea ? "resize-y" : ""}`}
        />
        {errors[id] && <p id={`c-${id}-err`} className="mt-2 flex items-center gap-2 text-sm text-danger"><CircleAlert size={16} aria-hidden />{errors[id]}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-5">
      {Field({ id: "name", label: "Your name", autoComplete: "name" })}
      {Field({ id: "email", label: "Email", type: "email", autoComplete: "email" })}
      {Field({ id: "message", label: "Message", textarea: true })}
      {status === "error" && <p role="alert" className="text-sm text-danger">{serverError}</p>}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto">
        {status === "sending" ? <><LoaderCircle size={18} className="animate-spin" aria-hidden /> Sending</> : "Send message"}
      </button>
    </form>
  );
}
