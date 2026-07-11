import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import TechOrbit from "./TechOrbit";

const FALLBACK_PROCESSES = [
  { name: "internship", status: "running", detail: "Software Engineering Intern · remote" },
  { name: "processes", status: "running", detail: "Product delivery · automation" },
  { name: "embedded", status: "running", detail: "IoT + firmware experiments" },
];

const line = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export default function Hero() {
  const [items, setItems] = useState(FALLBACK_PROCESSES);

  useEffect(() => {
    const loadHeroItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/hero-status`);
        const result = await response.json();
        const data = result?.data || [];
        if (Array.isArray(data) && data.length) {
          setItems(data.map((item) => ({ name: item.name, status: item.status || "running", detail: item.detail })));
        }
      } catch {
        setItems(FALLBACK_PROCESSES);
      }
    };

    loadHeroItems();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-circuit overflow-hidden pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-bg/40 to-bg" />

      <div className="relative mx-auto max-w-6xl w-full px-6 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
        >
          <motion.p
            variants={line}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm text-copper mb-4"
          >
            $ whoami
          </motion.p>

          <motion.h1
            variants={line}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-ink text-glow"
          >
            Md. Shahriyar Rahim
          </motion.h1>

          <motion.p
            variants={line}
            transition={{ duration: 0.5 }}
            className="mt-5 font-mono text-base sm:text-lg text-ink-dim max-w-xl"
          >
            Full-stack <span className="text-signal-soft">MERN</span> developer &amp;
            embedded systems tinkerer. I build web apps that ship, and firmware
            that survives contact with real hardware. ⚙️📱💡
          </motion.p>

          <motion.div variants={line} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-md bg-copper px-6 py-3 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors"
            >
              get in touch
            </a>
            <a
              href="#experience"
              className="rounded-md border border-line px-6 py-3 font-mono text-sm text-ink-dim hover:border-copper hover:text-copper-soft transition-colors flex items-center gap-2"
            >
              view work <HiArrowDown />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-line bg-surface/80 backdrop-blur-sm p-5 trace-border"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-line pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-copper/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
            <span className="ml-3 font-mono text-xs text-ink-muted">status.log</span>
          </div>
          <TechOrbit />
          <ul className="mt-6 space-y-4">
            {items.map((proc, i) => (
              <motion.li
                key={proc.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="font-mono text-xs sm:text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-ink">{proc.name}</span>
                  <span className={`flex items-center gap-1.5 ${proc.status === "idle" ? "text-copper" : proc.status === "stopped" ? "text-danger" : "text-ok"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${proc.status === "idle" ? "bg-copper" : proc.status === "stopped" ? "bg-danger" : "bg-ok"} animate-pulse`} />
                    {proc.status}
                  </span>
                </div>
                <p className="text-ink-muted mt-0.5">{proc.detail}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
