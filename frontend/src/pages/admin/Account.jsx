import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../lib/stores/authStore";
import api from "../../lib/api/axios";
import toast from "react-hot-toast";

export default function AccountAdmin() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { email: user?.email || "", password: "" } });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await api.patch("/auth/account", values);
      toast.success("Account updated.");
      reset({ email: values.email, password: "" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl rounded-2xl border border-line bg-surface p-6">
      <h1 className="font-display text-2xl text-ink">Account settings</h1>
      <p className="mt-2 text-sm text-ink-dim">Update the admin email or change the password securely.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="font-mono text-xs text-ink-muted block mb-1.5">email</label>
          <input {...register("email")} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted block mb-1.5">new password</label>
          <input type="password" {...register("password")} className="w-full rounded-md border border-line bg-bg px-3.5 py-2 text-sm text-ink" />
        </div>
        <button type="submit" disabled={loading} className="rounded-md bg-copper px-4 py-2.5 text-sm font-medium text-bg">{loading ? "saving…" : "save changes"}</button>
      </form>
    </div>
  );
}
