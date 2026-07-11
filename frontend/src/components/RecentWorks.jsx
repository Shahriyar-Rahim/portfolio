import { useEffect, useState } from "react";
import { Link } from "react-router";
import { HiCodeBracket } from "react-icons/hi2";
import { HiExternalLink } from "react-icons/hi";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export function ProjectCard({ repo }) {
  return <article className="group overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-1 hover:border-copper/50">
    <div className="aspect-[16/8] bg-surface-raised">
      {repo.coverImage ? <img src={repo.coverImage} alt={`${repo.name} preview`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-copper/70"><HiCodeBracket className="text-4xl" /></div>}
    </div>
    <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-lg text-ink">{repo.name}</h3><span className="shrink-0 font-mono text-xs text-copper-soft">{repo.language}</span></div><p className="mt-3 min-h-12 text-sm leading-6 text-ink-dim">{repo.description}</p><div className="mt-5 flex flex-wrap gap-3 text-sm"><a href={repo.html_url} target="_blank" rel="noreferrer" className="text-ink-dim hover:text-copper-soft">GitHub ↗</a>{repo.homepage ? <a href={repo.homepage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-copper-soft">Live site <HiExternalLink /></a> : null}</div></div>
  </article>;
}

export default function RecentWorks() {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    const load = () => fetch(`${API}/portfolio/github/repos?limit=3`).then((res) => res.json()).then((payload) => { if (live) { setRepos(payload.data || []); setError(payload.success === false ? payload.message : ""); } }).catch(() => live && setError("Unable to load GitHub projects right now."));
    load(); const timer = setInterval(load, 60000); return () => { live = false; clearInterval(timer); };
  }, []);
  return <section id="recent-works" className="border-t border-line py-24"><div className="mx-auto max-w-6xl px-6"><RevealOnScroll><SectionHeading index="05" subtitle="recent works" title="Selected builds from GitHub" /></RevealOnScroll><div className="mt-8 grid gap-5 md:grid-cols-3">{repos.map((repo) => <ProjectCard key={repo.id} repo={repo} />)}</div>{error ? <p className="mt-5 text-sm text-danger">{error}</p> : null}<div className="mt-8"><Link to="/projects" className="inline-flex rounded-md border border-line px-5 py-3 font-mono text-sm text-ink-dim transition hover:border-copper hover:text-copper-soft">view all projects →</Link></div></div></section>;
}
