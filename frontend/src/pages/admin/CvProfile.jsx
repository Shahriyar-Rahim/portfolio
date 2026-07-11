import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const asList = (value) => value
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

export default function CvProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cv/profile`);
      const payload = await res.json();
      const data = payload?.data || null;
      setProfile(data);
      reset({
        name: data?.name || "", headline: data?.headline || "", email: data?.email || "",
        phone: data?.phone || "", location: data?.location || "", summary: data?.summary || "",
        skills: (data?.skills || []).join(", "),
      });
    } catch {
      toast.error("Unable to load the CV profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const saveProfile = async (values) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/cv/profile`, {
        method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, skills: asList(values.skills || "") }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Unable to save profile");
      setProfile(payload.data);
      toast.success("CV profile saved");
    } catch (error) { toast.error(error.message); } finally { setSaving(false); }
  };

  const upload = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append(field, file);
      const endpoint = field === "cv" ? "/cv/upload" : "/cv/profile/image";
      const res = await fetch(`${API_URL}${endpoint}`, { method: "POST", credentials: "include", body });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Upload failed");
      setProfile(payload.data);
      reset({ ...payload.data, skills: (payload.data.skills || []).join(", ") });
      toast.success(field === "cv" ? "CV uploaded and profile updated" : "Profile photo updated");
    } catch (error) { toast.error(error.message); } finally { setUploading(false); event.target.value = ""; }
  };

  const removeImage = async () => {
    try {
      const res = await fetch(`${API_URL}/cv/profile/image`, { method: "DELETE", credentials: "include" });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Unable to remove image");
      setProfile(payload.data);
      toast.success("Profile photo removed");
    } catch (error) { toast.error(error.message); }
  };

  if (loading) return <p className="text-sm text-ink-dim">Loading CV profile…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-ink">CV profile</h1>
      <p className="mt-2 text-sm text-ink-dim">Upload your CV to create a profile, then refine it. Your skills power the recommended jobs on the site.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="rounded-xl border border-dashed border-line bg-surface p-4 text-sm text-ink-dim cursor-pointer">
          <span className="block font-medium text-ink">Upload CV</span><span className="mt-1 block">PDF, DOC or DOCX</span>
          <input className="sr-only" type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={(event) => upload(event, "cv")} />
        </label>
        <div className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-dim">
          <div className="flex items-center gap-3">
            {profile?.profileImageUrl ? <img src={profile.profileImageUrl} alt="Profile" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-bg" />}
            <label className="cursor-pointer text-copper-soft">{profile?.profileImageUrl ? "Replace photo" : "Upload photo"}<input className="sr-only" type="file" accept="image/*" onChange={(event) => upload(event, "image")} /></label>
            {profile?.profileImageUrl ? <button type="button" onClick={removeImage} className="text-danger">Remove</button> : null}
          </div>
        </div>
      </div>
      {uploading ? <p className="mt-3 text-sm text-copper-soft">Uploading…</p> : null}
      <form onSubmit={handleSubmit(saveProfile)} className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {[["name", "Name"], ["headline", "Headline"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"], ["skills", "Skills (comma separated)"]].map(([name, label]) => <label key={name} className="text-sm text-ink-dim">{label}<input {...register(name)} className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" /></label>)}
        </div>
        <label className="block text-sm text-ink-dim">Summary<textarea {...register("summary")} rows={5} className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" /></label>
        <button disabled={saving} className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-bg">{saving ? "Saving…" : "Save profile"}</button>
      </form>
    </div>
  );
}
