import { useForm } from "react-hook-form";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useLogin } from "../lib/hooks/useAuth";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const login = useLogin();

  return (
    <div className="min-h-screen bg-bg bg-circuit flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 trace-border">
        <div className="flex items-center gap-2 mb-6 font-mono text-sm text-copper">
          <HiOutlineLockClosed /> admin access
        </div>
        <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-2">email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-danger text-xs font-mono mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="font-mono text-xs text-ink-muted block mb-2">password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger text-xs font-mono mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-md bg-copper px-4 py-3 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50"
          >
            {login.isPending ? "authenticating…" : "sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
