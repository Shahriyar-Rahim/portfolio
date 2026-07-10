import { useEducation } from "../lib/hooks/useEducation";
import Loader from "./Loader";
import ErrorNotice from "./ErrorNotice";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function EducationTimeline() {
  const { data, isLoading, isError, error } = useEducation();
  const educations = data?.data || [];

  return (
    <section id="education" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="03" subtitle="education" title="Academic record" />
        </RevealOnScroll>

        {isLoading && <Loader label="fetching education" />}
        {isError && <ErrorNotice message={error?.message} />}
        {!isLoading && !isError && educations.length === 0 && (
          <p className="font-mono text-sm text-ink-muted">No education entries yet.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {educations.map((edu, i) => (
            <RevealOnScroll key={edu._id} delay={i * 0.08}>
              <div className="rounded-lg border border-line bg-surface p-6 h-full">
                <p className="font-mono text-xs text-signal-soft mb-2">
                  {edu.startYear}
                  {edu.endYear ? ` — ${edu.endYear}` : " — present"}
                </p>
                <h3 className="font-display text-lg text-ink font-medium">{edu.institution}</h3>
                <p className="text-ink-dim mt-1">
                  {edu.degree}
                  {edu.subject ? `, ${edu.subject}` : ""}
                </p>
                {edu.gpa != null && (
                  <p className="font-mono text-xs text-ink-muted mt-3">GPA: {edu.gpa.toFixed ? edu.gpa.toFixed(2) : edu.gpa}</p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
