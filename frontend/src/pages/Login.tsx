import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export function Login() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      navigate("/");
    } catch {
      // erreur affichée via login.isError
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <h1 className="mb-8 text-center text-2xl font-bold">Notre Budget</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl bg-slate-900 p-3 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl bg-slate-900 p-3 outline-none"
          required
        />
        {login.isError && (
          <p className="text-sm text-red-500">Email ou mot de passe incorrect.</p>
        )}
        <button
          type="submit"
          disabled={login.isPending}
          className="rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
        >
          {login.isPending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
