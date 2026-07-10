export default function ErrorNotice({ message = "Something went wrong." }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 font-mono text-sm text-danger">
      [error] {message}
    </div>
  );
}
