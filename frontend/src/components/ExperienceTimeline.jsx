import { useExperience } from "../lib/hooks/useExperience";
import Loader from "./Loader";
import ErrorNotice from "./ErrorNotice";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function ExperienceTimeline() {
  const { data, isLoading, isError, error } = useExperience();
  const experiences = data?.data || [];

  return (
    <section id="experience" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="02" subtitle="experience" title="git log --experience" />
        </RevealOnScroll>

        {isLoading && <Loader label="fetching experience" />}
        {isError && <ErrorNotice message={error?.message} />}
        {!isLoading && !isError && experiences.length === 0 && (
          <p className="font-mono text-sm text-ink-muted">No experience entries yet.</p>
        )}

        <div className="relative pl-6 border-l border-line space-y-10">
          {experiences.map((exp, i) => (
            <RevealOnScroll key={exp._id} delay={i * 0.08}>
              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-copper ring-4 ring-bg" />
                <p className="font-mono text-xs text-copper mb-1">{exp.time}</p>
                <h3 className="font-display text-xl text-ink font-medium">
                  {exp.title} <span className="text-ink-muted">@ {exp.company}</span>
                </h3>
                {exp.description && (
                  <p className="text-ink-dim mt-2 leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
