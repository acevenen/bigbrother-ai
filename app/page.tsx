import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#040e07] text-white overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] backdrop-blur-sm bg-[#040e07]/80">
        <span className="text-[#c9a84c] font-bold tracking-[0.25em] text-xs uppercase">
          Brotherhood Buddy
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/directory"
            className="text-white/50 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Directory
          </Link>
          <Link
            href="/chat"
            className="text-white/50 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Big Brother
          </Link>
          <Link
            href="/verify"
            className="text-white/50 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Sign In →
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-[#1a4a24] opacity-[0.18] blur-[140px]" />
        </div>

        {/* Eyebrow */}
        <div className="relative flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-[#c9a84c]/60" />
          <span className="text-[#c9a84c] text-[0.65rem] tracking-[0.45em] uppercase font-medium">
            De La Salle High School · Walnut Creek, CA
          </span>
          <div className="w-8 h-px bg-[#c9a84c]/60" />
        </div>

        {/* Main heading */}
        <h1 className="relative font-black leading-[0.9] tracking-tight mb-8">
          <span className="block text-[clamp(3.5rem,12vw,9rem)] text-white">
            Brotherhood
          </span>
          <span className="block text-[clamp(3.5rem,12vw,9rem)] text-[#c9a84c]">
            Buddy
          </span>
        </h1>

        {/* Decorative rule */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-white/75 font-light tracking-wide max-w-lg mb-4">
          Your older brother never left.
          <br className="hidden sm:block" /> He just leveled up.
        </p>

        {/* Description */}
        <p className="text-white/40 text-[0.95rem] max-w-sm md:max-w-md leading-relaxed mb-10">
          An AI that knows De La Salle like you do. A verified directory of brothers
          who&apos;ve walked the same halls. For Lancers, by Lancers.
        </p>

        {/* CTA */}
        <Link
          href="/verify"
          className="group inline-flex items-center gap-3 bg-[#c9a84c] text-[#040e07] font-bold px-10 py-4 text-[0.8rem] tracking-[0.2em] uppercase hover:bg-[#e4c56a] transition-colors duration-200"
        >
          Join the Brotherhood
          <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20 animate-bounce">
          <span className="text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────── */}
      <div className="border-y border-white/[0.06] px-6 md:px-12 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-white/[0.06] text-center">
          {[
            { stat: "50+", label: "Years of Brotherhood" },
            { stat: "3,000+", label: "Alumni Network" },
            { stat: "1", label: "Brotherhood" },
          ].map(({ stat, label }) => (
            <div key={label} className="px-4 md:px-8 flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black text-[#c9a84c]">{stat}</span>
              <span className="text-white/30 text-[0.65rem] tracking-[0.2em] uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto w-full">

        <div className="flex items-center gap-3 mb-16">
          <div className="w-6 h-px bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-[0.65rem] tracking-[0.4em] uppercase font-medium">
            Built for Lancers
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
          More than a network.
          <br />
          <span className="text-white/30">A brotherhood.</span>
        </h2>
        <p className="text-white/35 max-w-xl mb-16 leading-relaxed text-[0.95rem]">
          Brotherhood Buddy brings together AI intelligence, a verified alumni directory,
          and a members-only community — so no Lancer ever has to navigate life alone
          after graduation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.07]">

          {/* Big Brother AI */}
          <div className="group bg-[#040e07] hover:bg-[#06120a] transition-colors duration-300 p-8 md:p-10 flex flex-col gap-5">
            <div className="w-11 h-11 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/70 flex items-center justify-center transition-colors duration-300">
              <svg className="w-5 h-5 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-2">Big Brother</h3>
              <p className="text-white/35 leading-relaxed text-sm">
                An AI steeped in De La Salle culture. Ask about traditions, get real
                career advice, or just talk to someone who gets it. He knows because
                he&apos;s been there too.
              </p>
            </div>
            <div className="mt-auto pt-5 border-t border-white/[0.06]">
              <span className="text-[#c9a84c]/60 text-[0.6rem] tracking-[0.3em] uppercase">
                Powered by Anthropic Claude
              </span>
            </div>
          </div>

          {/* Alumni Directory */}
          <Link href="/directory" className="group bg-[#040e07] hover:bg-[#06120a] transition-colors duration-300 p-8 md:p-10 flex flex-col gap-5">
            <div className="w-11 h-11 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/70 flex items-center justify-center transition-colors duration-300">
              <svg className="w-5 h-5 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-2">Alumni Directory</h3>
              <p className="text-white/35 leading-relaxed text-sm">
                Find brothers by grad year, industry, or city. Every profile is real,
                every face a Lancer. One click to reach out and make the connection.
              </p>
            </div>
            <div className="mt-auto pt-5 border-t border-white/[0.06]">
              <span className="text-[#c9a84c]/60 text-[0.6rem] tracking-[0.3em] uppercase">
                Verified Profiles Only
              </span>
            </div>
          </Link>

          {/* Lancers Only */}
          <div className="group bg-[#040e07] hover:bg-[#06120a] transition-colors duration-300 p-8 md:p-10 flex flex-col gap-5">
            <div className="w-11 h-11 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/70 flex items-center justify-center transition-colors duration-300">
              <svg className="w-5 h-5 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-2">Lancers Only</h3>
              <p className="text-white/35 leading-relaxed text-sm">
                This space is built on trust. Access is verified — current students and
                alumni only. The brotherhood is real, and so is the gate that keeps it
                that way.
              </p>
            </div>
            <div className="mt-auto pt-5 border-t border-white/[0.06]">
              <span className="text-[#c9a84c]/60 text-[0.6rem] tracking-[0.3em] uppercase">
                Students &amp; Alumni Only
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="relative px-6 md:px-12 py-28 md:py-44 flex flex-col items-center text-center overflow-hidden">

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#1a4a24] opacity-[0.15] blur-[120px]" />
        </div>

        <div className="relative flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-[#c9a84c]/60" />
          <span className="text-[#c9a84c] text-[0.65rem] tracking-[0.45em] uppercase font-medium">
            Your brothers are waiting
          </span>
          <div className="w-8 h-px bg-[#c9a84c]/60" />
        </div>

        <h2 className="relative text-4xl md:text-6xl lg:text-[5.5rem] font-black tracking-tight mb-6 leading-[0.95] max-w-4xl">
          The halls may be
          <br />behind you.
          <br />
          <span className="text-[#c9a84c]">The brotherhood isn&apos;t.</span>
        </h2>

        <p className="text-white/35 max-w-sm mb-12 leading-relaxed text-[0.95rem]">
          Thousands of De La Salle alumni are already out there. Now there&apos;s a place
          to find them — and a brother waiting to help.
        </p>

        <Link
          href="/verify"
          className="group relative inline-flex items-center gap-3 bg-[#c9a84c] text-[#040e07] font-bold px-12 py-5 text-[0.8rem] tracking-[0.2em] uppercase hover:bg-[#e4c56a] transition-colors duration-200 mb-14"
        >
          Join the Brotherhood
          <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>

        <p className="text-white/15 text-[0.6rem] tracking-[0.4em] uppercase">
          Enter to Learn · Leave to Serve
        </p>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-white/20 text-[0.65rem] tracking-[0.2em] uppercase">
          Brotherhood Buddy · brotherhoodbuddy.com
        </span>
        <span className="text-white/15 text-[0.65rem]">
          De La Salle High School Alumni &amp; Students
        </span>
      </footer>

    </main>
  );
}
