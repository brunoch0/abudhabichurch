export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-gradient-to-b from-spring-100 to-white">
      <div className="mx-auto max-w-6xl px-4 py-14 text-center md:py-16">
        <h1 className="text-3xl font-black tracking-tight text-spring-950 md:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-ink-soft">{subtitle}</p>}
      </div>
    </section>
  );
}
