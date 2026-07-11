import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBlog, useDeleteBlog, useBlogs, useUpdateBlog } from "../../lib/hooks/useBlogs";
import ResourceList from "../../components/admin/ResourceList";
import Modal from "../../components/admin/Modal";
import FieldInput from "../../components/admin/FieldInput";
import { formatDate } from "../../lib/helper/format";

export default function BlogsAdmin() {
  const { data, isLoading, isError, error } = useBlogs();
  const items = data?.data || [];
  const create = useCreateBlog();
  const update = useUpdateBlog();
  const remove = useDeleteBlog();
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [imageFile, setImageFile] = useState(null);

  const openNew = () => { setEditing({}); setImageFile(null); reset({ title: "", category: "", img: "", shortDescription: "", description: "" }); };
  const openEdit = (item) => { setEditing(item); setImageFile(null); reset(item); };

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("shortDescription", values.shortDescription);
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
        title="Blog posts"
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={items}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={(item) => confirm("Delete this post?") && remove.mutate(item._id)}
        renderItem={(item) => (
          <>
            <p className="font-display text-sm text-ink">{item.title}</p>
            <p className="font-mono text-xs text-ink-muted">{item.category} · {formatDate(item.createdAt)}</p>
          </>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._id ? "Edit post" : "New post"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldInput label="title" name="title" register={register} required error={errors.title} />
          <FieldInput label="category" name="category" register={register} required error={errors.category} />
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1.5">cover image upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              className="w-full rounded-md border border-dashed border-line bg-bg px-3.5 py-2 text-sm text-ink"
            />
          </div>
          <FieldInput label="short description" name="shortDescription" textarea register={register} required error={errors.shortDescription} />
          <FieldInput label="full content" name="description" textarea register={register} rows={8} required error={errors.description} />
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">
            save
          </button>
        </form>
      </Modal>
    </div>
  );
}
