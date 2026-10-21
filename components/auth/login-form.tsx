"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function doLogin(loginEmail: string, loginPassword: string) {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Неверная почта или пароль. Попробуйте ещё раз.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void doLogin(email, password);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-graphite dark:text-white">Электронная почта</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="name@iceflower.io"
          className="rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-graphite dark:text-white">Пароль</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-md border border-graphite/20 bg-white px-3 py-2 pr-20 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto h-7 rounded px-2 text-xs font-medium text-graphite/70 hover:text-graphite dark:text-white/70 dark:hover:text-white"
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </div>
      </label>

      {error && (
        <p className="rounded-md bg-sun/10 px-3 py-2 text-sm font-medium text-sun">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-md bg-sun px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sun/90 disabled:opacity-60"
      >
        {loading ? "Входим…" : "Войти"}
      </button>

      <div className="mt-2 flex flex-col gap-2 border-t border-graphite/10 pt-4 dark:border-white/10">
        <p className="text-xs font-medium uppercase tracking-wide text-graphite/60 dark:text-white/60">
          Демо-доступ
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => void doLogin("anna@iceflower.io", "password123")}
          className="rounded-md border border-aurora px-4 py-2 text-sm font-medium text-aurora transition-colors hover:bg-aurora/10 disabled:opacity-60"
        >
          Войти как админ
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void doLogin("ilya@iceflower.io", "password123")}
          className="rounded-md border border-aurora px-4 py-2 text-sm font-medium text-aurora transition-colors hover:bg-aurora/10 disabled:opacity-60"
        >
          Войти как сотрудник
        </button>
      </div>
    </form>
  );
}
