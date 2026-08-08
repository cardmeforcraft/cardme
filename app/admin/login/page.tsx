"use client";

import { FormEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Connect Firebase authentication here
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log({
        email,
        password,
        rememberMe,
      });

      // Example:
      // await signInWithEmailAndPassword(auth, email, password);
      // router.push("/admin/dashboard");

    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      {/* Login Card */}
      <div
        className="
          w-full max-w-[430px]
          rounded-2xl
          border-2 border-slate-200
          bg-white
          p-7 sm:p-9
          shadow-[0_8px_30px_rgba(15,23,42,0.08)]
        "
      >

        {/* Header */}
        <div className="mb-8 text-center">

          {/* Logo */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8102E] text-white shadow-md shadow-red-900/10">
            <ShieldCheck size={27} strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the administration panel
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Admin email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                className="
                  h-12 w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  pl-11 pr-4
                  text-sm text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-[#C8102E]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#C8102E]/10
                "
              />

            </div>
          </div>

          {/* Password */}
          <div>

            <div className="mb-2 flex items-center justify-between">

              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <button
                type="button"
                className="
                  text-xs font-semibold
                  text-[#C8102E]
                  hover:text-[#a00d25]
                  transition
                "
                onClick={() => {
                  console.log("Forgot password");
                }}
              >
                Forgot password?
              </button>

            </div>

            <div className="relative">

              <LockKeyhole
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="
                  h-12 w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  pl-11 pr-12
                  text-sm text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-[#C8102E]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#C8102E]/10
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  rounded-lg p-2
                  text-slate-400
                  transition
                  hover:bg-slate-200
                  hover:text-slate-700
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">

            <label className="flex cursor-pointer items-center gap-2.5">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                className="
                  h-4 w-4
                  rounded
                  border-slate-300
                  accent-[#C8102E]
                "
              />

              <span className="text-sm text-slate-600">
                Remember me
              </span>

            </label>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              group
              flex h-12 w-full
              items-center justify-center
              gap-2
              rounded-xl
              bg-[#C8102E]
              px-5
              text-sm font-bold
              text-white
              shadow-md
              shadow-red-900/10
              transition-all
              hover:bg-[#a90d27]
              hover:shadow-lg
              hover:shadow-red-900/15
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight
                  size={17}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </>
            )}

          </button>

        </form>

        {/* Bottom Security */}
        <div className="mt-7 flex items-center justify-center gap-2">

          <LockKeyhole
            size={14}
            className="text-slate-400"
          />

          <span className="text-xs text-slate-400">
            Secure administrator access
          </span>

        </div>

      </div>
    </main>
  );
}