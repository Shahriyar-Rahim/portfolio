import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import Loader from "../components/Loader";
import ErrorNotice from "../components/ErrorNotice";

export default function WorkDetailPage() {
  const { repo } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`https://api.github.com/repos/Shahriyar-Rahim/${repo}`)
      .then((res) => {
        if (!res.ok) throw new Error("Repository not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repo]);

  return (
    <div className="min-h-screen bg-bg px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="font-mono text-sm text-copper-soft hover:underline">← back home</Link>

        {loading && <Loader label="loading repository" />}
        {error && <ErrorNotice message={error} />}
        {item && (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-copper-soft">selected work</p>
                <h1 className="mt-2 font-display text-3xl text-ink">{item.name}</h1>
              </div>
              <a
                href={item.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-sm text-ink-dim hover:border-copper hover:text-copper-soft"
              >
                view on GitHub <HiArrowTopRightOnSquare />
              </a>
            </div>

            <p className="mt-6 text-lg leading-8 text-ink-dim">{item.description || "A recent build from the GitHub timeline."}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-bg/80 p-4">
                <p className="font-mono text-xs uppercase text-ink-muted">language</p>
                <p className="mt-2 font-display text-lg text-ink">{item.language || "Mixed"}</p>
              </div>
              <div className="rounded-lg border border-line bg-bg/80 p-4">
                <p className="font-mono text-xs uppercase text-ink-muted">stars</p>
                <p className="mt-2 font-display text-lg text-ink">{item.stargazers_count ?? 0}</p>
              </div>
              <div className="rounded-lg border border-line bg-bg/80 p-4">
                <p className="font-mono text-xs uppercase text-ink-muted">forks</p>
                <p className="mt-2 font-display text-lg text-ink">{item.forks_count ?? 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
