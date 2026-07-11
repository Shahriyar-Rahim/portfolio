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
  const [imageFile, setImageFile] = useState(null);

  const openNew = () => { setEditing({}); setImageFile(null); reset({ title: "", description: "", img: "" }); };
  const openEdit = (item) => { setEditing(item); setImageFile(null); reset(item); };

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (imageFile) formData.append("image", imageFile);
    if (!imageFile && values.img) formData.append("img", values.img);

    if (editing?._id) {
      update.mutate({ id: editing._id, payload: formData }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(formData, { onSuccess: () => setEditing(null) });
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
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">image upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              className="w-full rounded-md border border-dashed border-line bg-bg px-3.5 py-2 text-sm text-ink"
            />
          </div>
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">
            save
          </button>
        </form>
      </Modal>
    </div>
  );
}
