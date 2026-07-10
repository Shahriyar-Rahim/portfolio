export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-muted">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-copper" />
      </span>
      <span className="font-mono text-xs uppercase tracking-widest">{label}…</span>
    </div>
  );
}
