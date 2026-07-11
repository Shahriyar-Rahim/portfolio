import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function CvProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/cv/profile`)
      .then((res) => res.json())
      .then((payload) => {
        setProfile(payload?.data || null);
        setError(payload?.success === false ? payload.message : "");
      })
      .catch(() => setError("Unable to load the CV profile right now."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-6 py-24 text-sm text-ink-dim">Loading your profile…</div>;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-sm text-ink-dim">
        {error || "No CV profile available yet."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="rounded-3xl border border-line bg-surface p-8">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-copper-soft">my CV</p>
            <h1 className="mt-2 font-display text-3xl text-ink">{profile.name || "Professional profile"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-dim">{profile.summary || profile.headline || "A concise profile generated from the uploaded CV."}</p>
          </div>
          <div className="rounded-xl border border-line bg-bg/70 p-4 text-sm text-ink-dim">
            {profile.email ? <p>{profile.email}</p> : null}
            {profile.phone ? <p>{profile.phone}</p> : null}
            {profile.location ? <p>{profile.location}</p> : null}
          </div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <section>
              <h2 className="font-display text-xl text-ink">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile.skills || []).map((skill) => <span key={skill} className="rounded-full border border-line px-3 py-1 text-sm text-ink-muted">{skill}</span>)}
              </div>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink">Experience</h2>
              <div className="mt-3 space-y-3">
                {(profile.experience || []).slice(0, 4).map((item, index) => <div key={`${item.role}-${index}`} className="rounded-lg border border-line bg-bg/60 p-3 text-sm text-ink-dim"><p className="font-medium text-ink">{item.role || item.title}</p><p>{item.company || item.organization}</p></div>)}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <section>
              <h2 className="font-display text-xl text-ink">Projects</h2>
              <div className="mt-3 space-y-3">
                {(profile.projects || []).slice(0, 4).map((item, index) => <div key={`${item.name}-${index}`} className="rounded-lg border border-line bg-bg/60 p-3 text-sm text-ink-dim"><p className="font-medium text-ink">{item.name}</p><p>{item.description}</p></div>)}
              </div>
            </section>
            <div className="flex gap-3">
              <Link to="/" className="rounded-md border border-line px-4 py-2 text-sm text-ink-dim">back home</Link>
              {profile.cvUrl ? <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="rounded-md bg-copper px-4 py-2 text-sm text-bg">open CV</a> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
