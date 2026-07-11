import { useMemo } from "react";
import { Link } from "react-router";
import { HiStar } from "react-icons/hi";
import { useTestimonials } from "../lib/hooks/useTestimonials";
import Loader from "../components/Loader";
import ErrorNotice from "../components/ErrorNotice";
import RevealOnScroll from "../components/RevealOnScroll";
import SectionHeading from "../components/SectionHeading";

export default function TestimonialsPage() {
  const { data, isLoading, isError, error } = useTestimonials();
  const testimonials = data?.data || [];

  const grouped = useMemo(() => testimonials.slice(0, 6), [testimonials]);

  return (
    <div className="min-h-screen bg-bg px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll>
          <SectionHeading index="05" subtitle="feedback" title="A full view of the work" />
        </RevealOnScroll>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/" className="font-mono text-sm text-copper-soft hover:underline">← back home</Link>
        </div>

        {isLoading && <Loader label="loading testimonials" />}
        {isError && <ErrorNotice message={error?.message} />}
        {!isLoading && !isError && grouped.length === 0 && (
          <p className="mt-8 font-mono text-sm text-ink-muted">No testimonials have been published yet.</p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {grouped.map((item, index) => (
            <RevealOnScroll key={item._id} delay={index * 0.05}>
              <article className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex items-center gap-1 text-copper">
                  {Array.from({ length: item.rating || 5 }).map((_, starIndex) => (
                    <HiStar key={starIndex} />
                  ))}
                </div>
                <p className="mt-4 text-lg leading-8 text-ink-dim">“{item.feedback}”</p>
                <div className="mt-6 flex items-center gap-3">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.clientName} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-copper/15 font-mono text-sm text-copper-soft">
                      {item.clientName?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-display text-sm text-ink">{item.clientName}</p>
                    {item.address && <p className="font-mono text-xs text-ink-muted">{item.address}</p>}
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
