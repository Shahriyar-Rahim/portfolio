import { useForm } from "react-hook-form";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useLogin, useRecovery } from "../lib/hooks/useAuth";

export default function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const login = useLogin();
  const recovery = useRecovery();
  const recoveryMode = window.location.hash === "#forgot";

  return <div className="min-h-screen bg-bg bg-circuit flex items-center justify-center px-6">
    <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 trace-border">
      <div className="mb-6 flex items-center gap-2 font-mono text-sm text-copper"><HiOutlineLockClosed /> admin access</div>
      {recoveryMode ? <form onSubmit={handleSubmit((values) => recovery.mutate({ email: values.email }))} className="space-y-4">
        <div><h1 className="font-display text-xl text-ink">Reset your password</h1><p className="mt-2 text-sm leading-6 text-ink-dim">Enter your admin email and we’ll send a secure magic link to choose a new password.</p></div>
        <label className="block font-mono text-xs text-ink-muted">email<input type="email" {...register("email", { required: "Email is required" })} className="mt-2 w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink" /></label>
        {errors.email ? <p className="text-danger text-xs">{errors.email.message}</p> : null}
        <button type="submit" disabled={recovery.isPending} className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm font-medium text-bg">{recovery.isPending ? "sending…" : "send magic link"}</button>
        <a href="/login" className="block text-center text-sm text-ink-dim">back to sign in</a>
      </form> : <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
        <div><label className="font-mono text-xs text-ink-muted block mb-2">email</label><input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink" placeholder="you@example.com" />{errors.email ? <p className="mt-1 text-danger text-xs">{errors.email.message}</p> : null}</div>
        <div><label className="font-mono text-xs text-ink-muted block mb-2">password</label><input type="password" {...register("password", { required: "Password is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink" placeholder="••••••••" />{errors.password ? <p className="mt-1 text-danger text-xs">{errors.password.message}</p> : null}</div>
        <button type="submit" disabled={login.isPending} className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm font-medium text-bg">{login.isPending ? "authenticating…" : "sign in"}</button>
        <a href="/login#forgot" onClick={() => reset()} className="block text-left text-sm text-ink-dim">forgot password?</a>
      </form>}
    </div>
  </div>;
}
