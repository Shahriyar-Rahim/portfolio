import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import api from "../../lib/api/axios";
import Loader from "../../components/Loader";
import ErrorNotice from "../../components/ErrorNotice";
import Modal from "../../components/admin/Modal";

export default function HeroStatusAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hero-status");
      setItems(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openNew = () => {
    setEditing({});
    reset({ name: "", detail: "", status: "running", order: 0 });
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({ name: item.name || "", detail: item.detail || "", status: item.status || "running", order: item.order || 0 });
  };

  const onSubmit = async (values) => {
    try {
      if (editing?._id) {
        await api.patch(`/hero-status/${editing._id}`, values);
      } else {
        await api.post("/hero-status", values);
      }
      setEditing(null);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (item) => {
    if (!confirm("Remove this hero status entry?")) return;
    try {
      await api.delete(`/hero-status/${item._id}`);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Hero statuses</h1>
          <p className="mt-2 font-mono text-sm text-ink-muted">Manage the animated status items shown on the landing hero.</p>
        </div>
        <button onClick={openNew} className="rounded-md bg-copper px-4 py-2 font-mono text-sm text-bg hover:bg-copper-soft">
          <span className="flex items-center gap-2"><HiPlus /> add</span>
        </button>
      </div>

      {loading && <Loader label="loading hero statuses" />}
      {error && <ErrorNotice message={error} />}
      {!loading && !error && items.length === 0 && <p className="font-mono text-sm text-ink-muted">No hero status entries yet.</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm text-ink">{item.name}</p>
                <p className="mt-1 text-sm text-ink-dim">{item.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="rounded-md p-2 text-ink-muted hover:bg-surface-raised hover:text-copper-soft" aria-label="Edit">
                  <HiPencil />
                </button>
                <button onClick={() => removeItem(item)} className="rounded-md p-2 text-ink-muted hover:bg-surface-raised hover:text-danger" aria-label="Delete">
                  <HiTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._id ? "Edit hero status" : "Add hero status"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">name</label>
            <input {...register("name", { required: "Name is required" })} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
            {errors.name && <p className="text-danger text-xs font-mono mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">detail</label>
            <textarea rows={3} {...register("detail", { required: "Detail is required" })} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink resize-none" />
            {errors.detail && <p className="text-danger text-xs font-mono mt-1">{errors.detail.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-1.5">status</label>
              <select {...register("status")} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink">
                <option value="running">running</option>
                <option value="idle">idle</option>
                <option value="stopped">stopped</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-1.5">order</label>
              <input type="number" {...register("order", { valueAsNumber: true })} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
            </div>
          </div>
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">save</button>
        </form>
      </Modal>
    </div>
  );
}
