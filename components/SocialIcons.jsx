// Brand icons as inline SVG (Lucide no longer ships brand marks).
const base = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true };

export const InstagramIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const FacebookIcon = () => (
  <svg {...base} fill="currentColor"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z" /></svg>
);
export const TikTokIcon = () => (
  <svg {...base} fill="currentColor"><path d="M16.6 3c.4 2.2 1.8 3.6 4 3.8v3.1c-1.5.1-2.8-.4-4-1.1v6.1c0 3.4-2.6 5.9-5.8 5.9A5.8 5.8 0 0 1 5 15c0-3.5 3-6.2 6.6-5.8v3.2c-1.7-.4-3.4.8-3.4 2.6 0 1.5 1.2 2.7 2.7 2.7 1.6 0 2.7-1.2 2.7-3V3z" /></svg>
);
export const WhatsAppIcon = () => (
  <svg {...base} fill="currentColor"><path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.7 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5m0 17.1c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 1 1 12 19.6m4.3-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1c-.1.1-.3.2-.5 0a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6s1.8 2.7 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.1-.4-.2" /></svg>
);
