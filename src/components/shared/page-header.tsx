export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="mt-1 font-serif text-3xl text-foreground md:text-4xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p> : null}
    </header>
  );
}
