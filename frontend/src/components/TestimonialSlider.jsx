import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiStar } from "react-icons/hi";
import { useTestimonials } from "../lib/hooks/useTestimonials";
import { initials } from "../lib/helper/format";
import Loader from "./Loader";
import ErrorNotice from "./ErrorNotice";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function TestimonialSlider() {
  const { data, isLoading, isError, error } = useTestimonials();
  const testimonials = data?.data || [];
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const current = testimonials[index];

  return (
    <section id="testimonials" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="05" subtitle="testimonials" title="Signal from past clients" />
        </RevealOnScroll>

        {isLoading && <Loader label="fetching testimonials" />}
        {isError && <ErrorNotice message={error?.message} />}
        {!isLoading && !isError && testimonials.length === 0 && (
          <p className="font-mono text-sm text-ink-muted">No testimonials yet.</p>
        )}

        {current && (
          <div className="relative max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current._id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
                className="rounded-lg border border-line bg-surface p-8"
              >
                <div className="flex gap-1 text-copper mb-4">
                  {Array.from({ length: current.rating || 5 }).map((_, i) => (
                    <HiStar key={i} />
                  ))}
                </div>
                <p className="text-ink-dim leading-relaxed">&ldquo;{current.feedback}&rdquo;</p>
                <div className="flex items-center gap-3 mt-6">
                  {current.img ? (
                    <img src={current.img} alt={current.clientName} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="h-10 w-10 rounded-full bg-copper/20 text-copper-soft font-mono text-xs flex items-center justify-center">
                      {initials(current.clientName)}
                    </span>
                  )}
                  <div>
                    <p className="font-display text-sm text-ink">{current.clientName}</p>
                    {current.address && <p className="font-mono text-xs text-ink-muted">{current.address}</p>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {testimonials.length > 1 && (
              <div className="flex gap-3 mt-5">
                <button onClick={prev} aria-label="Previous testimonial" className="rounded-md border border-line p-2 text-ink-dim hover:border-copper hover:text-copper-soft transition-colors">
                  <HiChevronLeft />
                </button>
                <button onClick={next} aria-label="Next testimonial" className="rounded-md border border-line p-2 text-ink-dim hover:border-copper hover:text-copper-soft transition-colors">
                  <HiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
