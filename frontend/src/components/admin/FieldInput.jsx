export default function FieldInput({ label, textarea, register, name, error, ...rest }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <div>
      <label className="font-mono text-xs text-ink-muted block mb-1.5">{label}</label>
      <Comp
        {...register(name, rest.required ? { required: `${label} is required` } : {})}
        rows={textarea ? 4 : undefined}
        {...rest}
        className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-copper outline-none resize-none"
      />
      {error && <p className="text-danger text-xs font-mono mt-1">{error.message}</p>}
    </div>
  );
}
