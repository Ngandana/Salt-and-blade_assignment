import { NextResponse } from "next/server";
import { validators } from "@/lib/validate";
import { insertMessage } from "@/lib/store";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const fieldErrors = {
    name: validators.name(body.name),
    email: validators.email(body.email),
    message: validators.message(body.message),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return NextResponse.json({ error: "Check the highlighted fields.", fieldErrors }, { status: 422 });
  try {
    await insertMessage({ name: body.name.trim(), email: body.email.trim(), message: body.message.trim().slice(0, 2000) });
  } catch {
    return NextResponse.json({ error: "Your message didn't send. Try again or WhatsApp us." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
