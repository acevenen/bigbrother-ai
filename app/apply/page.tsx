"use client";

import { useState } from "react";
import Link from "next/link";

interface FormState {
  fullName: string;
  email: string;
  gradYear: string;
  currentCity: string;
  currentRole: string;
  university: string;
  bio: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  gradYear?: string;
  currentCity?: string;
  currentRole?: string;
  university?: string;
  bio?: string;
}

const EMPTY: FormState = {
  fullName: "",
  email: "",
  gradYear: "",
  currentCity: "",
  currentRole: "",
  university: "",
  bio: "",
};

const inputClass =
  "w-full bg-[#040e07] border border-white/[0.1] focus:border-[#c9a84c]/40 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none transition-colors";

const labelClass =
  "block text-white/30 text-[0.6rem] tracking-[0.28em] uppercase mb-2";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className="mt-1 text-red-400/70 text-xs">{error}</p>}
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="text-center space-y-6 py-2">
      <div className="w-14 h-14 mx-auto border border-[#c9a84c]/30 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-[#c9a84c]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-white text-base leading-relaxed max-w-xs mx-auto">
        you&apos;re in the queue — we&apos;ll review your application and reach
        out soon. welcome to the brotherhood.
      </p>
      <div className="border-t border-white/[0.06] pt-5">
        <Link
          href="/"
          className="text-white/30 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name.";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Enter a valid email address.";
    const yr = parseInt(form.gradYear);
    const now = new Date().getFullYear();
    if (!form.gradYear || isNaN(yr) || yr < 1950 || yr > now + 5)
      e.gradYear = "Enter a valid graduation year.";
    if (!form.currentCity.trim()) e.currentCity = "Enter your current city.";
    if (!form.currentRole.trim()) e.currentRole = "Enter your current role.";
    if (!form.university.trim()) e.university = "Enter your college or university.";
    if (!form.bio.trim()) e.bio = "Write a short bio.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("https://formspree.io/f/xlgklywq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Alumni Application — ${form.fullName}`,
          fullName: form.fullName,
          email: form.email,
          graduationYear: form.gradYear,
          currentCity: form.currentCity,
          currentRole: form.currentRole,
          university: form.university,
          bio: form.bio,
          source: "alumni-apply",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#040e07] text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06]">
        <Link
          href="/"
          className="text-[#c9a84c] font-bold tracking-[0.25em] text-xs uppercase"
        >
          Brotherhood Buddy
        </Link>
        <Link
          href="/verify"
          className="text-white/40 hover:text-white text-sm transition-colors tracking-wide"
        >
          Sign In
        </Link>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-start justify-center px-4 py-14">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-[0.6rem] tracking-[0.42em] uppercase">
                Alumni Application
              </span>
              <div className="w-8 h-px bg-[#c9a84c]/50" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2">
              Join the Brotherhood
            </h1>
            <p className="text-white/35 text-sm leading-relaxed">
              Tell us who you are and where you&apos;ve been.
              <br />
              Every application is reviewed personally.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#06120a] border border-white/[0.08] p-7">
            {submitted ? (
              <SuccessCard />
            ) : (
              <div className="space-y-5">

                <Field label="Full Name" error={errors.fullName}>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={set("fullName")}
                    placeholder="Marcus Williams"
                    className={inputClass}
                  />
                </Field>

                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="marcus@example.com"
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Graduation Year" error={errors.gradYear}>
                    <input
                      type="number"
                      value={form.gradYear}
                      onChange={set("gradYear")}
                      placeholder="2019"
                      min={1950}
                      max={new Date().getFullYear() + 5}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Current City" error={errors.currentCity}>
                    <input
                      type="text"
                      value={form.currentCity}
                      onChange={set("currentCity")}
                      placeholder="Atlanta, GA"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Current Role" error={errors.currentRole}>
                    <input
                      type="text"
                      value={form.currentRole}
                      onChange={set("currentRole")}
                      placeholder="Software Engineer"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="College / University" error={errors.university}>
                    <input
                      type="text"
                      value={form.university}
                      onChange={set("university")}
                      placeholder="Howard University"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Short Bio" error={errors.bio}>
                  <textarea
                    value={form.bio}
                    onChange={set("bio")}
                    placeholder="Tell us a bit about yourself, what you've been up to, and why you're reaching out now…"
                    rows={5}
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </Field>

                {serverError && (
                  <p className="text-red-400/70 text-xs">{serverError}</p>
                )}

                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full bg-[#c9a84c] hover:bg-[#e4c56a] disabled:opacity-50 disabled:cursor-not-allowed text-[#040e07] font-bold text-[0.72rem] tracking-[0.2em] uppercase py-3.5 transition-colors duration-150"
                >
                  {loading ? "Submitting…" : "Submit Application →"}
                </button>
              </div>
            )}
          </div>

          {!submitted && (
            <p className="text-center text-white/15 text-[0.6rem] tracking-[0.3em] uppercase mt-6">
              Enter to Learn · Leave to Serve
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
