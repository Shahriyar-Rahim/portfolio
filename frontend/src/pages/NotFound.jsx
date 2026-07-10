import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-copper text-sm">404</p>
      <h1 className="font-display text-3xl text-ink">Route not found</h1>
      <p className="text-ink-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="font-mono text-sm text-copper-soft hover:underline mt-2">
        back to home
      </Link>
    </div>
  );
}
