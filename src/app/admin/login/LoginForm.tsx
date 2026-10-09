"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { checkLoginRateLimit } from "../actions";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSending(true);

    const rate = await checkLoginRateLimit();
    if (!rate.allowed) {
      setSending(false);
      setError(`Too many failed login attempts from your IP. Please wait ${rate.retryAfterSeconds} seconds before trying again.`);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSending(false);

    if (signInError) {
      setError("Those details were not accepted. Use the admin account created in Supabase.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="text-sm font-medium text-[#38070e]">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-[#e5d0ad] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b1827] focus:ring-2 focus:ring-[#8b1827]/20"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="text-sm font-medium text-[#38070e]">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-[#e5d0ad] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b1827] focus:ring-2 focus:ring-[#8b1827]/20"
        />
      </div>
      {error ? <p className="text-sm text-[#8b1827]">{error}</p> : null}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#38070e] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#200408] disabled:opacity-60"
      >
        {sending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
