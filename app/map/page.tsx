"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "mapbox-gl/dist/mapbox-gl.css";
import { alumni } from "@/data/alumni";

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void; resize: () => void } | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    console.log("[map] token present:", !!token, "| first 10 chars:", token?.slice(0, 10));

    if (!token) {
      console.error("[map] NEXT_PUBLIC_MAPBOX_TOKEN is not set — map cannot initialize");
      setTokenMissing(true);
      return;
    }

    const container = mapContainer.current;
    console.log("[map] container size:", container.offsetWidth, "x", container.offsetHeight);

    let mapInstance: { remove: () => void; resize: () => void } | null = null;

    import("mapbox-gl").then((mod) => {
      if (!mapContainer.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapboxgl = mod.default as any;
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-120.5, 37.0],
        zoom: 5.5,
        minZoom: 3,
        maxZoom: 14,
      });

      mapRef.current = map;
      mapInstance = map;

      map.on("error", (e: unknown) => {
        console.error("[map] Mapbox GL error:", e);
      });

      map.on("load", () => {
        console.log("[map] loaded successfully");
        // Force re-measure in case container was 0px at init time
        map.resize();

        alumni
          .filter((a) => a.coordinates)
          .forEach((alum) => {
            const el = document.createElement("div");
            el.style.cssText = `
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: #1a4a24;
              border: 2px solid #c9a84c;
              cursor: pointer;
              box-shadow: 0 0 10px rgba(201,168,76,0.45), 0 0 20px rgba(26,74,36,0.35);
              transition: transform 0.15s ease, box-shadow 0.15s ease;
            `;

            const yearShort = `'${alum.gradYear.toString().slice(2)}`;

            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 16,
              className: "bb-popup",
              maxWidth: "260px",
            }).setHTML(`
              <div style="
                background: #06120a;
                border: 1px solid rgba(201,168,76,0.22);
                padding: 11px 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                box-shadow: 0 12px 40px rgba(0,0,0,0.8);
              ">
                <div style="
                  color: rgba(201,168,76,0.55);
                  font-size: 9px;
                  letter-spacing: 0.32em;
                  text-transform: uppercase;
                  margin-bottom: 5px;
                ">${yearShort} · DLS</div>
                <div style="
                  color: #ffffff;
                  font-weight: 700;
                  font-size: 13px;
                  line-height: 1.25;
                  margin-bottom: 4px;
                ">${alum.name}</div>
                <div style="
                  color: rgba(255,255,255,0.45);
                  font-size: 11px;
                  line-height: 1.4;
                ">${alum.college ?? alum.location}</div>
              </div>
            `);

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat(alum.coordinates!)
              .setPopup(popup)
              .addTo(map);

            el.addEventListener("mouseenter", () => {
              el.style.transform = "scale(1.5)";
              el.style.boxShadow =
                "0 0 16px rgba(201,168,76,0.7), 0 0 32px rgba(26,74,36,0.5)";
              if (!marker.getPopup()?.isOpen()) marker.togglePopup();
            });
            el.addEventListener("mouseleave", () => {
              el.style.transform = "scale(1)";
              el.style.boxShadow =
                "0 0 10px rgba(201,168,76,0.45), 0 0 20px rgba(26,74,36,0.35)";
              if (marker.getPopup()?.isOpen()) marker.togglePopup();
            });
          });
      });
    });

    return () => {
      mapInstance?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    // Inline styles own the entire height chain — bypasses any Tailwind CSS ordering issues
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#040e07" }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="flex-shrink-0 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] bg-[#040e07]/95 backdrop-blur-sm z-10">
        <Link
          href="/"
          className="text-[#c9a84c] font-bold tracking-[0.25em] text-xs uppercase"
        >
          Brotherhood Buddy
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/directory"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Directory
          </Link>
          <Link
            href="/chat"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Big Brother
          </Link>
          <Link
            href="/verify"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Sign In →
          </Link>
        </div>
      </nav>

      {/* ── Map ─────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>

        {tokenMissing && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <p className="text-red-400 text-sm font-mono">
              NEXT_PUBLIC_MAPBOX_TOKEN is not set — check Vercel environment variables
            </p>
          </div>
        )}

        {/* Map container: inline styles guarantee Mapbox reads a real pixel size */}
        <div
          ref={mapContainer}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-[#040e07]/90 border border-white/[0.08] px-4 py-3 z-10 pointer-events-none">
          <p className="text-[#c9a84c]/50 text-[0.58rem] tracking-[0.32em] uppercase mb-2.5">
            Alumni Locations
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#1a4a24] border-2 border-[#c9a84c] flex-shrink-0" />
            <span className="text-white/30 text-xs">Hover to see details</span>
          </div>
        </div>

        {/* Title badge */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#040e07]/90 border border-white/[0.08] px-5 py-2.5 z-10 pointer-events-none flex items-center gap-3">
          <div className="w-4 h-px bg-[#c9a84c]/50" />
          <span className="text-[#c9a84c] text-[0.6rem] tracking-[0.4em] uppercase font-medium">
            De La Salle Brotherhood · Where We Are
          </span>
          <div className="w-4 h-px bg-[#c9a84c]/50" />
        </div>
      </div>

      {/* Mapbox popup style overrides */}
      <style>{`
        .bb-popup .mapboxgl-popup-content {
          background: transparent;
          padding: 0;
          box-shadow: none;
          border-radius: 0;
        }
        .bb-popup .mapboxgl-popup-tip {
          display: none;
        }
        .mapboxgl-ctrl-bottom-right,
        .mapboxgl-ctrl-bottom-left {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
