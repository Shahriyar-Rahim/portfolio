import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useResetPassword } from "../lib/hooks/useAuth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const { register, handleSubmit, formState: { errors } } = useForm();
  const resetPassword = useResetPassword();
  const submit = (values) => resetPassword.mutate({ email, token, password: values.password }, { onSuccess: () => navigate("/login") });

  if (!email || !token) return <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-ink-dim">This reset link is incomplete. <Link to="/login#forgot" className="ml-1 text-copper-soft">Request a new link</Link>.</div>;
  return <div className="min-h-screen bg-bg bg-circuit flex items-center justify-center px-6"><form onSubmit={handleSubmit(submit)} className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 trace-border space-y-4"><div><p className="font-mono text-xs text-copper">SECURE RESET</p><h1 className="mt-2 font-display text-2xl text-ink">Choose a new password</h1><p className="mt-2 text-sm text-ink-dim">for {email}</p></div><label className="block font-mono text-xs text-ink-muted">new password<input type="password" {...register("password", { required: "A new password is required", minLength: { value: 8, message: "Use at least 8 characters" } })} className="mt-2 w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink" /></label>{errors.password ? <p className="text-danger text-xs">{errors.password.message}</p> : null}<button disabled={resetPassword.isPending} className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm font-medium text-bg">{resetPassword.isPending ? "changing…" : "change password"}</button></form></div>;
}
