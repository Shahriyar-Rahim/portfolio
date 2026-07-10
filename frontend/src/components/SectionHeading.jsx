export default function SectionHeading({ index, title, subtitle }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-xs text-copper">{index}</span>
        <span className="h-px flex-1 max-w-10 bg-line" />
        <span className="font-mono text-xs text-ink-muted uppercase tracking-widest">
          {subtitle}
        </span>
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
        {title}
      </h2>
    </div>
  );
}
