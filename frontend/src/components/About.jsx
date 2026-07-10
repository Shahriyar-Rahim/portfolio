import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="01" subtitle="about" title="Two disciplines, one engineer" />
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-10">
          <RevealOnScroll delay={0.05}>
            <p className="text-ink-dim leading-relaxed">
              I&rsquo;m a Computer Science &amp; Engineering student at Bangladesh Army
              University of Science and Technology (BAUST), working full-stack
              on the MERN stack — MongoDB, Express, React, Node — while
              maintaining a parallel interest in embedded systems and hardware.
            </p>
            <p className="text-ink-dim leading-relaxed mt-4">
              Day to day that means shipping production web applications for
              clients and my university, and soldering together firmware for
              ESP32-based devices in the evening. I like projects where both
              sides meet: real-time dashboards talking to real sensors, APIs
              serving data captured by actual hardware.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <div className="rounded-lg border border-line bg-surface p-6 font-mono text-sm">
              <p className="text-ink-muted mb-3">{"// core toolchain"}</p>
              {[
                ["frontend", "React, Redux Toolkit / RTK Query, Tailwind"],
                ["backend", "Node.js, Express, MongoDB, Socket.io"],
                ["embedded", "ESP32-S3, Arduino, FreeRTOS, C/C++"],
                ["tooling", "Docker, Git, Cloudinary, Supabase"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-x-3 py-1.5 border-b border-line-soft last:border-0">
                  <span className="text-copper w-24 shrink-0">{k}:</span>
                  <span className="text-ink-dim">{v}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
