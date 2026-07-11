import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineMail } from "react-icons/hi";
import { useSendMessage } from "../lib/hooks/useInbox";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";
import ThankYouModal from "./ThankYouModal";

export default function ContactForm() {
  const [showThanks, setShowThanks] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const sendMessage = useSendMessage();

  const onSubmit = (values) => {
    sendMessage.mutate(values, {
      onSuccess: () => {
        reset();
        setShowThanks(true);
      },
    });
  };

  return (
    <section id="contact" className="py-24 border-t border-line">
      <div className="mx-auto max-w-3xl px-6">
        <RevealOnScroll>
          <SectionHeading index="07" subtitle="contact" title="Send a transmission" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-line bg-surface p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="font-mono text-xs text-ink-muted block mb-2">name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none transition-colors"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-danger text-xs font-mono mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="font-mono text-xs text-ink-muted block mb-2">email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none transition-colors"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-danger text-xs font-mono mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">subject</label>
              <input
                {...register("subject", { required: "Subject is required" })}
                className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none transition-colors"
                placeholder="Project inquiry"
              />
              {errors.subject && <p className="text-danger text-xs font-mono mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">message</label>
              <textarea
                rows={5}
                {...register("message", { required: "Message is required" })}
                className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none transition-colors resize-none"
                placeholder="Tell me about what you're building…"
              />
              {errors.message && <p className="text-danger text-xs font-mono mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="flex items-center gap-2 rounded-md bg-copper px-6 py-3 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50"
            >
              <HiOutlineMail />
              {sendMessage.isPending ? "sending…" : "send message"}
            </button>
          </form>
        </RevealOnScroll>
      </div>

      <ThankYouModal
        open={showThanks}
        title="Thank you"
        message="Your message was received. I’ll reply to you as soon as I can."
        actions={[
          <button key="close" type="button" onClick={() => setShowThanks(false)} className="rounded-md bg-copper px-4 py-2 font-mono text-sm text-bg">
            close
          </button>,
        ]}
      />
    </section>
  );
}
