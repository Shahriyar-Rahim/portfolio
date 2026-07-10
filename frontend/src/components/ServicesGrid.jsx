import { useServices } from "../lib/hooks/useServices";
import Loader from "./Loader";
import ErrorNotice from "./ErrorNotice";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function ServicesGrid() {
  const { data, isLoading, isError, error } = useServices();
  const services = data?.data || [];

  return (
    <section id="services" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="04" subtitle="services" title="What I can build for you" />
        </RevealOnScroll>

        {isLoading && <Loader label="fetching services" />}
        {isError && <ErrorNotice message={error?.message} />}
        {!isLoading && !isError && services.length === 0 && (
          <p className="font-mono text-sm text-ink-muted">No services listed yet.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <RevealOnScroll key={svc._id} delay={i * 0.08}>
              <div className="trace-border rounded-lg border border-line bg-surface overflow-hidden h-full flex flex-col">
                {svc.img && (
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="h-40 w-full object-cover border-b border-line"
                    loading="lazy"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-lg text-ink font-medium mb-2">{svc.title}</h3>
                  <p className="text-ink-dim text-sm leading-relaxed">{svc.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
