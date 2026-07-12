"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StoredUser {
  name: string;
  email: string;
  gradYear: number | null;
  type: "student" | "alumni";
  verified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bb_user");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      const parsed: StoredUser = JSON.parse(raw);
      if (!parsed.verified) { router.replace("/"); return; }
      setUser(parsed);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const yearLabel = user.gradYear ? `Class of ${user.gradYear}` : "Current Student";

  return (
    <main className="min-h-screen bg-[#040e07] text-white flex flex-col">

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] bg-[#040e07]/80 backdrop-blur-sm">
        <span className="text-[#c9a84c] font-bold tracking-[0.25em] text-xs uppercase">
          Brotherhood Buddy
        </span>
        <button
          onClick={() => { localStorage.removeItem("bb_user"); router.replace("/"); }}
          className="text-white/30 hover:text-white text-sm transition-colors tracking-wide"
        >
          Sign Out
        </button>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#1a4a24] opacity-[0.15] blur-[120px]" />
        </div>

        <div className="relative flex flex-col items-center">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#1a4a24] border border-[#c9a84c]/40 flex items-center justify-center mb-6">
            <span className="text-[#c9a84c] text-lg font-black tracking-tight">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-[#c9a84c]/50" />
            <span className="text-[#c9a84c] text-[0.6rem] tracking-[0.42em] uppercase">
              {yearLabel} · De La Salle
            </span>
            <div className="w-6 h-px bg-[#c9a84c]/50" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
            Welcome to the Brotherhood,
            <br />
            <span className="text-[#c9a84c]">{firstName}.</span>
          </h1>

          <p className="text-white/35 text-[0.95rem] max-w-sm leading-relaxed mb-12">
            You're in. Your brothers are here — find them in the directory
            or talk to Big Brother whenever you need.
          </p>

          {/* CTA cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.07] w-full max-w-2xl">

            <Link
              href="/chat"
              className="group bg-[#040e07] hover:bg-[#06120a] transition-colors duration-300 p-7 flex flex-col gap-3 text-left"
            >
              <div className="w-10 h-10 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/60 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Big Brother</p>
                <p className="text-white/35 text-xs mt-0.5 leading-relaxed">
                  Ask anything. He's been where you are.
                </p>
              </div>
              <span className="text-[#c9a84c]/50 text-[0.6rem] tracking-[0.2em] uppercase mt-auto">
                Open Chat →
              </span>
            </Link>

            <Link
              href="/directory"
              className="group bg-[#040e07] hover:bg-[#06120a] transition-colors duration-300 p-7 flex flex-col gap-3 text-left"
            >
              <div className="w-10 h-10 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/60 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Alumni Directory</p>
                <p className="text-white/35 text-xs mt-0.5 leading-relaxed">
                  Find your brothers by year or industry.
                </p>
              </div>
              <span className="text-[#c9a84c]/50 text-[0.6rem] tracking-[0.2em] uppercase mt-auto">
                Browse Roster →
              </span>
            </Link>

            <Link
              href="/map"
              className="group bg-[#040e07] hover:bg-[#06120a] transition-colors duration-300 p-7 flex flex-col gap-3 text-left"
            >
              <div className="w-10 h-10 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/60 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">College Map</p>
                <p className="text-white/35 text-xs mt-0.5 leading-relaxed">
                  See where brothers landed, campus by campus.
                </p>
              </div>
              <span className="text-[#c9a84c]/50 text-[0.6rem] tracking-[0.2em] uppercase mt-auto">
                Explore Map →
              </span>
            </Link>

          </div>

          <p className="text-white/15 text-[0.6rem] tracking-[0.35em] uppercase mt-10">
            Enter to Learn · Leave to Serve
          </p>
        </div>
      </section>
    </main>
  );
}
