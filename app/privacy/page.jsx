import PageIntro from "@/components/PageIntro";
import { SHOP } from "@/lib/data";

export const metadata = { title: "Privacy Policy", description: "How Salt & Blade Barber Co. collects, uses and protects your personal information under POPIA." };

export default function PrivacyPage() {
  return (
    <>
      <PageIntro title="Privacy Policy">Last updated 24 September 2026. How we handle your personal information under the Protection of Personal Information Act (POPIA).</PageIntro>
      <article className="prose-legal container-site py-12 lg:py-16">
        <h2 className="!mt-0">Who we are</h2>
        <p>Salt &amp; Blade Barber Co. (Pty) Ltd, {SHOP.address}, is the responsible party for personal information collected through this website and in our shop. Our information officer can be reached at {SHOP.email}.</p>

        <h2>What we collect</h2>
        <ul>
          <li>Booking details: your name, mobile number, email address, chosen service, barber, date and time, and any notes you add.</li>
          <li>Contact form messages: your name, email address and message.</li>
          <li>Basic technical data your browser sends, such as device type, used only to keep the site working and secure.</li>
        </ul>

        <h2>Why we use it</h2>
        <ul>
          <li>To confirm, manage and remind you about appointments.</li>
          <li>To reply to your questions.</li>
          <li>To prevent double bookings and keep the booking system running properly.</li>
        </ul>
        <p>We do not sell your information and we do not send marketing messages unless you ask us to.</p>

        <h2>Who we share it with</h2>
        <p>Only the service providers that run our website and booking database, under agreements that require them to protect it. We may disclose information if the law requires it.</p>

        <h2>How long we keep it</h2>
        <p>Booking records are kept for 24 months so we can see your history and preferences, then deleted. Contact messages are deleted after 12 months.</p>

        <h2>Cookies and storage</h2>
        <p>We don't use advertising or tracking cookies. The site uses your browser's session storage only to remember that you've already seen our first-visit offer.</p>

        <h2>Your rights</h2>
        <p>You may ask to see, correct or delete the personal information we hold about you, or object to how we use it, by emailing {SHOP.email}. If you're not satisfied with our response, you can complain to the Information Regulator of South Africa.</p>
      </article>
    </>
  );
}
