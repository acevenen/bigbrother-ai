"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Flow = "student" | "alumni";

interface StoredUser {
  name: string;
  email: string;
  gradYear: number | null;
  type: "student" | "alumni";
  verified: boolean;
}

function saveUser(user: StoredUser) {
  localStorage.setItem("bb_user", JSON.stringify(user));
}

function savePendingRequest(req: Omit<StoredUser, "verified">) {
  const existing = JSON.parse(localStorage.getItem("bb_pending") ?? "[]");
  existing.push({ ...req, submittedAt: new Date().toISOString() });
  localStorage.setItem("bb_pending", JSON.stringify(existing));
}

// ── Student Flow ─────────────────────────────────────────────────────────────

function StudentForm({ onVerified }: { onVerified: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError("Enter your school email."); return; }
    if (!trimmed.endsWith("@dlshs.org")) {
      setError("Must be a @dlshs.org email address.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate brief verification check
    setTimeout(() => {
      const name = trimmed.split("@")[0].replace(".", " ").replace(/\b\w/g, c => c.toUpperCase());
      saveUser({ name, email: trimmed, gradYear: null, type: "student", verified: true });
      setLoading(false);
      onVerified();
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/30 text-[0.6rem] tracking-[0.28em] uppercase mb-2">
          Student Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="firstname.lastname@dlshs.org"
          className="w-full bg-[#040e07] border border-white/[0.1] focus:border-[#c9a84c]/40 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none transition-colors"
        />
        {error && (
          <p className="mt-2 text-red-400/70 text-xs">{error}</p>
        )}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-[#c9a84c] hover:bg-[#e4c56a] disabled:opacity-50 disabled:cursor-not-allowed text-[#040e07] font-bold text-[0.72rem] tracking-[0.2em] uppercase py-3.5 transition-colors duration-150"
      >
        {loading ? "Verifying…" : "Verify Student Status →"}
      </button>

      <p className="text-white/20 text-xs text-center leading-relaxed">
        Your @dlshs.org email is automatically verified.
        <br />No manual review needed.
      </p>
    </div>
  );
}

// ── Alumni Flow ──────────────────────────────────────────────────────────────

function AlumniForm({ onSubmitted }: { onSubmitted: (name: string) => void }) {
  const [name, setName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Enter your full name.";
    const yr = parseInt(gradYear);
    if (!gradYear || isNaN(yr) || yr < 1970 || yr > currentYear) {
      e.gradYear = `Enter a grad year between 1970 and ${currentYear}.`;
    }
    if (!email.trim() || !email.includes("@")) e.email = "Enter a valid email.";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      savePendingRequest({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        gradYear: parseInt(gradYear),
        type: "alumni",
      });
      setLoading(false);
      onSubmitted(name.trim().split(" ")[0]);
    }, 900);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/30 text-[0.6rem] tracking-[0.28em] uppercase mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
          placeholder="Marco Delgado"
          className="w-full bg-[#040e07] border border-white/[0.1] focus:border-[#c9a84c]/40 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none transition-colors"
        />
        {errors.name && <p className="mt-1 text-red-400/70 text-xs">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-white/30 text-[0.6rem] tracking-[0.28em] uppercase mb-2">
          Graduation Year
        </label>
        <input
          type="number"
          value={gradYear}
          onChange={e => { setGradYear(e.target.value); setErrors(p => ({ ...p, gradYear: "" })); }}
          placeholder="2015"
          min={1970}
          max={currentYear}
          className="w-full bg-[#040e07] border border-white/[0.1] focus:border-[#c9a84c]/40 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none transition-colors"
        />
        {errors.gradYear && <p className="mt-1 text-red-400/70 text-xs">{errors.gradYear}</p>}
      </div>

      <div>
        <label className="block text-white/30 text-[0.6rem] tracking-[0.28em] uppercase mb-2">
          Personal Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="you@gmail.com"
          className="w-full bg-[#040e07] border border-white/[0.1] focus:border-[#c9a84c]/40 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none transition-colors"
        />
        {errors.email && <p className="mt-1 text-red-400/70 text-xs">{errors.email}</p>}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-[#c9a84c] hover:bg-[#e4c56a] disabled:opacity-50 disabled:cursor-not-allowed text-[#040e07] font-bold text-[0.72rem] tracking-[0.2em] uppercase py-3.5 transition-colors duration-150"
      >
        {loading ? "Submitting…" : "Request Access →"}
      </button>

      <p className="text-white/20 text-xs text-center leading-relaxed">
        Alumni requests are reviewed manually.
        <br />You'll hear back within 24–48 hours.
      </p>
    </div>
  );
}

// ── Pending Confirmation ─────────────────────────────────────────────────────

function PendingConfirmation({ firstName }: { firstName: string }) {
  return (
    <div className="text-center space-y-5">
      <div className="w-14 h-14 mx-auto border border-[#c9a84c]/30 flex items-center justify-center">
        <svg className="w-6 h-6 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 className="text-white font-bold text-xl mb-2">Request received, {firstName}.</h3>
        <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
          We'll verify your alumni status and send you access within 24–48 hours.
        </p>
      </div>
      <div className="border-t border-white/[0.06] pt-5">
        <p className="text-white/20 text-xs tracking-wide">
          Questions? Reach us at{" "}
          <span className="text-[#c9a84c]/50">hello@brotherhoodbuddy.com</span>
        </p>
      </div>
      <Link
        href="/"
        className="inline-block text-white/30 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

// ── Tab Button ───────────────────────────────────────────────────────────────

function Tab({
  label,
  sublabel,
  active,
  onClick,
}: {
  label: string;
  sublabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 px-3 text-left border-b-2 transition-all duration-200 ${
        active
          ? "border-[#c9a84c] bg-[#c9a84c]/5"
          : "border-transparent hover:border-white/10"
      }`}
    >
      <p className={`text-sm font-bold tracking-tight ${active ? "text-white" : "text-white/35"}`}>
        {label}
      </p>
      <p className={`text-[0.6rem] tracking-[0.2em] uppercase mt-0.5 ${active ? "text-[#c9a84c]/70" : "text-white/20"}`}>
        {sublabel}
      </p>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function VerifyPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<Flow>("student");
  const [pendingFirstName, setPendingFirstName] = useState<string | null>(null);

  const handleVerified = () => router.replace("/dashboard");
  const handleSubmitted = (firstName: string) => setPendingFirstName(firstName);

  return (
    <main className="min-h-screen bg-[#040e07] text-white flex flex-col">

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06]">
        <Link href="/" className="text-[#c9a84c] font-bold tracking-[0.25em] text-xs uppercase">
          Brotherhood Buddy
        </Link>
        <Link href="/directory" className="text-white/40 hover:text-white text-sm transition-colors tracking-wide">
          Directory
        </Link>
      </nav>

      {/* ── Card ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-[0.6rem] tracking-[0.42em] uppercase">
                Access Gate
              </span>
              <div className="w-8 h-px bg-[#c9a84c]/50" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2">
              Lancers Only
            </h1>
            <p className="text-white/35 text-sm leading-relaxed">
              Verify your connection to De La Salle<br />to join the brotherhood.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#06120a] border border-white/[0.08]">

            {pendingFirstName ? (
              <div className="p-7">
                <PendingConfirmation firstName={pendingFirstName} />
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex border-b border-white/[0.08]">
                  <Tab
                    label="Current Student"
                    sublabel="Auto-verified"
                    active={flow === "student"}
                    onClick={() => setFlow("student")}
                  />
                  <Tab
                    label="Alumni"
                    sublabel="Manual review"
                    active={flow === "alumni"}
                    onClick={() => setFlow("alumni")}
                  />
                </div>

                {/* Form */}
                <div className="p-7">
                  {flow === "student" ? (
                    <StudentForm onVerified={handleVerified} />
                  ) : (
                    <AlumniForm onSubmitted={handleSubmitted} />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          {!pendingFirstName && (
            <p className="text-center text-white/15 text-[0.6rem] tracking-[0.3em] uppercase mt-6">
              Enter to Learn · Leave to Serve
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
