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
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function AdminLoginPage() {
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password / OTP Flow State
  // "login" | "forgot" | "otp"
  const [flowMode, setFlowMode] = useState<"login" | "forgot" | "otp">("login");
  const [forgotUsername, setForgotUsername] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle standard Login Submit
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect to dashboard on success (refreshing state)
        window.location.href = "/admin";
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err: any) {
      setError("Server connection failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Requesting OTP
  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!forgotUsername) {
      setError("Please enter your email or username.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: forgotUsername }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSentEmail(data.email);
        setSuccessMessage(data.message || "OTP code sent to email.");
        setFlowMode("otp");
      } else {
        setError(data.message || "Could not request reset OTP.");
      }
    } catch (err: any) {
      setError("Server connection failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification & Reset Password
  const handleResetPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otpCode || !newPassword) {
      setError("Please fill out both the OTP and your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpSentEmail,
          otp: otpCode,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message || "Password updated successfully!");
        // Clear forms and return to login
        setEmail(forgotUsername);
        setPassword("");
        setFlowMode("login");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setError("Server connection failed. Try again.");
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
            {flowMode === "login" ? (
              <ShieldCheck size={27} strokeWidth={2} />
            ) : (
              <KeyRound size={27} strokeWidth={2} />
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            {flowMode === "login" && "Admin Login"}
            {flowMode === "forgot" && "Forgot Password"}
            {flowMode === "otp" && "Reset Password"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {flowMode === "login" && "Sign in to access the administration panel"}
            {flowMode === "forgot" && "Enter details to receive your secure recovery OTP"}
            {flowMode === "otp" && "Verify OTP and set your new password"}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODE 1: Standard Login Form */}
        {flowMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Username/Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Admin Username / Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or email"
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
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#C8102E] hover:text-[#a00d25] transition"
                  onClick={() => {
                    setError("");
                    setSuccessMessage("");
                    setForgotUsername(email);
                    setFlowMode("forgot");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#C8102E]"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
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
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: Request OTP Form */}
        {flowMode === "forgot" && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label htmlFor="forgotUsername" className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Admin Username / Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="forgotUsername"
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  placeholder="e.g. cardme@999"
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

            {/* Buttons */}
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
                transition-all
                hover:bg-[#a90d27]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setFlowMode("login");
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: Verify OTP & Reset Password Form */}
        {flowMode === "otp" && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
            {/* OTP Code */}
            <div>
              <label htmlFor="otpCode" className="mb-2 block text-sm font-semibold text-slate-700">
                6-Digit Security OTP Code
              </label>
              <input
                id="otpCode"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="
                  h-12 w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4
                  text-center text-lg font-black tracking-widest text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-300
                  focus:border-[#C8102E]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#C8102E]/10
                "
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
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
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Buttons */}
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
                transition-all
                hover:bg-[#a90d27]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setFlowMode("login");
                }}
              >
                Cancel and Login
              </button>
            </div>
          </form>
        )}

        {/* Bottom Security */}
        <div className="mt-7 flex items-center justify-center gap-2">
          <LockKeyhole size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400">Secure administrator access</span>
        </div>
      </div>
    </main>
  );
}