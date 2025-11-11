import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
import GovButton from "../components/ui/GovButton.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import toast from "react-hot-toast";

export default function Login() {
  const { login, resendVerificationEmail } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showResend, setShowResend] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    // ✅ Basic validation only
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const result = await login(form);
      if (!result) {
        // User exists but not verified
        setShowResend(true);
        toast.error("Email not verified. Please verify your email.");
        return;
      }

      toast.success("Login successful!");
      const dest = loc.state?.from?.pathname || "/data-entry";
      setTimeout(() => nav(dest, { replace: true }), 2000);
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  }

  async function handleResend() {
    try {
      await resendVerificationEmail();
      toast.success("Verification email resent. Please check your inbox.");
    } catch (err) {
      toast.error("Failed to resend verification email.");
    }
  }

  const inputBase =
    "w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition";
  const errorStyle = "border-red-500 focus:ring-red-400";
  const normalStyle = "border-gray-300 focus:ring-gov-chakra";

  return (
    <div className="mx-auto max-w-md bg-white p-6 rounded-2xl shadow-card">
      <SectionTitle
        title="Login to EMA Portal"
        subtitle="Authorized personnel only"
      />

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`${inputBase} ${
              errors.email ? errorStyle : normalStyle
            }`}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`${inputBase} ${
              errors.password ? errorStyle : normalStyle
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Sign In Button */}
        <GovButton type="submit" className="w-full">
          Sign In
        </GovButton>

        {/* Resend Verification Email (only for unverified users) */}
        {showResend && (
          <button
            type="button"
            onClick={handleResend}
            className="w-full mt-3 text-sm text-gov-chakra underline"
          >
            Resend verification email
          </button>
        )}

        <p className="text-sm text-gray-600 text-center mt-4">
          No account?{" "}
          <Link to="/signup" className="text-gov-chakra underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
