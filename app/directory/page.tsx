"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { alumni } from "@/data/alumni";
import type { Alumni } from "@/types/index";

const INDUSTRIES = ["All", "Tech", "Finance", "Medicine", "Law", "Creative", "Entrepreneurship"];
const GRAD_YEARS = ["All", "2010", "2015", "2018", "2020", "2022", "2024"];

// ── Outreach Modal ──────────────────────────────────────────────────────────

function OutreachModal({
  alum,
  onClose,
}: {
  alum: Alumni;
  onClose: () => void;
}) {
  const firstName = alum.name.split(" ")[0];
  const [message, setMessage] = useState(
    `Hey ${firstName}, my name is [Your Name]. I'm a [year] alum / current student at De La Salle. Wanted to reach out and connect.`
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const el = document.createElement("textarea");
      el.value = message;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-[#06120a] border border-white/[0.1] sm:border-[#c9a84c]/10 p-6 sm:p-7">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#c9a84c] text-[0.58rem] tracking-[0.4em] uppercase mb-1.5">
              Reach Out
            </p>
            <h3 className="text-white font-bold text-lg leading-tight">
              {alum.name}
            </h3>
            <p className="text-white/35 text-xs mt-1">{alum.currentRole}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 text-white/25 hover:text-white/60 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="mb-1">
          <p className="text-white/25 text-[0.6rem] tracking-[0.25em] uppercase mb-2">
            Your message
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full bg-[#040e07] border border-white/[0.08] focus:border-[#c9a84c]/25 px-3.5 py-3 text-white/70 text-sm leading-relaxed resize-none focus:outline-none transition-colors placeholder-white/20"
          />
        </div>
        <p className="text-white/20 text-[0.6rem] mb-5">
          Edit before copying — make it yours.
        </p>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={handleCopy}
            className="flex-1 bg-[#c9a84c] hover:bg-[#e4c56a] active:bg-[#c9a84c] text-[#040e07] font-bold text-[0.72rem] tracking-[0.18em] uppercase py-3 transition-colors duration-150"
          >
            {copied ? "Copied ✓" : "Copy Message"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-white/[0.1] hover:border-white/20 text-white/35 hover:text-white/60 text-[0.72rem] tracking-[0.15em] uppercase transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Alumni Card ─────────────────────────────────────────────────────────────

function AlumniCard({
  alum,
  onOutreach,
}: {
  alum: Alumni;
  onOutreach: () => void;
}) {
  const initials = alum.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const yearShort = `'${alum.gradYear.toString().slice(2)}`;

  return (
    <div className="group flex flex-col bg-[#040e07] border border-white/[0.07] hover:border-[#c9a84c]/20 transition-all duration-300">

      {/* Top section */}
      <div className="p-6 pb-4 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full flex-shrink-0 bg-[#1a4a24] border border-[#c9a84c]/25 group-hover:border-[#c9a84c]/50 flex items-center justify-center transition-colors duration-300">
          <span className="text-[#c9a84c] text-xs font-black tracking-tight">
            {initials}
          </span>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-white font-bold text-[0.95rem] leading-snug truncate">
            {alum.name}
          </h3>
          <p className="text-white/40 text-xs mt-0.5 truncate">
            {alum.currentRole}
          </p>
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="border border-[#c9a84c]/30 text-[#c9a84c] text-[0.58rem] tracking-[0.2em] uppercase px-2 py-0.5">
              {alum.industry}
            </span>
            <span className="text-white/20 text-[0.65rem] tracking-[0.15em]">
              {yearShort} · {alum.location}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/[0.05]" />

      {/* Bio */}
      <div className="px-6 pt-4 pb-3 flex-1">
        <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
          {alum.bio}
        </p>
      </div>

      {/* Accomplishments */}
      <div className="px-6 pb-5">
        <p className="text-[#c9a84c]/40 text-[0.58rem] tracking-[0.28em] uppercase mb-2">
          Highlights
        </p>
        <p className="text-white/25 text-xs leading-relaxed line-clamp-2">
          {alum.accomplishments}
        </p>
      </div>

      {/* Outreach button */}
      <div className="border-t border-white/[0.06] px-6 py-4 mt-auto">
        <button
          onClick={onOutreach}
          className="w-full border border-white/[0.1] group-hover:border-[#c9a84c]/35 text-white/40 group-hover:text-[#c9a84c]/80 text-[0.68rem] tracking-[0.22em] uppercase py-2.5 transition-all duration-300 hover:bg-[#c9a84c]/5"
        >
          Outreach →
        </button>
      </div>
    </div>
  );
}

// ── Filter Pill ─────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 text-[0.62rem] tracking-[0.2em] uppercase transition-all duration-150 border whitespace-nowrap ${
        active
          ? "bg-[#c9a84c] border-[#c9a84c] text-[#040e07] font-bold"
          : "border-white/[0.1] text-white/40 hover:text-white/70 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function DirectoryPage() {
  const [ready, setReady] = useState(false);
  const [industryFilter, setIndustryFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [activeAlum, setActiveAlum] = useState<Alumni | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const filtered = useMemo(() => {
    return alumni.filter((a) => {
      const matchIndustry =
        industryFilter === "All" || a.industry === industryFilter;
      const matchYear =
        yearFilter === "All" || a.gradYear.toString() === yearFilter;
      return matchIndustry && matchYear;
    });
  }, [industryFilter, yearFilter]);

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-[#040e07] text-white">

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] backdrop-blur-sm bg-[#040e07]/80">
        <Link
          href="/"
          className="text-[#c9a84c] font-bold tracking-[0.25em] text-xs uppercase"
        >
          Brotherhood Buddy
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/chat"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Big Brother
          </Link>
          <Link
            href="/map"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Map
          </Link>
          <Link
            href="/"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-14 md:pt-40 md:pb-16 px-6 md:px-12">

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#1a4a24] opacity-[0.14] blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-6 h-px bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[0.62rem] tracking-[0.42em] uppercase font-medium">
              De La Salle High School · Concord, CA
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.92] mb-4">
                The Brotherhood
                <br />
                <span className="text-[#c9a84c]">Roster</span>
              </h1>
              <p className="text-white/35 text-[0.95rem] max-w-md leading-relaxed">
                Spartans who came before you. Find them by class year or industry,
                and reach out. That's what brothers do.
              </p>
            </div>

            {/* Count badge */}
            <div className="flex-shrink-0 border border-white/[0.08] px-5 py-4 self-start md:self-auto">
              <p className="text-[#c9a84c] text-2xl font-black">
                {filtered.length}
                <span className="text-white/20 text-sm font-normal ml-1">
                  / {alumni.length}
                </span>
              </p>
              <p className="text-white/25 text-[0.6rem] tracking-[0.25em] uppercase mt-0.5">
                {filtered.length === 1 ? "Brother" : "Brothers"} showing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Filters ─────────────────────────────────────── */}
      <section className="sticky top-[65px] z-30 bg-[#040e07]/95 backdrop-blur-sm border-b border-white/[0.06] px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto space-y-3">

          {/* Industry filter */}
          <div className="flex items-start gap-3">
            <span className="text-white/20 text-[0.58rem] tracking-[0.25em] uppercase mt-2 flex-shrink-0 w-14">
              Industry
            </span>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <FilterPill
                  key={ind}
                  label={ind}
                  active={industryFilter === ind}
                  onClick={() => setIndustryFilter(ind)}
                />
              ))}
            </div>
          </div>

          {/* Year filter */}
          <div className="flex items-start gap-3">
            <span className="text-white/20 text-[0.58rem] tracking-[0.25em] uppercase mt-2 flex-shrink-0 w-14">
              Class
            </span>
            <div className="flex flex-wrap gap-2">
              {GRAD_YEARS.map((yr) => (
                <FilterPill
                  key={yr}
                  label={yr === "All" ? "All Years" : `'${yr.slice(2)}`}
                  active={yearFilter === yr}
                  onClick={() => setYearFilter(yr)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid ────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-10 md:py-12 max-w-7xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-px bg-[#c9a84c]/30 mb-6" />
            <p className="text-white/25 text-sm tracking-wide">
              No brothers match those filters yet.
            </p>
            <button
              onClick={() => {
                setIndustryFilter("All");
                setYearFilter("All");
              }}
              className="mt-6 text-[#c9a84c]/50 hover:text-[#c9a84c] text-xs tracking-[0.2em] uppercase transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
            {filtered.map((alum) => (
              <AlumniCard
                key={alum.id}
                alum={alum}
                onOutreach={() => setActiveAlum(alum)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-white/20 text-[0.65rem] tracking-[0.2em] uppercase">
          Brotherhood Buddy · brotherhoodbuddy.com
        </span>
        <span className="text-white/10 text-[0.65rem]">
          Enter to Learn · Leave to Serve
        </span>
      </footer>

      {/* ── Outreach Modal ──────────────────────────────── */}
      {activeAlum && (
        <OutreachModal
          alum={activeAlum}
          onClose={() => setActiveAlum(null)}
        />
      )}
    </main>
  );
}
