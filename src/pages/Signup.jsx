import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import GovButton from "../components/ui/GovButton.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });

  function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords must match");
    signup({ email: form.email, password: form.password });
    nav("/data-entry", { replace: true });
  }

  return (
    <div className="mx-auto max-w-md bg-white p-6 rounded-2xl shadow-card">
      <SectionTitle title="Create an EMA Account" subtitle="Authorized registration only" />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="name@gov.in"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <GovButton type="submit" className="w-full">Register</GovButton>
        <p className="text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-gov-chakra underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
