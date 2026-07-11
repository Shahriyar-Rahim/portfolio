import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

const filters = [
  { key: "role", label: "Role" },
  { key: "skills", label: "Skills" },
  { key: "jobType", label: "Type" },
];

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [jobType, setJobType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [formState, setFormState] = useState({ name: "", email: "", coverLetter: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (skills) params.set("skills", skills);
    if (jobType) params.set("jobType", jobType);

    setLoading(true);
    setFeedback({ type: "", message: "" });

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/jobs?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((payload) => setJobs(payload?.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [role, skills, jobType]);

  const filteredJobs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.description} ${job.skills?.join(" ")}`.toLowerCase();
      return !term || haystack.includes(term);
    });
  }, [jobs, query]);

  const handleApply = async (jobId) => {
    if (!formState.name.trim() || !formState.email.trim()) {
      setFeedback({ type: "error", message: "Please add your name and email before sending your application." });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: "", message: "" });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Unable to submit application");
      setSelectedId(null);
      setFormState({ name: "", email: "", coverLetter: "" });
      setFeedback({ type: "success", message: payload.message || "Application sent successfully." });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="jobs" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="06" subtitle="opportunities" title="Open to meaningful product and engineering roles" />
        </RevealOnScroll>
        <div className="mt-8 rounded-2xl border border-line bg-surface/70 p-4 sm:p-6">
          <div className="grid gap-3 md:grid-cols-4">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role or skill" className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink">
              <option value="">All roles</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Engineer">Backend Engineer</option>
            </select>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node" className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" />
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink">
              <option value="">Any type</option>
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
              <option value="hybrid">Hybrid</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          {feedback.message ? (
            <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${feedback.type === "error" ? "border-danger/40 bg-danger/10 text-danger" : "border-copper/30 bg-copper/10 text-copper-soft"}`}>
              {feedback.message}
            </div>
          ) : null}
          <div className="mt-6 space-y-4">
            {loading ? <p className="text-sm text-ink-dim">Loading opportunities…</p> : null}
            {filteredJobs.map((job) => (
              <motion.article key={job._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-line bg-bg/70 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg text-ink">{job.title}</h3>
                      <span className="rounded-full border border-line px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-copper-soft">{job.jobType}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-dim">{job.company} · {job.location}</p>
                    <p className="mt-3 text-sm leading-6 text-ink-dim">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(job.skills || []).map((skill) => (
                        <span key={skill} className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-muted">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    {job.applyUrl ? <a href={job.applyUrl} target="_blank" rel="noreferrer" className="text-sm text-copper-soft">apply externally</a> : null}
                    <button onClick={() => setSelectedId(job._id)} className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-bg">apply</button>
                  </div>
                </div>
              </motion.article>
            ))}
            {!filteredJobs.length && <p className="text-sm text-ink-dim">No matching roles right now. Please come back soon.</p>}
          </div>
        </div>
      </div>
      {selectedId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-display text-xl text-ink">Apply for this role</h3>
            <div className="mt-4 space-y-3">
              <input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} placeholder="Your name" className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" />
              <input type="email" value={formState.email} onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))} placeholder="Your email" className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" />
              <textarea value={formState.coverLetter} onChange={(e) => setFormState((s) => ({ ...s, coverLetter: e.target.value }))} rows={6} placeholder="A short note about why this role fits" className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setSelectedId(null)} className="rounded-md border border-line px-4 py-2 text-sm text-ink-dim">cancel</button>
              <button disabled={submitting} onClick={() => handleApply(selectedId)} className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-bg">{submitting ? "sending…" : "send application"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
