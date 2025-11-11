import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import GovButton from "../components/ui/GovButton.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import toast from "react-hot-toast";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    // ✅ Basic password validations only
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm)
      newErrors.confirm = "Passwords must match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await signup({ email: form.email, password: form.password });
      await signOut(auth);

      toast.success(
        "Signup successful! Verification email sent. Please check your inbox.",
        { duration: 4000 }
      );

      setTimeout(() => nav("/login", { replace: true }), 2000);
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  }

  const inputBase =
    "w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition";
  const errorStyle = "border-red-500 focus:ring-red-400";
  const normalStyle = "border-gray-300 focus:ring-gov-chakra";

  return (
    <div className="mx-auto max-w-md bg-white p-6 rounded-2xl shadow-card">
      <SectionTitle
        title="Create an EMA Account"
        subtitle="Authorized registration only"
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

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className={`${inputBase} ${
              errors.confirm ? errorStyle : normalStyle
            }`}
            placeholder="••••••••"
          />
          {errors.confirm && (
            <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>
          )}
        </div>

        {/* Submit */}
        <GovButton type="submit" className="w-full">
          Register
        </GovButton>

        <p className="text-sm text-gray-600 text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-gov-chakra underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
