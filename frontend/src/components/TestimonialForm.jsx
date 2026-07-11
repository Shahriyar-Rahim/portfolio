import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { HiStar } from "react-icons/hi";
import { Link } from "react-router";
import { useAddTestimonial } from "../lib/hooks/useTestimonials";
import ThankYouModal from "./ThankYouModal";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

const STAR_OPTIONS = [5, 4, 3, 2, 1];

export default function TestimonialForm() {
  const [showThanks, setShowThanks] = useState(false);
  const [files, setFiles] = useState([]);
  const { mutate, isPending } = useAddTestimonial();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { rating: 5 } });

  const selectedRating = watch("rating") || 5;
  const previewText = useMemo(() => {
    const labels = ["amazing", "excellent", "solid", "good", "nice"];
    return labels[Math.max(0, Math.min(4, Number(selectedRating) - 1))];
  }, [selectedRating]);

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("clientName", values.clientName);
    formData.append("email", values.email || "");
    formData.append("address", values.address || "");
    formData.append("feedback", values.feedback);
    formData.append("rating", String(values.rating || 5));

    Array.from(files).forEach((file) => formData.append("images", file));

    mutate(formData, {
      onSuccess: () => {
        reset({ rating: 5 });
        setFiles([]);
        setValue("rating", 5);
        setShowThanks(true);
      },
    });
  };

  return (
    <section id="feedback" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <SectionHeading index="06" subtitle="feedback" title="Leave a note for the next build" />
        </RevealOnScroll>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <RevealOnScroll delay={0.1}>
            <div className="rounded-2xl border border-line bg-surface p-8">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-copper-soft">voice of the work</p>
              <h3 className="mt-3 font-display text-2xl text-ink">What clients remember most</h3>
              <p className="mt-4 text-sm leading-7 text-ink-dim">
                Share the experience, the outcome, and the energy behind the collaboration. Your words help shape the next project story.
              </p>
              <div className="mt-6 rounded-lg border border-line bg-bg/70 p-4 text-sm text-ink-dim">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-muted">snapshot</p>
                <p className="mt-3">{previewText} feedback at {selectedRating}/5 stars.</p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-xs text-ink-muted block mb-2">name</label>
                  <input
                    {...register("clientName", { required: "Name is required" })}
                    className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-copper"
                    placeholder="Your name"
                  />
                  {errors.clientName && <p className="mt-1 text-xs text-danger">{errors.clientName.message}</p>}
                </div>
                <div>
                  <label className="font-mono text-xs text-ink-muted block mb-2">email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-copper"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-ink-muted block mb-2">company / role</label>
                <input
                  {...register("address")}
                  className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-copper"
                  placeholder="Acme · Product Lead"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-ink-muted block mb-2">rating</label>
                <div className="flex items-center gap-2">
                  {STAR_OPTIONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("rating", value)}
                      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                        selectedRating >= value ? "border-copper text-copper-soft" : "border-line text-ink-muted"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {value}
                        <HiStar />
                      </span>
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("rating", { required: true })} />
              </div>

              <div>
                <label className="font-mono text-xs text-ink-muted block mb-2">feedback</label>
                <textarea
                  rows={5}
                  {...register("feedback", { required: "Feedback is required" })}
                  className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-copper resize-none"
                  placeholder="Tell me how the experience felt from your side…"
                />
                {errors.feedback && <p className="mt-1 text-xs text-danger">{errors.feedback.message}</p>}
              </div>

              <div>
                <label className="font-mono text-xs text-ink-muted block mb-2">images (max 3)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setFiles(Array.from(event.target.files || []))}
                  className="w-full rounded-md border border-dashed border-line bg-bg px-3.5 py-3 text-sm text-ink-muted"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link to="/testimonials" className="font-mono text-sm text-copper-soft hover:underline">
                  view all feedback →
                </Link>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { reset({ rating: 5 }); setFiles([]); }} className="rounded-md border border-line px-4 py-2.5 font-mono text-sm text-ink-dim hover:border-copper">reset</button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-copper px-5 py-2.5 font-mono text-sm text-bg font-medium transition-colors hover:bg-copper-soft disabled:opacity-60"
                  >
                    {isPending ? "sending…" : "submit feedback"}
                  </button>
                </div>
              </div>
            </form>
          </RevealOnScroll>
        </div>
      </div>

      <ThankYouModal
        open={showThanks}
        title="Thank you"
        message="Your testimonial is on its way. I will review it and share it on the site as soon as it is approved."
        actions={[
          <Link key="view" to="/testimonials" className="rounded-md border border-line px-4 py-2 font-mono text-sm text-ink-dim hover:border-copper hover:text-copper-soft">
            view feedback
          </Link>,
          <button key="close" type="button" onClick={() => setShowThanks(false)} className="rounded-md bg-copper px-4 py-2 font-mono text-sm text-bg">
            close
          </button>,
        ]}
      />
    </section>
  );
}
