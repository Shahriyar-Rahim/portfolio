import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { HiCodeBracket } from "react-icons/hi2";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

const DEFAULT_REPOS = [
  { name: "portfolio", description: "MERN portfolio experience", language: "JavaScript" },
  { name: "embedded-logger", description: "Firmware telemetry dashboard", language: "C" },
  { name: "iot-hub", description: "Device orchestration toolkit", language: "TypeScript" },
];

export default function RecentWorks() {
  const [repos, setRepos] = useState(DEFAULT_REPOS);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

    fetch(`${baseUrl}/portfolio/github/repos`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.data)) {
          const normalized = data.data
            .filter((repo) => repo?.name)
            .slice(0, 6)
            .map((repo) => ({
              name: repo.name,
              description: repo.description || "Recent build from GitHub",
              language: repo.language || "Mixed",
              html_url: repo.html_url,
            }));
          if (normalized.length) setRepos(normalized);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="recent-works" className="py-24 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="05" subtitle="recent works" title="A glimpse of the latest builds" />
        </RevealOnScroll>

        <div className="relative mt-8 rounded-2xl border border-line bg-surface/70 p-4 sm:p-6">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, -1200] }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-4"
          >
            {[...repos, ...repos].map((repo, index) => (
              <button
                key={`${repo.name}-${index}`}
                onClick={() => navigate(`/works/${repo.name}`)}
                className="w-[280px] rounded-xl border border-line bg-bg/80 p-5 text-left transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-copper-soft">
                    <HiCodeBracket /> repo
                  </span>
                  <span className="rounded-full border border-line px-2 py-1 text-[11px] text-ink-muted">
                    {repo.language}
                  </span>
                </div>
                <h3 className="font-display text-lg text-ink">{repo.name}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-dim">{repo.description}</p>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
