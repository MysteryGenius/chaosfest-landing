export default function Home() {
  return (
    <main className="flex flex-col gap-12 py-16">
      <h1 className="text-[clamp(3.5rem,14vw,12rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
        Chaos<em className="font-normal italic">fest</em>
      </h1>

      <div className="flex flex-col gap-3 items-start">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Work with us
        </p>
        <a
          href="mailto:benny@chaos-fest.com"
          className="text-[clamp(1.2rem,2.5vw,1.8rem)] border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity inline-block min-h-[44px] flex items-center"
        >
          Let&rsquo;s build something &rarr;
        </a>
      </div>
    </main>
  );
}
