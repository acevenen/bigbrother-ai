"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Message } from "@/types/chat";

const GREETING: Message = {
  role: "assistant",
  content:
    "Hey brother. I'm Big Brother — an alum who's been where you are. Whether you need career advice, want to connect with the network, or just want to talk to someone who gets it — I'm here. What's on your mind?",
};

const RATE_LIMIT_KEY = "bb_daily_limit";
const DAILY_MAX = 10;

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getStoredLimit(): { count: number; day: string } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { count: 0, day: "" };
    return JSON.parse(raw);
  } catch {
    return { count: 0, day: "" };
  }
}

function checkAndIncrement(): { allowed: boolean; newCount: number } {
  const today = getTodayStr();
  const stored = getStoredLimit();
  const count = stored.day === today ? stored.count : 0;
  if (count >= DAILY_MAX) return { allowed: false, newCount: count };
  const newCount = count + 1;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: newCount, day: today }));
  return { allowed: true, newCount };
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <Avatar />
      <div className="bg-[#0a1f0d] border border-white/[0.08] rounded-2xl rounded-bl-none px-4 py-3.5">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 rounded-full bg-[#c9a84c]/60 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#1a4a24] border border-[#c9a84c]/40 flex items-center justify-center flex-shrink-0 mb-0.5">
      <span className="text-[#c9a84c] text-[0.6rem] font-black tracking-tight">
        BB
      </span>
    </div>
  );
}

function BigBrotherBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-3 items-end">
      <Avatar />
      <div className="max-w-[75%] md:max-w-[60%]">
        <p className="text-[0.6rem] text-[#c9a84c]/50 tracking-[0.25em] uppercase mb-1.5 ml-1">
          Big Brother
        </p>
        <div className="bg-[#0a1f0d] border border-white/[0.08] rounded-2xl rounded-bl-none px-4 py-3 text-white/90 text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] md:max-w-[60%]">
        <div className="bg-[#c9a84c] rounded-2xl rounded-br-none px-4 py-3 text-[#040e07] text-sm leading-relaxed font-medium">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limited, setLimited] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bb_user");
    if (!raw) { router.replace("/"); return; }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.verified) { router.replace("/"); return; }
      setReady(true);
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    const today = getTodayStr();
    const stored = getStoredLimit();
    if (stored.day === today && stored.count >= DAILY_MAX) {
      setLimited(true);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const { allowed, newCount } = checkAndIncrement();
    if (!allowed) {
      setLimited(true);
      return;
    }

    const userMessage: Message = { role: "user", content: trimmed };
    const next = [...messages, userMessage];

    setMessages(next);
    setInput("");
    setError(null);
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // API requires conversation to start with a user message — skip the
    // hardcoded greeting (which is UI-only) when building the payload.
    const firstUserIdx = next.findIndex((m) => m.role === "user");
    const apiMessages = next.slice(firstUserIdx);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok || !data.content) {
        throw new Error(data.error ?? "Unknown error");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setError("Something went wrong on my end, brother. Try again.");
    } finally {
      setIsLoading(false);
      if (newCount >= DAILY_MAX) setLimited(true);
    }
  }, [input, isLoading, messages]);

  if (!ready) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-[#040e07]">

      {/* ── Header ──────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/[0.06] bg-[#040e07]/95 backdrop-blur-sm z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-200 text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-bold text-white tracking-tight text-[0.95rem]">
            Big Brother
          </span>
          <span className="text-[#c9a84c]/50 text-[0.55rem] tracking-[0.3em] uppercase">
            De La Salle Alumni Network
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/directory"
            className="text-white/35 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Directory
          </Link>
          <Link
            href="/map"
            className="text-white/35 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Map
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-white/35 text-xs">Online</span>
          </div>
        </div>
      </header>

      {/* ── Message Thread ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

        {/* Eyebrow context */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[#c9a84c]/20" />
            <span className="text-white/20 text-[0.6rem] tracking-[0.3em] uppercase">
              Lancer Network · Verified
            </span>
            <div className="w-6 h-px bg-[#c9a84c]/20" />
          </div>
        </div>

        {messages.map((msg, i) =>
          msg.role === "assistant" ? (
            <BigBrotherBubble key={i} content={msg.content} />
          ) : (
            <UserBubble key={i} content={msg.content} />
          )
        )}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="flex justify-center">
            <p className="text-red-400/70 text-xs bg-red-400/5 border border-red-400/10 px-4 py-2 rounded-full">
              {error}
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar / Rate Limit ───────────────────── */}
      {limited ? (
        <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#040e07]/95 backdrop-blur-sm px-4 md:px-6 py-5">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
            <svg
              className="w-4 h-4 text-[#c9a84c]/40 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <p className="text-white/35 text-sm tracking-wide">
              You&apos;ve reached your limit for today, brother. Come back tomorrow.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#040e07]/95 backdrop-blur-sm px-4 md:px-6 py-4">
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
              placeholder="Say something, brother…"
              className="flex-1 resize-none overflow-hidden bg-[#06120a] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#c9a84c]/30 transition-colors duration-200 disabled:opacity-50 leading-relaxed"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              onClick={submit}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-[#c9a84c] hover:bg-[#e4c56a] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
              aria-label="Send message"
            >
              <svg
                className="w-4 h-4 text-[#040e07] translate-x-px group-hover:translate-x-0.5 transition-transform duration-150"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <p className="text-center text-white/15 text-[0.6rem] tracking-widest uppercase mt-3">
            Enter to Learn · Leave to Serve
          </p>
        </div>
      )}

    </div>
  );
}
