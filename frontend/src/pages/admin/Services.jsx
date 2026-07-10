import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "../../lib/hooks/useServices";
import ResourceList from "../../components/admin/ResourceList";
import Modal from "../../components/admin/Modal";
import FieldInput from "../../components/admin/FieldInput";

export default function ServicesAdmin() {
  const { data, isLoading, isError, error } = useServices();
  const items = data?.data || [];
  const create = useCreateService();
  const update = useUpdateService();
  const remove = useDeleteService();
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openNew = () => { setEditing({}); reset({ title: "", description: "", img: "" }); };
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
        title="Services"
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={items}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={(item) => confirm("Delete this service?") && remove.mutate(item._id)}
        renderItem={(item) => (
          <>
            <p className="font-display text-sm text-ink">{item.title}</p>
            <p className="text-ink-muted text-xs truncate max-w-md">{item.description}</p>
          </>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._id ? "Edit service" : "Add service"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldInput label="title" name="title" register={register} required error={errors.title} />
          <FieldInput label="description" name="description" textarea register={register} required error={errors.description} />
          <FieldInput label="image URL" name="img" register={register} required error={errors.img} />
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">
            save
          </button>
        </form>
      </Modal>
    </div>
  );
}
