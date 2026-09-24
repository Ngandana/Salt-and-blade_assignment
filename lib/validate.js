// Shared by the client (inline validation on blur) and the server (never trust the client).
export const validators = {
  name: (v) => (!v || v.trim().length < 2 ? "Enter your full name." : ""),
  phone: (v) => {
    const digits = (v || "").replace(/[\s()-]/g, "");
    return /^(\+27|0)[6-8]\d{8}$/.test(digits) || /^(\+27|0)[1-5]\d{8}$/.test(digits)
      ? ""
      : "Enter a South African number, for example 082 123 4567.";
  },
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim()) ? "" : "Enter a valid email address, for example name@example.com."),
  message: (v) => (!v || v.trim().length < 10 ? "Write at least a sentence so we can help." : ""),
};
