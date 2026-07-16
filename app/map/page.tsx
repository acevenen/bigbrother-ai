"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "mapbox-gl/dist/mapbox-gl.css";
import { alumni } from "@/data/alumni";
import type { Alumni } from "@/types/index";

// ── Types ────────────────────────────────────────────────────────────────────

interface SchoolGroup {
  id: string;
  name: string;
  lngLat: [number, number];
  enrolled: Alumni[];
  graduated: Alumni[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function groupBySchool(data: Alumni[]): SchoolGroup[] {
  const map = new Map<string, SchoolGroup>();
  for (const alum of data) {
    if (!alum.schoolName || !alum.coordinates) continue;
    if (!map.has(alum.schoolName)) {
      map.set(alum.schoolName, {
        id: alum.schoolName.toLowerCase().replace(/[\s/,]+/g, "-"),
        name: alum.schoolName,
        lngLat: alum.coordinates,
        enrolled: [],
        graduated: [],
      });
    }
    const group = map.get(alum.schoolName)!;
    if (alum.enrollmentStatus === "enrolled") group.enrolled.push(alum);
    else group.graduated.push(alum);
  }
  return Array.from(map.values());
}

// Teardrop/droppin SVG — DLS green body, gold border, gold inner dot
const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
  <path d="M14 1.5C7.6 1.5 2.5 6.6 2.5 13c0 9.2 11.5 23.5 11.5 23.5S25.5 22.2 25.5 13C25.5 6.6 20.4 1.5 14 1.5Z" fill="#1a4a24" stroke="#c9a84c" stroke-width="2"/>
  <circle cx="14" cy="12.5" r="5" fill="#c9a84c" opacity="0.92"/>
</svg>`;

const PIN_IMG_SRC =
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(PIN_SVG);

// ── School panel component ────────────────────────────────────────────────────

interface PanelProps {
  school: SchoolGroup;
  x: number;
  y: number;
  containerW: number;
  containerH: number;
  onClose: () => void;
}

function SchoolPanel({ school, x, y, containerW, containerH, onClose }: PanelProps) {
  const [tab, setTab] = useState<"enrolled" | "graduated">(
    school.enrolled.length > 0 ? "enrolled" : "graduated"
  );

  // Reset tab when school changes
  useEffect(() => {
    setTab(school.enrolled.length > 0 ? "enrolled" : "graduated");
  }, [school]);

  const list = tab === "enrolled" ? school.enrolled : school.graduated;

  // Decide whether panel opens left or right of pin
  const PANEL_W = 264;
  const PANEL_OFFSET = 16; // gap from pin tip
  const openLeft = x + PANEL_W + PANEL_OFFSET > containerW - 16;
  const panelLeft = openLeft ? x - PANEL_W - PANEL_OFFSET : x + PANEL_OFFSET;

  // Clamp vertically so panel doesn't overflow bottom
  const PANEL_MAX_H = 320;
  const rawTop = y - 38; // align with top of pin
  const panelTop = Math.min(rawTop, containerH - PANEL_MAX_H - 12);

  return (
    <div
      style={{
        position: "absolute",
        left: panelLeft,
        top: Math.max(8, panelTop),
        width: PANEL_W,
        zIndex: 30,
        pointerEvents: "auto",
      }}
    >
      {/* Card */}
      <div
        style={{
          background: "#06120a",
          border: "1px solid rgba(201,168,76,0.22)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.85)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 14px 10px",
            borderBottom: "1px solid rgba(201,168,76,0.12)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                color: "rgba(201,168,76,0.55)",
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              DLS Alumni Network
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {school.name}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 18,
              lineHeight: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 0 4px",
              flexShrink: 0,
              marginTop: -2,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          {(["enrolled", "graduated"] as const).map((t) => {
            const count = t === "enrolled" ? school.enrolled.length : school.graduated.length;
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background: "none",
                  border: "none",
                  borderBottom: active
                    ? "2px solid #c9a84c"
                    : "2px solid transparent",
                  color: active
                    ? "#c9a84c"
                    : "rgba(255,255,255,0.3)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: count === 0 ? "default" : "pointer",
                  opacity: count === 0 ? 0.4 : 1,
                  transition: "color 0.15s, border-color 0.15s",
                }}
                disabled={count === 0}
              >
                {t} · {count}
              </button>
            );
          })}
        </div>

        {/* Alumni list */}
        <div style={{ maxHeight: 220, overflowY: "auto" }}>
          {list.length === 0 ? (
            <div
              style={{
                padding: "16px 14px",
                color: "rgba(255,255,255,0.25)",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              No {tab} alumni on record
            </div>
          ) : (
            list.map((alum, i) => (
              <div
                key={alum.id}
                style={{
                  padding: "10px 14px",
                  borderBottom:
                    i < list.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {alum.name}
                  </span>
                  <span
                    style={{
                      color: "rgba(201,168,76,0.6)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  >
                    &apos;{alum.gradYear.toString().slice(2)}
                  </span>
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 10.5,
                    lineHeight: 1.4,
                  }}
                >
                  {alum.currentRole}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connector line from panel edge toward pin */}
      <div
        style={{
          position: "absolute",
          top: 38 + 5,
          [openLeft ? "right" : "left"]: -PANEL_OFFSET,
          width: PANEL_OFFSET,
          height: 1,
          background: "rgba(201,168,76,0.25)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const selectedRef = useRef<SchoolGroup | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [panel, setPanel] = useState<{ school: SchoolGroup; x: number; y: number } | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }

    const schools = groupBySchool(alumni);

    import("mapbox-gl").then((mod) => {
      if (!mapContainer.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapboxgl = mod.default as any;
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-120.0, 37.2],
        zoom: 5.5,
        minZoom: 3,
        maxZoom: 14,
      });

      mapRef.current = map;

      map.on("load", () => {
        map.resize();

        // Capture container size for panel positioning
        const rect = mapContainer.current!.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });

        // Load pin image, then add source + symbol layer
        const img = new Image(28, 38);
        img.onload = () => {
          map.addImage("school-pin", img);

          map.addSource("schools", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: schools.map((s) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: s.lngLat },
                properties: { id: s.id, name: s.name },
              })),
            },
          });

          map.addLayer({
            id: "school-pins",
            type: "symbol",
            source: "schools",
            layout: {
              "icon-image": "school-pin",
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "icon-size": 1,
            },
          });

          // ── Hover tooltip ───────────────────────────────
          map.on("mouseenter", "school-pins", (e: any) => {
            map.getCanvas().style.cursor = "pointer";
            setTooltip({
              name: e.features[0].properties.name,
              x: e.point.x,
              y: e.point.y,
            });
          });
          map.on("mousemove", "school-pins", (e: any) => {
            setTooltip({
              name: e.features[0].properties.name,
              x: e.point.x,
              y: e.point.y,
            });
          });
          map.on("mouseleave", "school-pins", () => {
            map.getCanvas().style.cursor = "";
            setTooltip(null);
          });

          // ── Click → open panel ──────────────────────────
          map.on("click", "school-pins", (e: any) => {
            e.preventDefault(); // stop propagation to the map click below
            const id = e.features[0].properties.id;
            const school = schools.find((s) => s.id === id)!;
            selectedRef.current = school;
            setPanel({ school, x: e.point.x, y: e.point.y });
          });

          // Click elsewhere → close panel
          map.on("click", (e: any) => {
            const hits = map.queryRenderedFeatures(e.point, {
              layers: ["school-pins"],
            });
            if (hits.length === 0) {
              selectedRef.current = null;
              setPanel(null);
            }
          });
        };

        img.src = PIN_IMG_SRC;
      });

      // Re-project panel anchor on every map move so it tracks the pin
      map.on("move", () => {
        if (!selectedRef.current) return;
        const pt = map.project(selectedRef.current.lngLat);
        setPanel((prev) =>
          prev ? { ...prev, x: pt.x, y: pt.y } : null
        );
      });

      // Keep container size in sync on resize
      const ro = new ResizeObserver(() => {
        const rect = mapContainer.current?.getBoundingClientRect();
        if (rect) setContainerSize({ w: rect.width, h: rect.height });
      });
      if (mapContainer.current) ro.observe(mapContainer.current);

      return () => ro.disconnect();
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "#040e07",
      }}
    >
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
            href="/"
            className="text-white/40 hover:text-white text-sm transition-colors duration-200 tracking-wide"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* ── Map area ─────────────────────────────────── */}
      <div
        ref={wrapperRef}
        style={{ flex: 1, position: "relative", minHeight: 0 }}
      >
        {tokenMissing && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <p className="text-red-400 text-sm font-mono">
              NEXT_PUBLIC_MAPBOX_TOKEN is not set — check Vercel environment variables
            </p>
          </div>
        )}

        {/* Map canvas */}
        <div
          ref={mapContainer}
          style={{ position: "absolute", inset: 0 }}
        />

        {/* Hover tooltip — appears above pin tip */}
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y - 52,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              zIndex: 25,
            }}
          >
            <div
              style={{
                background: "#06120a",
                border: "1px solid rgba(201,168,76,0.3)",
                padding: "5px 11px",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
              }}
            >
              <span
                style={{
                  color: "#c9a84c",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                {tooltip.name}
              </span>
            </div>
            {/* Small caret */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid rgba(201,168,76,0.3)",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        {/* Click panel — anchored to pin via map.project() */}
        {panel && (
          <SchoolPanel
            school={panel.school}
            x={panel.x}
            y={panel.y}
            containerW={containerSize.w}
            containerH={containerSize.h}
            onClose={() => {
              selectedRef.current = null;
              setPanel(null);
            }}
          />
        )}

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-[#040e07]/90 border border-white/[0.08] px-4 py-3 z-10 pointer-events-none">
          <p className="text-[#c9a84c]/50 text-[0.58rem] tracking-[0.32em] uppercase mb-2.5">
            Alumni Locations
          </p>
          <div className="flex items-center gap-2.5">
            <svg width="14" height="19" viewBox="0 0 28 38" style={{ flexShrink: 0 }}>
              <path
                d="M14 1.5C7.6 1.5 2.5 6.6 2.5 13c0 9.2 11.5 23.5 11.5 23.5S25.5 22.2 25.5 13C25.5 6.6 20.4 1.5 14 1.5Z"
                fill="#1a4a24"
                stroke="#c9a84c"
                strokeWidth="2"
              />
              <circle cx="14" cy="12.5" r="5" fill="#c9a84c" opacity="0.92" />
            </svg>
            <span className="text-white/30 text-xs">Click pin to see alumni</span>
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
    </div>
  );
}
