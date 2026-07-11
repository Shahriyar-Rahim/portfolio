import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useLogin, useRecovery, useVerifyRecovery } from "../lib/hooks/useAuth";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const login = useLogin();
  const recovery = useRecovery();
  const verifyRecovery = useVerifyRecovery();
  const [mode, setMode] = useState("login");
  const [emailForRecovery, setEmailForRecovery] = useState("");

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get("magic")) {
      setMode("magic");
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg bg-circuit flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 trace-border">
        <div className="flex items-center gap-2 mb-6 font-mono text-sm text-copper">
          <HiOutlineLockClosed /> admin access
        </div>
        {mode === "recovery" ? (
          <form
            onSubmit={handleSubmit((values) => {
              setEmailForRecovery(values.email);
              recovery.mutate({ email: values.email });
            })}
            className="space-y-4"
          >
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">email</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none" />
            </div>
            <button type="submit" disabled={recovery.isPending} className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50">{recovery.isPending ? "sending…" : "send recovery code"}</button>
            <button type="button" onClick={() => { setMode("login"); reset(); }} className="w-full text-sm text-ink-dim">back to sign in</button>
          </form>
        ) : mode === "verify" ? (
          <form onSubmit={handleSubmit((values) => verifyRecovery.mutate({ email: emailForRecovery, code: values.code, password: values.password }))} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">recovery code</label>
              <input {...register("code", { required: "Code is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink" />
            </div>
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">new password</label>
              <input type="password" {...register("password", { required: "Password is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink" />
            </div>
            <button type="submit" disabled={verifyRecovery.isPending} className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50">{verifyRecovery.isPending ? "verifying…" : "verify recovery"}</button>
            <button type="button" onClick={() => { setMode("login"); reset(); }} className="w-full text-sm text-ink-dim">back to sign in</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">email</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none" placeholder="you@example.com" />
              {errors.email && <p className="text-danger text-xs font-mono mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="font-mono text-xs text-ink-muted block mb-2">password</label>
              <input type="password" {...register("password", { required: "Password is required" })} className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none" placeholder="••••••••" />
              {errors.password && <p className="text-danger text-xs font-mono mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={login.isPending} className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50">{login.isPending ? "authenticating…" : "sign in"}</button>
            <div className="flex flex-col gap-2 text-sm text-ink-dim">
              <button type="button" onClick={() => { setMode("recovery"); reset(); }} className="text-left">forgot password?</button>
              <button type="button" onClick={() => { setMode("verify"); reset(); }} className="text-left">enter recovery code</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
