import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheck, HiPencil, HiX } from "react-icons/hi";
import {
  useAllTestimonials,
  useDeleteTestimonial,
  useSetTestimonialApproval,
} from "../../lib/hooks/useTestimonials";
import Loader from "../../components/Loader";
import ErrorNotice from "../../components/ErrorNotice";
import Modal from "../../components/admin/Modal";

export default function TestimonialsAdmin() {
  const { data, isLoading, isError, error } = useAllTestimonials();
  const items = data?.data || [];
  const setApproval = useSetTestimonialApproval();
  const remove = useDeleteTestimonial();
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const sortedItems = useMemo(() => [...items].sort((a, b) => Number(b.isApproved) - Number(a.isApproved)), [items]);

  const openEdit = (item) => {
    setEditing(item);
    reset({ clientName: item.clientName || "", address: item.address || "", feedback: item.feedback || "", rating: item.rating || 5 });
  };

  const onSubmit = (values) => {
    if (!editing?._id) return;
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/testimonial/${editing._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then(() => {
        setEditing(null);
        window.location.reload();
      })
      .catch(() => {});
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Testimonials</h1>

      {isLoading && <Loader label="loading" />}
      {isError && <ErrorNotice message={error?.message} />}
      {!isLoading && !isError && sortedItems.length === 0 && (
        <p className="font-mono text-sm text-ink-muted">No testimonials submitted yet.</p>
      )}

      <div className="space-y-3">
        {sortedItems.map((item) => (
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
                  onClick={() => openEdit(item)}
                  className="rounded-md p-2 text-ink-muted hover:text-copper-soft hover:bg-surface-raised transition-colors"
                  aria-label="Edit"
                  title="Edit"
                >
                  <HiPencil />
                </button>
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

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit testimonial">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">client name</label>
            <input {...register("clientName", { required: "Name is required" })} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
            {errors.clientName && <p className="text-danger text-xs font-mono mt-1">{errors.clientName.message}</p>}
          </div>
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">address</label>
            <input {...register("address")} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
          </div>
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">feedback</label>
            <textarea rows={5} {...register("feedback", { required: "Feedback is required" })} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink resize-none" />
            {errors.feedback && <p className="text-danger text-xs font-mono mt-1">{errors.feedback.message}</p>}
          </div>
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">rating</label>
            <input type="number" min="1" max="5" {...register("rating", { valueAsNumber: true })} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
          </div>
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">save</button>
        </form>
      </Modal>
    </div>
  );
}
