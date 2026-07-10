import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateExperience,
  useDeleteExperience,
  useExperience,
  useUpdateExperience,
} from "../../lib/hooks/useExperience";
import ResourceList from "../../components/admin/ResourceList";
import Modal from "../../components/admin/Modal";
import FieldInput from "../../components/admin/FieldInput";

export default function ExperienceAdmin() {
  const { data, isLoading, isError, error } = useExperience();
  const items = data?.data || [];
  const create = useCreateExperience();
  const update = useUpdateExperience();
  const remove = useDeleteExperience();
  const [editing, setEditing] = useState(null); // null closed, {} new, {...} edit

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openNew = () => { setEditing({}); reset({ title: "", company: "", time: "", description: "" }); };
  const openEdit = (item) => { setEditing(item); reset(item); };

  const onSubmit = (values) => {
    if (editing?._id) {
      update.mutate({ id: editing._id, payload: values }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(values, { onSuccess: () => setEditing(null) });
    }
  };

  return (
    <div>
      <ResourceList
        title="Experience"
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={items}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={(item) => confirm("Delete this entry?") && remove.mutate(item._id)}
        renderItem={(item) => (
          <>
            <p className="font-display text-sm text-ink">{item.title} @ {item.company}</p>
            <p className="font-mono text-xs text-ink-muted">{item.time}</p>
          </>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._id ? "Edit experience" : "Add experience"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldInput label="title" name="title" register={register} required error={errors.title} />
          <FieldInput label="company" name="company" register={register} required error={errors.company} />
          <FieldInput label="time (e.g. Jan 2025 — Present)" name="time" register={register} />
          <FieldInput label="description" name="description" textarea register={register} />
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">
            save
          </button>
        </form>
      </Modal>
    </div>
  );
}
