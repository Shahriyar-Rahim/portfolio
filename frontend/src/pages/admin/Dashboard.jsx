import { useBlogs } from "../../lib/hooks/useBlogs";
import { useEducation } from "../../lib/hooks/useEducation";
import { useExperience } from "../../lib/hooks/useExperience";
import { useServices } from "../../lib/hooks/useServices";
import { useAllTestimonials } from "../../lib/hooks/useTestimonials";
import { useInboxList } from "../../lib/hooks/useInbox";

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <p className="font-mono text-xs text-ink-muted uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl text-copper-soft mt-2">{value ?? "—"}</p>
    </div>
  );
}

export default function Dashboard() {
  const blogs = useBlogs();
  const education = useEducation();
  const experience = useExperience();
  const services = useServices();
  const testimonials = useAllTestimonials();
  const inbox = useInboxList();

  const unread = (inbox.data?.data || []).filter((m) => m.status === "unread").length;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Unread messages" value={unread} />
        <StatCard label="Blog posts" value={blogs.data?.data?.length} />
        <StatCard label="Experience entries" value={experience.data?.data?.length} />
        <StatCard label="Education entries" value={education.data?.data?.length} />
        <StatCard label="Services" value={services.data?.data?.length} />
        <StatCard label="Testimonials" value={testimonials.data?.data?.length} />
      </div>
    </div>
  );
}
