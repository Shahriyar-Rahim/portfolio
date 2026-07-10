import { HiCheck, HiX } from "react-icons/hi";
import {
  useAllTestimonials,
  useDeleteTestimonial,
  useSetTestimonialApproval,
} from "../../lib/hooks/useTestimonials";
import Loader from "../../components/Loader";
import ErrorNotice from "../../components/ErrorNotice";

export default function TestimonialsAdmin() {
  const { data, isLoading, isError, error } = useAllTestimonials();
  const items = data?.data || [];
  const setApproval = useSetTestimonialApproval();
  const remove = useDeleteTestimonial();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Testimonials</h1>

      {isLoading && <Loader label="loading" />}
      {isError && <ErrorNotice message={error?.message} />}
      {!isLoading && !isError && items.length === 0 && (
        <p className="font-mono text-sm text-ink-muted">No testimonials submitted yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display text-sm text-ink">{item.clientName}</p>
                  <span
                    className={`font-mono text-[10px] uppercase rounded-full px-2 py-0.5 ${
                      item.isApproved ? "text-ok bg-ok/10" : "text-copper-soft bg-copper/10"
                    }`}
                  >
                    {item.isApproved ? "approved" : "pending"}
                  </span>
                </div>
                <p className="text-ink-dim text-sm">{item.feedback}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setApproval.mutate({ id: item._id, isApproved: !item.isApproved })}
                  className={`rounded-md p-2 transition-colors ${
                    item.isApproved
                      ? "text-ink-muted hover:text-copper-soft hover:bg-surface-raised"
                      : "text-ok hover:bg-surface-raised"
                  }`}
                  aria-label={item.isApproved ? "Unapprove" : "Approve"}
                  title={item.isApproved ? "Unapprove" : "Approve"}
                >
                  {item.isApproved ? <HiX /> : <HiCheck />}
                </button>
                <button
                  onClick={() => confirm("Delete this testimonial?") && remove.mutate(item._id)}
                  className="rounded-md p-2 text-ink-muted hover:text-danger hover:bg-surface-raised transition-colors"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
