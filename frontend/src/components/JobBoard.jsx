import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadJobs = async () => {
    setLoading(true); setMessage("");
    try {
      const response = await fetch(`${API_URL}/jobs/recommended`, { credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to load job recommendations.");
      setJobs(payload.data || []);
    } catch (error) { setJobs([]); setMessage(error.message); } finally { setLoading(false); }
  };

  useEffect(() => { loadJobs(); }, []);
  const filteredJobs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return jobs.filter((job) => !term || `${job.title} ${job.company} ${job.location} ${job.description} ${job.skills.join(" ")}`.toLowerCase().includes(term));
  }, [jobs, query]);

  return <section className="mb-12 border-b border-line pb-12">
    <div className="mx-auto max-w-6xl px-6">
      <RevealOnScroll><SectionHeading index="01" subtitle="personal job search" title="Roles matched to my CV" /></RevealOnScroll>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by role, company or skill" className="flex-1 rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" />
        <button onClick={loadJobs} disabled={loading} className="rounded-md border border-line px-4 py-2 text-sm text-ink-dim">{loading ? "Loading…" : "Refresh"}</button>
      </div>
      <p className="mt-3 text-xs text-ink-muted">These private recommendations are based on your CV profile and sourced from Remotive.</p>
      {message ? <p className="mt-5 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{message}</p> : null}
      <div className="mt-6 space-y-4">
        {filteredJobs.map((job) => <motion.article key={job.externalId} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between"><div>
            <div className="flex items-center gap-3">{job.companyLogo ? <img src={job.companyLogo} alt="" className="h-9 w-9 rounded object-contain" /> : null}<div><h3 className="font-display text-lg text-ink">{job.title}</h3><p className="text-sm text-ink-dim">{job.company} · {job.location}</p></div></div>
            <p className="mt-3 text-sm leading-6 text-ink-dim">{job.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-full bg-bg px-2.5 py-1 text-xs text-ink-muted">{skill}</span>)}</div>
          </div>{job.applyUrl ? <a href={job.applyUrl} target="_blank" rel="noreferrer" className="h-fit rounded-md bg-copper px-4 py-2 text-center text-sm font-medium text-bg">Apply on {job.sourcePlatform}</a> : <span className="text-sm text-ink-muted">Application link coming soon</span>}</div>
        </motion.article>)}
        {!loading && !message && !filteredJobs.length ? <p className="text-sm text-ink-dim">No matching roles right now. Try refreshing later.</p> : null}
      </div>
    </div>
  </section>;
}
