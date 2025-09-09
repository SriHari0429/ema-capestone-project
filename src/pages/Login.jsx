import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
import GovButton from "../components/ui/GovButton.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });

  function onSubmit(e) {
    e.preventDefault();
    login(form);
    const dest = loc.state?.from?.pathname || "/data-entry";
    nav(dest, { replace: true });
  }

  return (
    <div className="mx-auto max-w-md bg-white p-6 rounded-2xl shadow-card">
      <SectionTitle title="Login to EMA Portal" subtitle="Authorized personnel only" />
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
        <GovButton type="submit" className="w-full">Sign In</GovButton>
        <p className="text-sm text-gray-600">
          No account? <Link to="/signup" className="text-gov-chakra underline">Create one</Link>
        </p>
      </form>
    </div>
  );
}
