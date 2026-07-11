import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../../components/admin/Modal";
import FieldInput from "../../components/admin/FieldInput";
import ResourceList from "../../components/admin/ResourceList";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  jobType: "remote",
  role: "",
  skills: "",
  description: "",
  applyUrl: "",
  isActive: true,
};

export default function JobsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyForm });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/jobs/all`, { credentials: "include" });
      const payload = await res.json();
      setItems(payload?.data || []);
    } catch (error) {
      toast.error("Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const openNew = () => {
    setEditing(null);
    reset(emptyForm);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({ ...item, skills: (item.skills || []).join(", ") });
  };

  const saveJob = async (values) => {
    const payload = {
      ...values,
      skills: values.skills.split(",").map((item) => item.trim()).filter(Boolean),
      isActive: values.isActive !== false,
    };

    const url = editing?._id
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/jobs/${editing._id}`
      : `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/jobs`;
    const method = editing?._id ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Unable to save job");
      toast.success(editing ? "Job updated" : "Job created");
      setEditing(null);
      loadJobs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteJob = async (job) => {
    if (!confirm("Delete this opportunity?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/jobs/${job._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Unable to delete job");
      toast.success("Job removed");
      loadJobs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <ResourceList
        title="Job opportunities"
        isLoading={loading}
        items={items}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={deleteJob}
        renderItem={(item) => (
          <>
            <p className="font-display text-sm text-ink">{item.title}</p>
            <p className="font-mono text-xs text-ink-muted">{item.company} · {item.jobType}</p>
          </>
        )}
      />

      <Modal open={!!editing || !editing && false} onClose={() => setEditing(null)} title={editing ? "Edit opportunity" : "New opportunity"}>
        <form onSubmit={handleSubmit(saveJob)} className="space-y-4">
          <FieldInput label="title" name="title" register={register} required error={errors.title} />
          <FieldInput label="company" name="company" register={register} required error={errors.company} />
          <FieldInput label="location" name="location" register={register} required error={errors.location} />
          <FieldInput label="role" name="role" register={register} required error={errors.role} />
          <FieldInput label="skills" name="skills" register={register} required error={errors.skills} />
          <FieldInput label="apply url" name="applyUrl" register={register} error={errors.applyUrl} />
          <FieldInput label="description" name="description" textarea register={register} required error={errors.description} />
          <label className="flex items-center gap-2 text-sm text-ink-dim">
            <input type="checkbox" {...register("isActive")} />
            visible on site
          </label>
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium">save</button>
        </form>
      </Modal>
    </div>
  );
}
