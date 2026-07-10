import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateEducation,
  useDeleteEducation,
  useEducation,
  useUpdateEducation,
} from "../../lib/hooks/useEducation";
import ResourceList from "../../components/admin/ResourceList";
import Modal from "../../components/admin/Modal";
import FieldInput from "../../components/admin/FieldInput";

export default function EducationAdmin() {
  const { data, isLoading, isError, error } = useEducation();
  const items = data?.data || [];
  const create = useCreateEducation();
  const update = useUpdateEducation();
  const remove = useDeleteEducation();
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openNew = () => { setEditing({}); reset({ institution: "", degree: "", group: "", subject: "", gpa: "", startYear: "", endYear: "" }); };
  const openEdit = (item) => { setEditing(item); reset(item); };

  const onSubmit = (values) => {
    const payload = {
      ...values,
      gpa: values.gpa ? Number(values.gpa) : undefined,
      startYear: values.startYear ? Number(values.startYear) : undefined,
      endYear: values.endYear ? Number(values.endYear) : undefined,
    };
    if (editing?._id) {
      update.mutate({ id: editing._id, payload }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(payload, { onSuccess: () => setEditing(null) });
    }
  };

  return (
    <div>
      <ResourceList
        title="Education"
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={items}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={(item) => confirm("Delete this entry?") && remove.mutate(item._id)}
        renderItem={(item) => (
          <>
            <p className="font-display text-sm text-ink">{item.institution}</p>
            <p className="font-mono text-xs text-ink-muted">{item.degree} · {item.startYear}{item.endYear ? `–${item.endYear}` : ""}</p>
          </>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._id ? "Edit education" : "Add education"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldInput label="institution" name="institution" register={register} required error={errors.institution} />
          <FieldInput label="degree" name="degree" register={register} required error={errors.degree} />
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="group" name="group" register={register} />
            <FieldInput label="subject" name="subject" register={register} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FieldInput label="gpa" name="gpa" type="number" step="0.01" register={register} />
            <FieldInput label="start year" name="startYear" type="number" register={register} />
            <FieldInput label="end year" name="endYear" type="number" register={register} />
          </div>
          <button type="submit" className="w-full rounded-md bg-copper px-4 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors">
            save
          </button>
        </form>
      </Modal>
    </div>
  );
}
