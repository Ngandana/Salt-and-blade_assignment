export default function PageIntro({ title, children }) {
  return (
    <section className="border-b border-ink-3">
      <div className="container-site py-14 md:py-20">
        <h1 className="hero-enter max-w-3xl text-5xl font-semibold md:text-6xl">{title}</h1>
        {children && <div className="hero-enter-2 mt-5 max-w-2xl text-lg text-rope">{children}</div>}
      </div>
    </section>
  );
}
