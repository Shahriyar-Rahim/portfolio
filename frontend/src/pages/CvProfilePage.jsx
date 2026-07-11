import { useEffect, useState } from "react";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export default function CvProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/cv/profile`)
      .then(async (res) => ({ ok: res.ok, payload: await res.json() }))
      .then(({ ok, payload }) => {
        if (!ok) throw new Error(payload?.message || "Unable to load the CV profile right now.");
        setProfile(payload?.data || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-24 text-sm text-ink-dim">Loading profile…</div>;
  if (!profile) return <div className="mx-auto max-w-6xl px-6 py-24 text-sm text-ink-dim">{error || "No CV profile available yet."}</div>;

  const hasContact = profile.email || profile.phone || profile.location;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="bg-circuit border-b border-line px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-5 sm:gap-7">
              {profile.profileImageUrl ? <img src={profile.profileImageUrl} alt={profile.name || "Profile"} className="h-24 w-24 shrink-0 rounded-2xl border border-line object-cover sm:h-28 sm:w-28" /> : <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-line bg-bg font-display text-3xl text-copper sm:h-28 sm:w-28">{(profile.name || "P").slice(0, 1)}</div>}
              <div className="min-w-0"><p className="font-mono text-xs uppercase tracking-[0.26em] text-copper-soft">Curriculum vitae</p><h1 className="mt-3 break-words font-display text-3xl text-ink sm:text-4xl">{profile.name || "Professional profile"}</h1>{profile.headline ? <p className="mt-2 text-base text-signal-soft">{profile.headline}</p> : null}</div>
            </div>
            {hasContact ? <address className="not-italic text-sm leading-7 text-ink-dim md:min-w-52 md:border-l md:border-line md:pl-6">{profile.email ? <p><a className="hover:text-copper-soft" href={`mailto:${profile.email}`}>{profile.email}</a></p> : null}{profile.phone ? <p><a className="hover:text-copper-soft" href={`tel:${profile.phone}`}>{profile.phone}</a></p> : null}{profile.location ? <p>{profile.location}</p> : null}</address> : null}
          </div>
          {profile.summary ? <p className="mt-8 max-w-3xl text-sm leading-7 text-ink-dim sm:text-base">{profile.summary}</p> : null}
        </div>

        <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <aside className="space-y-10">
            <CvSection title="Skills">{profile.skills?.length ? <div className="flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill} className="rounded-full border border-line bg-bg px-3 py-1 text-sm text-ink-dim">{skill}</span>)}</div> : <Empty label="Skills coming soon." />}</CvSection>
            <CvSection title="Education">{profile.education?.length ? <div className="space-y-4">{profile.education.map((item, index) => <article key={`${item.degree}-${index}`} className="border-l-2 border-copper pl-4"><h3 className="font-medium text-ink">{item.degree}</h3><p className="mt-1 text-sm text-ink-dim">{item.institution}</p>{item.period ? <p className="mt-1 font-mono text-xs text-ink-muted">{item.period}</p> : null}</article>)}</div> : <Empty label="Education details coming soon." />}</CvSection>
          </aside>
          <div className="space-y-10">
            <CvSection title="Experience">{profile.experience?.length ? <div className="space-y-6">{profile.experience.map((item, index) => <article key={`${item.role}-${index}`} className="rounded-xl border border-line bg-bg/50 p-5"><div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"><h3 className="font-display text-lg text-ink">{item.role || "Role"}</h3>{item.period ? <p className="font-mono text-xs text-ink-muted">{item.period}</p> : null}</div>{item.company ? <p className="mt-1 text-sm text-copper-soft">{item.company}</p> : null}</article>)}</div> : <Empty label="Experience details coming soon." />}</CvSection>
            <CvSection title="Selected projects">{profile.projects?.length ? <div className="grid gap-4 sm:grid-cols-2">{profile.projects.map((item, index) => <article key={`${item.name}-${index}`} className="rounded-xl border border-line bg-bg/50 p-5"><h3 className="font-medium text-ink">{item.name || "Project"}</h3>{item.description ? <p className="mt-2 text-sm leading-6 text-ink-dim">{item.description}</p> : null}{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-signal-soft hover:text-copper-soft">View project ↗</a> : null}</article>)}</div> : <Empty label="Projects coming soon." />}</CvSection>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-line px-6 py-5 sm:px-10"><Link to="/" className="rounded-md border border-line px-4 py-2 text-sm text-ink-dim hover:border-copper hover:text-ink">Back home</Link>{profile.cvUrl ? <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-bg hover:bg-copper-soft">Open CV</a> : null}</div>
      </section>
    </main>
  );
}

function CvSection({ title, children }) {
  return <section><h2 className="font-display text-xl text-ink">{title}</h2><div className="mt-4">{children}</div></section>;
}

function Empty({ label }) {
  return <p className="text-sm text-ink-muted">{label}</p>;
}
