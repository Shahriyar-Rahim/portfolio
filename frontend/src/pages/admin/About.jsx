import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../lib/api/axios";

export default function AboutAdmin() {
  const { register, handleSubmit, reset } = useForm(); const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/about").then((res) => { const data = res.data.data || {}; reset({ ...data, toolchain: (data.toolchain || []).map((item) => `${item.label}: ${item.value}`).join("\n") }); }).catch(() => {}); }, [reset]);
  const submit = async (values) => { setSaving(true); try { const toolchain = values.toolchain.split("\n").map((line) => line.split(":")).filter(([label, value]) => label?.trim() && value?.trim()).map(([label, ...value]) => ({ label: label.trim(), value: value.join(":").trim() })); await api.patch("/about", { ...values, toolchain }); toast.success("About section saved"); } catch (error) { toast.error(error.message); } finally { setSaving(false); } };
  return <div className="max-w-3xl"><h1 className="font-display text-2xl text-ink">About section</h1><p className="mt-2 text-sm text-ink-dim">Edit the public introduction and toolchain. Changes appear on the homepage automatically.</p><form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-6">{[["title", "Heading"], ["intro", "Introduction"], ["details", "Second paragraph"]].map(([name, label]) => <label key={name} className="block text-sm text-ink-dim">{label}{name === "title" ? <input {...register(name)} className="mt-2 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" /> : <textarea {...register(name)} rows={4} className="mt-2 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" />}</label>)}<label className="block text-sm text-ink-dim">Toolchain (one per line: label: value)<textarea {...register("toolchain")} rows={5} className="mt-2 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" /></label><button disabled={saving} className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-bg">{saving ? "Saving…" : "Save about section"}</button></form></div>;
}
