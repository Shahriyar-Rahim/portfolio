import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { cvApi } from "../../lib/api/cv.api";

const asList = (value) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

const asEntries = (value, fields) =>
  value
    .split("\n")
    .map((line) => line.split("|").map((item) => item.trim()))
    .filter((parts) => parts.some(Boolean))
    .map((parts) => Object.fromEntries(fields.map((field, index) => [field, parts[index] || ""])));

const entriesAsText = (entries, fields) =>
  (entries || []).map((entry) => fields.map((field) => entry[field] || "").join(" | ")).join("\n");

const toFormValues = (profile = {}) => ({
  name: profile.name || "", headline: profile.headline || "", email: profile.email || "",
  phone: profile.phone || "", location: profile.location || "", summary: profile.summary || "",
  skills: (profile.skills || []).join(", "),
  experience: entriesAsText(profile.experience, ["role", "company", "period"]),
  projects: entriesAsText(profile.projects, ["name", "description", "url"]),
  education: entriesAsText(profile.education, ["degree", "institution", "period"]),
});

export default function CvProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const applyProfile = (data) => {
    setProfile(data);
    reset(toFormValues(data));
  };

  useEffect(() => {
    cvApi.getProfile().then((payload) => applyProfile(payload.data)).catch(() => toast.error("Unable to load the CV profile")).finally(() => setLoading(false));
  }, []);

  const saveProfile = async (values) => {
    setSaving(true);
    try {
      const payload = await cvApi.updateProfile({
        ...values,
        skills: asList(values.skills || ""),
        experience: asEntries(values.experience || "", ["role", "company", "period"]),
        projects: asEntries(values.projects || "", ["name", "description", "url"]),
        education: asEntries(values.education || "", ["degree", "institution", "period"]),
      });
      applyProfile(payload.data);
      toast.success("CV profile saved");
    } catch (error) { toast.error(error.message); } finally { setSaving(false); }
  };

  const upload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(type, file);
      const payload = type === "cv" ? await cvApi.uploadCv(formData) : await cvApi.uploadImage(formData);
      applyProfile(payload.data);
      toast.success(type === "cv" ? "CV uploaded and profile updated" : "Profile photo updated");
    } catch (error) { toast.error(error.message); } finally { setUploading(false); event.target.value = ""; }
  };

  const removeImage = async () => {
    try {
      const payload = await cvApi.removeImage();
      applyProfile(payload.data);
      toast.success("Profile photo removed");
    } catch (error) { toast.error(error.message); }
  };

  if (loading) return <p className="text-sm text-ink-dim">Loading CV profile…</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-ink">CV profile</h1>
      <p className="mt-2 text-sm text-ink-dim">Maintain the public profile, work history, projects, and education shown on your CV page.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="cursor-pointer rounded-xl border border-dashed border-line bg-surface p-5 text-sm text-ink-dim hover:border-copper">
          <span className="block font-medium text-ink">Upload CV</span><span className="mt-1 block">PDF, DOC, or DOCX — details are extracted automatically.</span>
          <input className="sr-only" type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={(event) => upload(event, "cv")} />
        </label>
        <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 text-sm text-ink-dim">
          {profile?.profileImageUrl ? <img src={profile.profileImageUrl} alt="Profile" className="h-16 w-16 rounded-full object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-full bg-bg text-xl text-ink-muted">?</div>}
          <div className="space-y-1"><p className="font-medium text-ink">Profile photo</p><label className="cursor-pointer text-copper-soft">{profile?.profileImageUrl ? "Replace photo" : "Upload photo"}<input className="sr-only" type="file" accept="image/*" onChange={(event) => upload(event, "image")} /></label>{profile?.profileImageUrl ? <button type="button" onClick={removeImage} className="ml-3 text-danger">Remove</button> : null}</div>
        </div>
      </div>
      {uploading ? <p className="mt-3 text-sm text-copper-soft">Uploading…</p> : null}

      <form onSubmit={handleSubmit(saveProfile)} className="mt-6 space-y-6 rounded-xl border border-line bg-surface p-5">
        <section><h2 className="font-display text-lg text-ink">Profile details</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{[["name", "Name"], ["headline", "Headline"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"], ["skills", "Skills (comma separated)"]].map(([name, label]) => <label key={name} className="text-sm text-ink-dim">{label}<input {...register(name)} className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" /></label>)}</div><label className="mt-4 block text-sm text-ink-dim">Summary<textarea {...register("summary")} rows={5} className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-ink" /></label></section>
        <EntryField register={register} name="experience" title="Experience" hint="One per line: Role | Company | Period" />
        <EntryField register={register} name="projects" title="Projects" hint="One per line: Project name | Description | Link" />
        <EntryField register={register} name="education" title="Education" hint="One per line: Degree | Institution | Period" />
        <button disabled={saving} className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-bg">{saving ? "Saving…" : "Save profile"}</button>
      </form>
    </div>
  );
}

function EntryField({ register, name, title, hint }) {
  return <section className="border-t border-line pt-5"><h2 className="font-display text-lg text-ink">{title}</h2><p className="mt-1 text-xs text-ink-muted">{hint}</p><textarea {...register(name)} rows={4} className="mt-3 w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink" /></section>;
}
