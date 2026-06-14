export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-primary/20 bg-background">
      <div className="absolute inset-0 tws-banner-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/82 to-background/60" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold uppercase leading-tight tracking-[0.05em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  )
}
