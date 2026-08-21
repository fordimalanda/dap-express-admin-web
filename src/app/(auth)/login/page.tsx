"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("fordimalanda7@gmail.com");
  const [password, setPassword] = useState("MALANDA100");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.post("/auth/login", { email, password });
      authStorage.setToken(res.data.accessToken);
      authStorage.setUser(res.data.admin);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      const serverMsg = err.response?.data?.message;
      if (typeof serverMsg === "string") {
        setError(serverMsg);
      } else if (Array.isArray(serverMsg)) {
        setError(serverMsg.join(", "));
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Impossible de joindre le serveur API (port 3000). Vérifiez que Docker / l'API est démarré.");
      } else {
        setError("Identifiants incorrects ou compte inactif.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6B00] mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Connexion Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Espace de gestion Dap-Express</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mot de passe"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-2 font-bold">
            Se Connecter au Dashboard
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Accès restreint aux administrateurs autorisés
        </div>
      </div>
    </div>
  );
}
